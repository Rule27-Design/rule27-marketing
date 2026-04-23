"use client";

import Script from "next/script";

const TRACKING_CODE =
  process.env.NEXT_PUBLIC_ANILTX_TRACKING_CODE ||
  "aniltx_786e669824bd68a4f15f936be24e1f68";
const API_ENDPOINT =
  process.env.NEXT_PUBLIC_ANILTX_API_ENDPOINT || "https://www.app.aniltx.ai";

declare global {
  interface Window {
    AniltXConfig?: { trackingCode: string; apiEndpoint: string };
  }
}

export function AniltX() {
  return (
    <>
      <Script id="aniltx-config" strategy="beforeInteractive">
        {`window.AniltXConfig = { trackingCode: '${TRACKING_CODE}', apiEndpoint: '${API_ENDPOINT}' };`}
      </Script>
      <Script
        id="aniltx-sdk"
        src={`${API_ENDPOINT}/sdk/aniltx.js`}
        strategy="afterInteractive"
      />
    </>
  );
}
