import localFont from "next/font/local";

export const steelfish = localFont({
  src: [
    { path: "./fonts/steelfish.woff2", weight: "400", style: "normal" },
    { path: "./fonts/steelfish-bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-steelfish",
  display: "swap",
  fallback: ["Impact", "Arial Black", "Haettenschweiler", "sans-serif"],
});
