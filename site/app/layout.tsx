import type { Metadata } from "next";
import "./globals.css";
import { steelfish } from "./fonts";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Analytics } from "./components/Analytics";
import { BackToTop } from "./components/BackToTop";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.rule27design.com"
  ),
  title: {
    default: "Rule27 Design - Digital Powerhouse",
    template: "%s | Rule27 Design",
  },
  description:
    "Break conventional boundaries with Rule27 Design. Creative + technical excellence for brands that refuse to blend in.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Rule27 Design",
    title: "Rule27 Design - Digital Powerhouse",
    description:
      "Creative + technical excellence for brands that refuse to blend in.",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${steelfish.variable}`}>
      <body
        className="min-h-full flex flex-col"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <Header />
        <main style={{ paddingTop: "60px", flex: 1 }}>{children}</main>
        <Footer />
        <BackToTop />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
