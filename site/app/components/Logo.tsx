import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  /** "color" | "white" | "white-red" */
  variant?: "color" | "white" | "white-red";
  /** Height in pixels */
  height?: number;
  /** Whether to link to homepage */
  linked?: boolean;
}

export function Logo({
  variant = "color",
  height = 32,
  linked = true,
}: LogoProps) {
  const srcMap: Record<string, string> = {
    color: "/assets/Logo/rule27-color.svg",
    white: "/assets/Logo/rule27-white.svg",
    "white-red": "/assets/Logo/rule27-white-red.png",
  };

  const src = srcMap[variant] || srcMap.color;

  // Approximate aspect ratio for the Rule27 logo (roughly 4:1 wide)
  const width = Math.round(height * 4);

  const img = (
    <Image
      src={src}
      alt="Rule27 Design"
      width={width}
      height={height}
      style={{ height: `${height}px`, width: "auto" }}
      priority
    />
  );

  if (!linked) return img;

  return (
    <Link
      href="/"
      style={{ display: "inline-flex", alignItems: "center" }}
      aria-label="Rule27 Design - Home"
    >
      {img}
    </Link>
  );
}
