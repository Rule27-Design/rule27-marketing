"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// ── Navigation configuration ────────────────────────────────────────────────

const NAV_ITEMS = [
  { name: "Home", path: "/" },
  { name: "Capabilities", path: "/capabilities" },
  { name: "Case Studies", path: "/case-studies" },
  { name: "Articles", path: "/articles" },
  { name: "Innovation", path: "/innovation" },
  { name: "About", path: "/about" },
];

// ── Throttle utility ────────────────────────────────────────────────────────

function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): T {
  let lastExecTime = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return ((...args: unknown[]) => {
    const now = Date.now();
    if (now - lastExecTime > delay) {
      func(...args);
      lastExecTime = now;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (now - lastExecTime));
    }
  }) as T;
}

// ── Desktop nav link ────────────────────────────────────────────────────────

function DesktopNavLink({
  item,
  isActive,
}: {
  item: (typeof NAV_ITEMS)[number];
  isActive: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={item.path}
      aria-current={isActive ? "page" : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        padding: "0 1rem",
        height: "64px",
        display: "flex",
        alignItems: "center",
        fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
        fontSize: "18px",
        fontWeight: 400,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: isActive
          ? "#E53E3E"
          : hovered
            ? "rgba(255,255,255,0.9)"
            : "rgba(255,255,255,0.55)",
        textDecoration: "none",
        transition: "color 0.2s ease",
        whiteSpace: "nowrap",
      }}
    >
      {item.name}
      {/* Active/hover indicator */}
      <span
        style={{
          position: "absolute",
          bottom: 0,
          left: "1rem",
          right: "1rem",
          height: "2px",
          background: "#E53E3E",
          transform: isActive || hovered ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left",
          transition: "transform 0.25s ease",
        }}
        aria-hidden="true"
      />
    </Link>
  );
}

// ── Mobile nav link ─────────────────────────────────────────────────────────

function MobileNavLink({
  item,
  isActive,
  onClick,
}: {
  item: (typeof NAV_ITEMS)[number];
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={item.path}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0.75rem 1rem",
        fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
        fontSize: "16px",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: isActive ? "#E53E3E" : "rgba(255,255,255,0.7)",
        textDecoration: "none",
        borderLeft: isActive
          ? "3px solid #E53E3E"
          : "3px solid transparent",
        transition: "all 0.2s ease",
        background: isActive ? "rgba(229,62,62,0.06)" : "transparent",
      }}
    >
      {item.name}
    </Link>
  );
}

