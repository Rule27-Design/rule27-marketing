import { supabase } from "@/app/lib/supabase";
import { extractTextFromRichText } from "@/app/lib/utils";
import type {
  Article,
  ArticleFilters,
  Author,
  CoAuthor,
} from "@/app/lib/types";

// ---------------------------------------------------------------------------
// Transform a raw Supabase article row into the component-ready Article shape
// ---------------------------------------------------------------------------

/* eslint-disable @typescript-eslint/no-explicit-any */
function transformArticle(
  article: any,
  profilesMap: Record<string, any>,
  categoriesMap: Record<string, any>,
): Article | null {
  if (!article) return null;

  // Extract content
  const contentData = extractTextFromRichText(article.content);
  const contentText =
    typeof contentData === "string" ? contentData : contentData.text;
  const contentHtml =
    typeof contentData === "object" ? contentData.html : null;

  // Resolve author
  const authorProfile = profilesMap[article.author_id];
  const author: Author = authorProfile
    ? {
        id: authorProfile.id,
        name:
          authorProfile.full_name || authorProfile.display_name || "Rule27 Team",
        role: authorProfile.job_title || "Team Member",
        avatar:
          authorProfile.avatar_url ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(authorProfile.full_name || "User")}&background=FF6B6B&color=fff`,
        bio: authorProfile.bio,
        slug: authorProfile.slug,
      }
    : {
        name: "Rule27 Team",
        role: "Team Member",
        avatar:
          "https://ui-avatars.com/api/?name=Rule27&background=FF6B6B&color=fff",
        slug: null,
      };

  // Resolve category
  const categoryData = categoriesMap[article.category_id];
  const category = categoryData?.name || "Insights";

  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt:
      article.excerpt ||
      (contentText ? contentText.substring(0, 200).trim() + "..." : ""),
    content: contentHtml || contentText,
    contentText,
    contentHtml,
    rawContent: article.content,
    author,
    coAuthors: [],
    category,
    topics: article.tags || [],
    featuredImage:
      article.featured_image ||
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=600&fit=crop",
    featuredImageAlt: article.featured_image_alt,
    publishedDate: article.published_at || article.created_at,
    readTime:
      article.read_time ||
      Math.ceil((contentText || "").split(" ").length / 200),
    featured: article.is_featured || false,
    views: article.view_count || 0,
    likes: article.like_count || 0,
    shares: article.share_count || 0,
    bookmarks: article.bookmark_count || 0,
    galleryImages: article.gallery_images || [],
    metaTitle: article.meta_title,
    metaDescription: article.meta_description,
    ogImage: article.og_image,
    enableComments: article.enable_comments,
    enableReactions: article.enable_reactions,
    coAuthorIds: article.co_authors || [],
  };
}

/**
 * Given an article row, resolve co-author profile data.
 */
async function resolveCoAuthors(article: any): Promise<CoAuthor[]> {
  if (!article.co_authors || article.co_authors.length === 0) return [];

  const validIds = (article.co_authors as string[]).filter(
    (id) =>
      id &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        id,
      ),
  );

  if (validIds.length === 0) return [];

  const { data: coAuthorData } = await supabase
    .from("profiles")
    .select("id, full_name, display_name, avatar_url, job_title, bio, slug")
    .in("id", validIds);

  return (coAuthorData || []).map((ca: any) => ({
    id: ca.id,
    name: ca.full_name || ca.display_name || "Team Member",
    role: ca.job_title || "Team Member",
    bio: ca.bio,
    avatar:
      ca.avatar_url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(ca.full_name || "User")}&background=FF6B6B&color=fff`,
    slug: ca.slug,
  }));
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// ---------------------------------------------------------------------------
// Public data fetchers
// ---------------------------------------------------------------------------

/**
 * Fetch all published articles with author/category/co-author data resolved.
 */
