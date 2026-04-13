"use client";

import { useEffect, useRef } from "react";

interface Crack {
  x: number;
  y: number;
  startX: number;
  startY: number;
  dx: number;
  dy: number;
  life: number;
  maxLife: number;
  alpha: number;
  width: number;
  healing: boolean;
  branches: Array<{
    x: number;
    y: number;
    dx: number;
    dy: number;
    life: number;
    maxLife: number;
  }>;
  particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    size: number;
  }>;
}

/**
 * Canvas-based animated crack effect (toned-down middle-ground version).
 * Runs at half frequency with faded alpha for a subtle background texture.
 */
export function FractureBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let cracks: Crack[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const spawnCrack = () => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const angle = Math.random() * Math.PI * 2;
      const numBranches = Math.floor(Math.random() * 3);
      const branches = Array.from({ length: numBranches }, (_, i) => ({
        x,
        y,
        dx: Math.cos(angle + (i + 1) * 0.7) * (1.5 + Math.random()),
        dy: Math.sin(angle + (i + 1) * 0.7) * (1.5 + Math.random()),
        life: 0,
        maxLife: 20 + Math.random() * 40,
      }));
      cracks.push({
        x,
        y,
        startX: x,
        startY: y,
        dx: Math.cos(angle) * (2.5 + Math.random() * 2),
        dy: Math.sin(angle) * (2.5 + Math.random() * 2),
        life: 0,
        maxLife: 80 + Math.random() * 100,
        alpha: 0.8 + Math.random() * 0.2,
        width: 0.8 + Math.random() * 1.5,
        healing: false,
        branches,
        particles: [],
      });
    };

    let lastSpawn = 0;
    let frame = 0;

    const draw = (time: number) => {
      ctx.fillStyle = "rgba(252, 252, 251, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      frame++;

      // Half-frequency spawning for subtlety
      if (time - lastSpawn > 1200 + Math.random() * 1200) {
        if (cracks.length < 6) spawnCrack();
        lastSpawn = time;
      }

      cracks = cracks.filter((c) => c.life < c.maxLife + 30);
      cracks.forEach((c) => {
        const progress = c.life / c.maxLife;
        const fadeIn = Math.min(1, progress * 5);
        const fadeOut = progress > 0.75 ? 1 - (progress - 0.75) / 0.25 : 1;
        const alpha = c.alpha * fadeIn * fadeOut;

        if (alpha > 0) {
          ctx.shadowColor = "rgba(229, 62, 62, 0.4)";
          ctx.shadowBlur = 4;
          ctx.strokeStyle = `rgba(229, 62, 62, ${alpha * 0.5})`;
          ctx.lineWidth = c.width * 0.7;

          const prevX = c.x - c.dx;
          const prevY = c.y - c.dy;
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(c.x, c.y);
          ctx.stroke();

          ctx.shadowBlur = 6;
          ctx.strokeStyle = `rgba(255, 220, 220, ${alpha * 0.3})`;
          ctx.lineWidth = c.width * 0.3;
          ctx.stroke();
          ctx.shadowBlur = 0;

          if (Math.random() < 0.15 && c.life < c.maxLife * 0.8) {
            c.particles.push({
              x: c.x + (Math.random() - 0.5) * 6,
              y: c.y + (Math.random() - 0.5) * 6,
              vx: (Math.random() - 0.5) * 1.5,
              vy: (Math.random() - 0.5) * 1.5,
              life: 0,
              size: 0.5 + Math.random() * 1.5,
            });
          }
        }

        c.particles = c.particles.filter((p) => p.life < 60);
        c.particles.forEach((p) => {
          const pa = Math.max(0, (1 - p.life / 60) * 0.45);
          ctx.shadowColor = "rgba(229, 62, 62, 0.3)";
          ctx.shadowBlur = 2;
          ctx.fillStyle = `rgba(229, 62, 62, ${pa})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1 - p.life / 80), 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          p.x += p.vx;
          p.y += p.vy;
          p.vy -= 0.02;
          p.life++;
        });

        c.branches.forEach((b) => {
          if (b.life < b.maxLife) {
            const bp = b.life / b.maxLife;
            const ba = alpha * (1 - bp) * 0.6;
            if (ba > 0) {
              ctx.shadowColor = "rgba(229, 62, 62, 0.2)";
              ctx.shadowBlur = 2;
              ctx.strokeStyle = `rgba(229, 62, 62, ${ba * 0.6})`;
              ctx.lineWidth = c.width * 0.4;
              ctx.beginPath();
              ctx.moveTo(b.x - b.dx, b.y - b.dy);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
              ctx.shadowBlur = 0;
            }
            b.x += b.dx + (Math.random() - 0.5) * 0.8;
            b.y += b.dy + (Math.random() - 0.5) * 0.8;
            b.life++;
          }
        });

        if (c.life < c.maxLife) {
          c.x += c.dx + (Math.random() - 0.5) * 2;
          c.y += c.dy + (Math.random() - 0.5) * 2;
        }
        c.life++;
      });

      // Occasional stray pixel
      if (frame % 6 === 0) {
        const nx = Math.random() * canvas.width;
        const ny = Math.random() * canvas.height;
        ctx.fillStyle = `rgba(229, 62, 62, ${Math.random() * 0.04})`;
        ctx.fillRect(nx, ny, 1, 1);
      }

      animFrame = requestAnimationFrame(draw);
    };

    animFrame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        background: "#FCFCFB",
      }}
    />
  );
}
