export interface FAQ {
  q: string;
  a: string;
}

export const FAQS: FAQ[] = [
  {
    q: "How many pages will my site have after deployment?",
    a: "1,000+ pages, each one targeting a specific search query your customers are actually making. Not template swaps. Not thin programmatic content. Every page passes a pre-deployment quality checklist (keyword in H1/title/meta/first paragraph, word-count minimum, 2-5 internal links, schema validation, no hallucinated facts).",
  },
  {
    q: "How long does this actually take?",
    a: "4 weeks end-to-end from contract signing. Week 1 = research and SERP validation. Week 2 = build and content prep. Weeks 3-4 = public deployment at ~71 pages/day with manual Google indexing. You'll see the first impression spike in your GSC dashboard by week 4-6.",
  },
  {
    q: "What if the pages don't rank?",
    a: "Phase 2 (SERP validation) is the make-or-break step. We analyze the top 3 results for every priority query, match content depth, and add our differentiation. This is why NMHL (179 pages, Phase 2 done properly) hit 4% CTR with 29,100 impressions, while AniltX V1 (33,332 pages, Phase 2 skipped) got 0.16% CTR. Phase 2 is non-negotiable on every Rule27 engagement.",
  },
  {
    q: "What do you need from me to start?",
    a: "Four things: GSC property access (we add info@rule27design.com as a Full user), domain control for DNS/SSL, 3-5 competitor domains you want tracked, and a short ICP description. We handle the rest. Optional integrations (CRM, SMTP, custom event tracking) get scoped in week 1.",
  },
  {
    q: "What happens after the 4 weeks?",
    a: "The retainer ($1,500/mo) kicks in 30 days after final project payment. Weekly performance reports from Josh, CTR optimization, content refresh, 5-20 new pages a month, competitor monitoring, dedicated Slack channel, bi-weekly strategy calls. 4-month minimum, then month-to-month. The retainer is momentum — not maintenance.",
  },
  {
    q: "Are you using AI to write the content?",
    a: "Yes, with strict guardrails. P0 pages (top 50) get heavy human editing. P1 pages get AI drafts + RAG context (your knowledge base) + human review. P2 pages get AI batch generation with 10% spot-check. Every page has a unique editorial brief from our SERP research — there are no template swaps.",
  },
  {
    q: "How do you measure quality?",
    a: "Every page passes a pre-deployment checklist: keyword in H1/title/meta description/first paragraph, minimum word count for template type, 2-5 internal links with keyword-rich anchor text, 1-2 authoritative external links, schema fields populated and valid, no hallucinated facts, reads in your voice. 100% of pages approved before any deployment.",
  },
  {
    q: "What if I want to cancel the retainer?",
    a: "After the 4-month minimum, month-to-month. Your site stays live with all 1,000+ pages and continues ranking. What you lose is the optimization momentum — competitor monitoring, content refresh, keyword expansion, weekly reports. Most clients don't cancel because the math compounds in their favor.",
  },
];