export async function getArticles(): Promise<Article[]> {
  try {
    const { data: articles, error: articlesError } = await supabase
      .from("articles")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (articlesError) throw articlesError;
    if (!articles || articles.length === 0) return [];

    // Collect unique author and category IDs
    const authorIds = [
      ...new Set(articles.map((a) => a.author_id).filter(Boolean)),
    ];
    const categoryIds = [
      ...new Set(articles.map((a) => a.category_id).filter(Boolean)),
    ];

    // Batch-fetch profiles and categories
    const [profilesRes, categoriesRes] = await Promise.all([
      authorIds.length > 0
        ? supabase.from("profiles").select("*").in("id", authorIds)
        : Promise.resolve({ data: [], error: null }),
      categoryIds.length > 0
        ? supabase.from("categories").select("*").in("id", categoryIds)
        : Promise.resolve({ data: [], error: null }),
    ]);

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const profilesMap: Record<string, any> = (
      profilesRes.data || []
    ).reduce((acc: Record<string, any>, p: any) => {
      acc[p.id] = p;
      return acc;
    }, {});

    const categoriesMap: Record<string, any> = (
      categoriesRes.data || []
    ).reduce((acc: Record<string, any>, c: any) => {
      acc[c.id] = c;
      return acc;
    }, {});
    /* eslint-enable @typescript-eslint/no-explicit-any */

    // Resolve co-authors for each article
    const articlesWithCoAuthors = await Promise.all(
      articles.map(async (article) => {
        const coAuthors = await resolveCoAuthors(article);
        return { ...article, coAuthorDetails: coAuthors };
      }),
    );

    // Transform
    return articlesWithCoAuthors
      .map((article) => {
        const transformed = transformArticle(
          article,
          profilesMap,
          categoriesMap,
        );
        if (!transformed) return null;
        return {
          ...transformed,
          coAuthors: article.coAuthorDetails,
        };
      })
      .filter((a): a is Article => a !== null);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

/**
 * Fetch a single article by slug with full author/category/co-author data.
 */
export async function getArticle(slug: string): Promise<Article | null> {
  try {
    const { data: article, error: articleError } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (articleError) throw articleError;
    if (!article) return null;

    // Fetch author profile
    let authorProfile = null;
    if (article.author_id) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", article.author_id)
        .single();
      authorProfile = profile;
    }

    // Fetch category
    let categoryData = null;
    if (article.category_id) {
      const { data: category } = await supabase
        .from("categories")
        .select("*")
        .eq("id", article.category_id)
        .single();
      categoryData = category;
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const profilesMap: Record<string, any> = authorProfile
      ? { [authorProfile.id]: authorProfile }
      : {};
    const categoriesMap: Record<string, any> = categoryData
      ? { [categoryData.id]: categoryData }
      : {};
    /* eslint-enable @typescript-eslint/no-explicit-any */

    // Resolve co-authors
    const coAuthors = await resolveCoAuthors(article);

    const transformed = transformArticle(article, profilesMap, categoriesMap);
    if (!transformed) return null;

    return {
      ...transformed,
      coAuthors,
    };
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

/**
 * Extract available filter values from published articles and categories.
 */
export async function getArticleFilters(): Promise<ArticleFilters> {
  try {
    const [categoriesRes, articlesRes] = await Promise.all([
      supabase
        .from("categories")
        .select("name, slug")
        .eq("type", "article")
        .eq("is_active", true)
        .order("sort_order")
        .order("name"),
      supabase.from("articles").select("tags").eq("status", "published"),
    ]);

    const categories = (categoriesRes.data || []).map(
      (c: { name: string }) => c.name,
    );

    const topics = [
      ...new Set(
        (articlesRes.data || []).flatMap(
          (a: { tags: string[] | null }) => a.tags || [],
        ),
      ),
    ]
      .filter(Boolean)
      .slice(0, 20);

    return {
      categories,
      topics,
      readTimes: ["< 5 min", "5-10 min", "> 10 min"],
    };
  } catch (error) {
    console.error("Error fetching article filters:", error);
    return { categories: [], topics: [], readTimes: ["< 5 min", "5-10 min", "> 10 min"] };
  }
}
