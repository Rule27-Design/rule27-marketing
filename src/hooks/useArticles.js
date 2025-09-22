import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Helper to extract text from various content formats
const extractTextFromRichText = (richText) => {
  if (!richText) return { html: null, text: '' };
  
  // If it's a string, try to parse it
  if (typeof richText === 'string') {
    try {
      const parsed = JSON.parse(richText);
      
      // Handle the complex content format (like Typography article)
      if (parsed.html) {
        return {
          html: parsed.html,
          text: parsed.text || parsed.html.replace(/<[^>]*>/g, '')
        };
      }
      
      // Handle simple JSON content with text property
      if (parsed.text) {
        return { html: null, text: parsed.text };
      }
      
      // Handle doc type content
      if (parsed.type === 'doc' && parsed.content) {
        const text = extractFromJsonContent(parsed.content);
        return { html: null, text };
      }
      
      // Handle json property with nested content
      if (parsed.json && parsed.json.content) {
        const text = extractFromJsonContent(parsed.json.content);
        return { html: parsed.html || null, text };
      }
      
      return { html: null, text: richText };
    } catch (e) {
      // If parsing fails, return as plain text
      return { html: null, text: richText };
    }
  }
  
  // If it's already an object
  if (richText.html) {
    return {
      html: richText.html,
      text: richText.text || richText.html.replace(/<[^>]*>/g, '')
    };
  }
  
  if (richText.type === 'doc' && richText.content) {
    const text = extractFromJsonContent(richText.content);
    return { html: null, text };
  }
  
  return { html: null, text: JSON.stringify(richText) };
};

const extractFromJsonContent = (content) => {
  if (!Array.isArray(content)) return '';
  
  return content
    .map(block => {
      if (block.type === 'paragraph' && block.content) {
        return block.content.map(item => item.text || '').join(' ');
      }
      if (block.type === 'bulletList' && block.content) {
        return block.content.map(item => extractFromJsonContent(item.content || [])).join(' ');
      }
      if (block.type === 'listItem' && block.content) {
        return extractFromJsonContent(block.content);
      }
      return block.text || '';
    })
    .filter(text => text.trim())
    .join('\n\n');
};

