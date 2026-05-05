import { NextResponse } from "next/server";

/**
 * Site event fanout endpoint.
 *
 * The OLG page (and future trackable surfaces) POST events here. This route
 * forwards to the n8n webhook which updates Rolodoo, pings Slack on hot
 * events, etc. Keeping the n8n URL server-side means we can rotate it
 * without redeploying the client and we can add batching / rate-limiting
 * in this single choke point later.
 *
 * Expected body shape:
 *   {
 *     event: string,
 *     lead_id?: number,
 *     session_id?: string,
 *     utm_source?, utm_medium?, utm_campaign?, utm_content?,
 *     domain?, industry?, first_name?, company_name?,
 *     ts: string (ISO),
 *     payload?: object
 *   }
 */

const N8N_WEBHOOK =
  process.env.N8N_SITE_EVENT_WEBHOOK_URL ||
  "https://n8n.solomon.technology/webhook/rule27-site-event";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Fire-and-forget to n8n — don't block the client on CRM writes.
  // If n8n is down, we still return ok so the browser doesn't retry.
  try {
    // X-Rule27-Token authenticates against the Odoo rule27_funnel controller
    // (set via N8N_SITE_EVENT_WEBHOOK_URL=https://crm.../rule27/webhook/site).
    // Empty string when unset is fine — Odoo logs a warning and accepts; we
    // never want to fail the browser-side request because of a missing env var.
    const token = process.env.RULE27_TRACK_TOKEN ?? "";
    await fetch(N8N_WEBHOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "X-Rule27-Token": token } : {}),
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    // Intentionally swallow — log server-side but don't fail the client.
    // eslint-disable-next-line no-console
    console.warn("[api/track] n8n forward failed");
  }

  return NextResponse.json({ ok: true });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
