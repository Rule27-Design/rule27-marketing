// netlify/functions/sitemap.js
// Dynamic XML sitemap — queries Supabase on every request.
// Netlify CDN caches the response for 24 hours, so search engines
// always see data that is at most one day old.
//
// Handles 1,000+ rows via pagination (Supabase caps each response at 1,000).
// Handles 50,000+ URLs via a warning (sitemap index when needed).

const { createClient } = require('@supabase/supabase-js');

const BASE_URL        = 'https://www.rule27design.com';
const PAGE_SIZE       = 1000;  // Supabase/PostgREST hard ceiling per request
const SITEMAP_URL_CAP = 50000; // Google's per-file limit

// Static pages: [path, changefreq, priority]
const STATIC_PAGES = [
  ['/',             'weekly',  '1.0'],
  ['/capabilities', 'monthly', '0.8'],
  ['/case-studies', 'weekly',  '0.9'],
  ['/articles',     'daily',   '0.9'],
  ['/innovation',   'monthly', '0.7'],
  ['/team',         'monthly', '0.7'],
  ['/about',        'monthly', '0.6'],
  ['/contact',      'monthly', '0.6'],
];

function escapeXml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toW3CDate(dateString) {
  if (!dateString) return new Date().toISOString().split('T')[0];
  try {
    return new Date(dateString).toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

function urlEntry(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

exports.handler = async () => {
  const supabaseUrl  = process.env.VITE_SUPABASE_URL  || process.env.SUPABASE_URL;
  const supabaseKey  = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Sitemap: missing Supabase env vars');
    return { statusCode: 500, body: 'Configuration error' };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const today    = new Date().toISOString().split('T')[0];

  // ── Fetch dynamic content ──────────────────────────────────────────────────

  /**
   * Paginate through a Supabase table so we never silently truncate at 1,000.
   * Keeps fetching pages until a page returns fewer rows than PAGE_SIZE.
   */
  async function fetchAllRows(table, columns, filters = {}) {
    const rows = [];
    let   page = 0;

    while (true) {
      let query = supabase
        .from(table)
        .select(columns)
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      for (const [col, val] of Object.entries(filters)) {
        query = val === null ? query.not(col, 'is', null) : query.eq(col, val);
      }

      const { data, error } = await query;

      if (error) {
        console.error(`Sitemap: error fetching ${table} page ${page}:`, error.message);
        break;
      }

      if (!data || data.length === 0) break;
      rows.push(...data);
      if (data.length < PAGE_SIZE) break; // last page
      page++;
    }

    return rows;
  }

  const [articles, caseStudies, team] = await Promise.all([
    fetchAllRows('articles',     'slug, updated_at, published_at', { status: 'published' }),
    fetchAllRows('case_studies', 'slug, updated_at, published_at', { status: 'published' }),
    fetchAllRows('profiles',     'slug, updated_at',               { is_active: true }),
  ]);

  console.log(`Sitemap: ${articles.length} articles, ${caseStudies.length} case studies, ${team.length} team members`);

  // ── Build XML ──────────────────────────────────────────────────────────────

  const entries = [];

  // Static pages
  for (const [path, freq, pri] of STATIC_PAGES) {
    entries.push(urlEntry(`${BASE_URL}${path}`, today, freq, pri));
  }

  // Articles
  for (const article of articles) {
    if (!article.slug) continue;
    const lastmod = toW3CDate(article.updated_at || article.published_at);
    entries.push(urlEntry(`${BASE_URL}/article/${escapeXml(article.slug)}`, lastmod, 'weekly', '0.8'));
  }

  // Case studies
  for (const cs of caseStudies) {
    if (!cs.slug) continue;
    const lastmod = toW3CDate(cs.updated_at || cs.published_at);
    entries.push(urlEntry(`${BASE_URL}/case-studies/${escapeXml(cs.slug)}`, lastmod, 'monthly', '0.8'));
  }

  // Team members
  for (const member of team) {
    if (!member.slug) continue;
    const lastmod = toW3CDate(member.updated_at);
    entries.push(urlEntry(`${BASE_URL}/team/${escapeXml(member.slug)}`, lastmod, 'monthly', '0.5'));
  }

  if (entries.length > SITEMAP_URL_CAP) {
    console.warn(`Sitemap: ${entries.length} URLs exceeds the 50,000 per-file limit. Consider a sitemap index.`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;

  return {
    statusCode: 200,
    headers: {
      'Content-Type':  'application/xml; charset=utf-8',
      // CDN caches for 24 h; browsers/bots revalidate after 1 h
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
      'X-Sitemap-Urls': String(entries.length),
    },
    body: xml,
  };
};