// ── Main Header component ───────────────────────────────────────────────────

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Scroll handler
  const handleScroll = useCallback(
    throttle(() => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);
      setShowStickyCTA(scrollY > 500);
    }, 100),
    []
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Close menu on click outside
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Escape key closes menu
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when menu open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const isActivePath = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <>
      <header
        role="banner"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: isScrolled
            ? "rgba(8, 8, 8, 0.95)"
            : "rgba(8, 8, 8, 0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(229, 62, 62, 0.12)",
          height: "64px",
          transition: "background 0.3s ease, box-shadow 0.3s ease",
          boxShadow: isScrolled
            ? "0 4px 20px rgba(0,0,0,0.3)"
            : "none",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 1.5rem",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
            }}
            aria-label="Rule27 Design - Home"
          >
            <Image
              src="/assets/Logo/rule27-white-red.png"
              alt="Rule27 Design"
              width={120}
              height={28}
              style={{ height: "28px", width: "auto" }}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav
            role="navigation"
            aria-label="Main navigation"
            style={{
              display: "flex",
              alignItems: "center",
              height: "100%",
            }}
            className="desktop-nav"
          >
            {NAV_ITEMS.map((item) => (
              <DesktopNavLink
                key={item.path}
                item={item}
                isActive={isActivePath(item.path)}
              />
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="desktop-nav" style={{ flexShrink: 0 }}>
            <Link
              href="/contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "10px 22px",
                fontFamily:
                  "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                fontSize: "13px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#111",
                background: "#FFFFFF",
                border: "1px solid rgba(229,62,62,0.3)",
                borderLeft: "3px solid #E53E3E",
                textDecoration: "none",
                transition: "all 0.2s ease",
                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(229,62,62,0.08)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 4px 16px rgba(0,0,0,0.08), 0 0 12px rgba(229,62,62,0.12)";
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(229,62,62,0.08)";
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "scale(1)";
              }}
            >
              Start Consultation
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            ref={menuButtonRef}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="mobile-menu-btn"
            style={{
              display: "none", // shown via CSS media query
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "2px",
              cursor: "pointer",
              color: "rgba(255,255,255,0.7)",
              transition: "border-color 0.2s",
            }}
          >
            {isMenuOpen ? (
              // X icon
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              // Menu icon
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-menu"
            ref={mobileMenuRef}
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            style={{
              position: "fixed",
              top: "64px",
              right: 0,
              bottom: 0,
              width: "min(320px, 85vw)",
              zIndex: 99,
              background: "rgba(10, 10, 10, 0.98)",
              backdropFilter: "blur(20px)",
              borderLeft: "1px solid rgba(229,62,62,0.1)",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              padding: "1.5rem 0",
            }}
          >
            <nav aria-label="Mobile navigation">
              {NAV_ITEMS.map((item) => (
                <MobileNavLink
                  key={item.path}
                  item={item}
                  isActive={isActivePath(item.path)}
                  onClick={() => setIsMenuOpen(false)}
                />
              ))}

              {/* Divider */}
              <div
                style={{
                  height: "1px",
                  background: "rgba(255,255,255,0.06)",
                  margin: "1rem 1rem",
                }}
                aria-hidden="true"
              />

              {/* Contact link */}
              <MobileNavLink
                item={{ name: "Contact", path: "/contact" }}
                isActive={isActivePath("/contact")}
                onClick={() => setIsMenuOpen(false)}
              />

              {/* Mobile CTA */}
              <div style={{ padding: "1.5rem 1rem" }}>
                <Link
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "12px 24px",
                    fontFamily:
                      "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                    fontSize: "13px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#111",
                    background: "#FFFFFF",
                    border: "1px solid rgba(229,62,62,0.3)",
                    borderLeft: "3px solid #E53E3E",
                    textDecoration: "none",
                    width: "100%",
                    boxShadow:
                      "0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(229,62,62,0.08)",
                  }}
                >
                  Start Your Transformation
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop overlay when mobile menu open */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsMenuOpen(false)}
            style={{
              position: "fixed",
              top: "64px",
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 98,
              background: "rgba(0,0,0,0.5)",
            }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sticky Consultation CTA */}
      <AnimatePresence>
        {showStickyCTA && (
          <motion.div
            initial={{ opacity: 0, x: 80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              position: "fixed",
              bottom: "1.5rem",
              right: "1.5rem",
              zIndex: 50,
            }}
          >
            <Link
              href="/contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                fontFamily:
                  "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                fontSize: "15px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#111",
                background: "#FFFFFF",
                border: "1px solid rgba(229,62,62,0.3)",
                borderLeft: "3px solid #E53E3E",
                textDecoration: "none",
                boxShadow:
                  "0 4px 20px rgba(0,0,0,0.12), 0 0 12px rgba(229,62,62,0.1)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "scale(1.02)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 6px 24px rgba(0,0,0,0.15), 0 0 16px rgba(229,62,62,0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "scale(1)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 4px 20px rgba(0,0,0,0.12), 0 0 12px rgba(229,62,62,0.1)";
              }}
            >
              Book Consultation
              {/* Arrow icon */}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS for responsive show/hide */}
      <style>{`
        .desktop-nav {
          display: flex !important;
        }
        .mobile-menu-btn {
          display: none !important;
        }
        @media (max-width: 1023px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}