// Transform database article to component structure
const transformArticle = (article, profilesMap, categoriesMap) => {
  if (!article) return null;
  
  // Extract content properly
  const contentData = extractTextFromRichText(article.content);
  const contentText = typeof contentData === 'string' ? contentData : contentData.text;
  const contentHtml = typeof contentData === 'object' ? contentData.html : null;
  
  // Get author info from the profiles map
  const authorProfile = profilesMap[article.author_id];
  const author = authorProfile ? {
    id: authorProfile.id,
    name: authorProfile.full_name || authorProfile.display_name || 'Rule27 Team',
    role: authorProfile.job_title || 'Team Member',
    avatar: authorProfile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorProfile.full_name || 'User')}&background=FF6B6B&color=fff`,
    bio: authorProfile.bio
  } : {
    // Fallback if no author found
    name: 'Rule27 Team',
    role: 'Team Member',
    avatar: 'https://ui-avatars.com/api/?name=Rule27&background=FF6B6B&color=fff'
  };

  // Get category from the categories map
  const categoryData = categoriesMap[article.category_id];
  const category = categoryData?.name || 'Insights';

  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt || (contentText ? contentText.substring(0, 200).trim() + '...' : ''),
    content: contentHtml || contentText,
    contentText: contentText,
    contentHtml: contentHtml,
    rawContent: article.content,
    author,
    category,
    topics: article.tags || [],
    featuredImage: article.featured_image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=600&fit=crop',
    featuredImageAlt: article.featured_image_alt,
    publishedDate: article.published_at || article.created_at,
    readTime: article.read_time || Math.ceil((contentText || '').split(' ').length / 200),
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
    coAuthorIds: article.co_authors || []
  };
};

// Main hook for fetching articles
export const useArticles = () => {
  const [data, setData] = useState({
    articles: [],
    featuredArticles: [],
    categories: [],
    topics: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      // First get the articles
      const { data: articles, error: articlesError } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (articlesError) throw articlesError;

      if (!articles || articles.length === 0) {
        setData({
          articles: [],
          featuredArticles: [],
          categories: [],
          topics: [],
          loading: false,
          error: null
        });
        return;
      }

      // Get unique author and category IDs
      const authorIds = [...new Set(articles.map(a => a.author_id))].filter(Boolean);
      const categoryIds = [...new Set(articles.map(a => a.category_id))].filter(Boolean);

      // Fetch all profiles and categories
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', authorIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }

      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .in('id', categoryIds);

      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
      }

      // Create lookup maps
      const profilesMap = (profiles || []).reduce((acc, profile) => {
        acc[profile.id] = profile;
        return acc;
      }, {});

      const categoriesMap = (categories || []).reduce((acc, category) => {
        acc[category.id] = category;
        return acc;
      }, {});

      // Fetch co-author details for articles that have them
      const articlesWithCoAuthors = await Promise.all(
        articles.map(async (article) => {
          let coAuthors = [];
          
          if (article.co_authors && article.co_authors.length > 0) {
            // Filter out invalid UUIDs
            const validCoAuthorIds = article.co_authors.filter(id => 
              id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
            );
            
            if (validCoAuthorIds.length > 0) {
              const { data: coAuthorData } = await supabase
                .from('profiles')
                .select('id, full_name, display_name, avatar_url, job_title, bio')
                .in('id', validCoAuthorIds);
              
              coAuthors = (coAuthorData || []).map(coAuthor => ({
                id: coAuthor.id,
                name: coAuthor.full_name || coAuthor.display_name || 'Team Member',
                role: coAuthor.job_title || 'Team Member',
                bio: coAuthor.bio,
                avatar: coAuthor.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(coAuthor.full_name || 'User')}&background=FF6B6B&color=fff`
              }));
            }
          }
          
          return { ...article, coAuthorDetails: coAuthors };
        })
      );

      // Transform articles with the maps
      const transformedArticles = articlesWithCoAuthors.map(article => {
        const transformed = transformArticle(article, profilesMap, categoriesMap);
        return {
          ...transformed,
          coAuthors: article.coAuthorDetails
        };
      });
      
      // Get featured articles
      const featured = transformedArticles.filter(article => article.featured);

      // Extract unique categories and topics
      const uniqueCategories = [...new Set(transformedArticles.map(a => a.category))].filter(Boolean);
      const uniqueTopics = [...new Set(transformedArticles.flatMap(a => a.topics))].filter(Boolean);

      setData({
        articles: transformedArticles,
        featuredArticles: featured.length > 0 ? featured : transformedArticles.slice(0, 3),
        categories: uniqueCategories,
        topics: uniqueTopics,
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching articles:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  // Track article view
  const trackView = async (articleId) => {
    try {
      const { data: current } = await supabase
        .from('articles')
        .select('view_count, unique_view_count')
        .eq('id', articleId)
        .single();
      
      await supabase
        .from('articles')
        .update({ 
          view_count: (current?.view_count || 0) + 1,
          unique_view_count: (current?.unique_view_count || 0) + 1
        })
        .eq('id', articleId);

    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  return {
    ...data,
    trackView,
    refetch: fetchArticles
  };
};

// Hook for individual article
export const useArticle = (slug) => {
  const [data, setData] = useState({
    article: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    if (slug) {
      fetchArticle(slug);
    }
  }, [slug]);

  const fetchArticle = async (slug) => {
    try {
      // First get the article
      const { data: article, error: articleError } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (articleError) throw articleError;

      // Fetch the author profile
      let authorProfile = null;
      if (article.author_id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', article.author_id)
          .single();
        
        authorProfile = profile;
      }

      // Fetch the category
      let categoryData = null;
      if (article.category_id) {
        const { data: category } = await supabase
          .from('categories')
          .select('*')
          .eq('id', article.category_id)
          .single();
        
        categoryData = category;
      }

      // Create maps for the transform function
      const profilesMap = authorProfile ? { [authorProfile.id]: authorProfile } : {};
      const categoriesMap = categoryData ? { [categoryData.id]: categoryData } : {};

      // Fetch co-authors if they exist
      let coAuthors = [];
      if (article?.co_authors && article.co_authors.length > 0) {
        // Filter out invalid UUIDs
        const validCoAuthorIds = article.co_authors.filter(id => 
          id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
        );
        
        if (validCoAuthorIds.length > 0) {
          const { data: coAuthorData } = await supabase
            .from('profiles')
            .select('id, full_name, display_name, avatar_url, job_title, bio')
            .in('id', validCoAuthorIds);
          
          coAuthors = (coAuthorData || []).map(coAuthor => ({
            id: coAuthor.id,
            name: coAuthor.full_name || coAuthor.display_name || 'Team Member',
            role: coAuthor.job_title || 'Team Member',
            bio: coAuthor.bio,
            avatar: coAuthor.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(coAuthor.full_name || 'User')}&background=FF6B6B&color=fff`
          }));
        }
      }

      const transformedArticle = {
        ...transformArticle(article, profilesMap, categoriesMap),
        coAuthors
      };

      setData({
        article: transformedArticle,
        loading: false,
        error: null
      });

      // Track view
      if (article?.id) {
        const { data: current } = await supabase
          .from('articles')
          .select('view_count')
          .eq('id', article.id)
          .single();
        
        await supabase
          .from('articles')
          .update({ 
            view_count: (current?.view_count || 0) + 1
          })
          .eq('id', article.id);
      }

    } catch (error) {
      console.error('Error fetching article:', error);
      setData({
        article: null,
        loading: false,
        error: error.message
      });
    }
  };

  // Track engagement
  const trackEngagement = async (type) => {
    if (!data.article) return;
    
    try {
      const field = `${type}_count`;
      const { data: current } = await supabase
        .from('articles')
        .select(field)
        .eq('id', data.article.id)
        .single();
      
      await supabase
        .from('articles')
        .update({ 
          [field]: (current?.[field] || 0) + 1
        })
        .eq('id', data.article.id);
        
    } catch (error) {
      console.error(`Error tracking ${type}:`, error);
    }
  };

  return {
    ...data,
    trackEngagement,
    refetch: () => fetchArticle(slug)
  };
};

// Hook for article filters
export const useArticleFilters = () => {
  const [filters, setFilters] = useState({
    categories: [],
    topics: [],
    readTimes: ['< 5 min', '5-10 min', '> 10 min'],
    loading: true
  });

  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    try {
      // Get categories specifically for articles
      const { data: categories } = await supabase
        .from('categories')
        .select('name, slug')
        .eq('type', 'article')
        .eq('is_active', true)
        .order('sort_order')
        .order('name');

      // Get unique tags from published articles
      const { data: articles } = await supabase
        .from('articles')
        .select('tags')
        .eq('status', 'published');

      const topics = [...new Set(articles?.flatMap(a => a.tags || []))].filter(Boolean);

      setFilters({
        categories: categories?.map(c => c.name) || [],
        topics: topics.slice(0, 20), // Limit to top 20 topics
        readTimes: ['< 5 min', '5-10 min', '> 10 min'],
        loading: false
      });

    } catch (error) {
      console.error('Error fetching filters:', error);
      setFilters(prev => ({ ...prev, loading: false }));
    }
  };

  return filters;
};