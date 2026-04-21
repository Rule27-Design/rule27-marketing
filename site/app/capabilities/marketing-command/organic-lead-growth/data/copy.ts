export const REVELATION_LINES = [
  "Every page is a door. Your competitors have thousands of doors open. How many do you have?",
  "The difference between page 1 and page 5 isn't better content. It's architecture.",
  "Search doesn't reward your work. It rewards your structure.",
];

export const TOOLTIPS = {
  pages_indexed:
    "Each page is a door to a customer searching for what you sell. More pages = more doors.",
  organic_traffic:
    "Visitors who find you through Google search - not ads, not social, not referrals.",
  traffic_multiplier:
    "How many times more traffic the client receives now versus before we restructured their site.",
  monthly_revenue:
    "Estimated monthly revenue from organic search alone. Calculated as: traffic × conversion rate × average deal value.",
  competitor_pages:
    "The number of indexed pages your top competitors have, each one targeting a specific search query a real buyer is making.",
  competitor_revenue:
    "Estimated monthly revenue your top 3 competitors are capturing through organic search alone - money currently flowing to them, not you.",
  domain_capture:
    "We'll analyze your indexed pages, top organic keywords, and the gap between you and your top 3 local competitors. Delivered in under 60 minutes.",
};

export const REVENUE_FORMULA = {
  title: "How We Calculate Revenue Opportunity",
  formula: "Monthly Impressions × CTR × Conversion Rate × Avg Deal Value",
  example: {
    inputs: {
      "Monthly Impressions": "48,000",
      "Click-Through Rate": "4.2%",
      "Conversion Rate": "3.5%",
      "Avg Deal Value": "$1,800",
    } as Record<string, string>,
    result: "$127K / mo",
    explanation:
      "With 48K monthly impressions across all your indexed pages, a typical CTR of 4.2%, a 3.5% form-fill-to-deal conversion, and an average deal of $1,800, the revenue ceiling on organic search alone is roughly $127K/mo. This is what your competitors capture when they win the SERP.",
  },
};

export const ARTICLE_PREVIEWS = [
  {
    slug: "competitor-3000-page-website-eating-your-lunch",
    title:
      "Why your competitor's 3,000-page website is eating your lunch",
    excerpt:
      "Page count isn't a vanity metric - it's a search-share multiplier. Here's the math behind why architecture beats content.",
    readMin: 6,
  },
  {
    slug: "seo-architecture-playbook-local-businesses-dominate-search",
    title:
      "The SEO architecture playbook: how local businesses dominate search",
    excerpt:
      "A teardown of the page structure used by the top-ranking local services in 14 markets. Patterns are obvious once you see them.",
    readMin: 9,
  },
  {
    slug: "60-minutes-revealed-about-your-industry",
    title:
      "What 60 minutes of analysis revealed about your industry in Phoenix",
    excerpt:
      "Magnet reports across 21K leads exposed the same pattern in every vertical. Here's what we found and why it matters.",
    readMin: 7,
  },
];

export const DOWNLOADS = {
  playbook: {
    title: "Page Architecture Playbook",
    description:
      "How page count drives organic growth, with the exact formula our top clients use.",
    href: "/downloads/page-architecture-playbook",
  },
  benchmarks: {
    title: "Industry SEO Benchmark Report",
    description:
      "Page count benchmarks, traffic estimates, and the gap formula by industry.",
    href: "/downloads/industry-seo-benchmarks",
  },
};
