import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Helper to extract text from rich text JSON
const extractTextFromRichText = (richText) => {
  if (!richText) return '';
  if (typeof richText === 'string') return richText;
  
  // If it's a JSON object with content array
  if (richText.content && Array.isArray(richText.content)) {
    return richText.content
      .map(block => {
        if (block.content && Array.isArray(block.content)) {
          return block.content.map(item => item.text || '').join(' ');
        }
        return block.text || '';
      })
      .join(' ');
  }
  
  // If it's stored as text
  if (richText.text) return richText.text;
  
  return JSON.stringify(richText);
};

// Transform database article to component structure
const transformArticle = (article) => {
  if (!article) return null;
  
  // Get author info from profiles table relationship
  const author = article.author ? {
    name: article.author.full_name || article.author.display_name,
    role: article.author.job_title || 'Team Member',
    avatar: article.author.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author.full_name || 'User')}&background=FF6B6B&color=fff`
  } : {
    name: 'Rule27 Team',
    role: 'Team Member',
    avatar: 'https://ui-avatars.com/api/?name=Rule27&background=FF6B6B&color=fff'
  };

  // Get category from relationship or use default
  const category = article.category?.name || 'Insights';

  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt || extractTextFromRichText(article.content).substring(0, 200) + '...',
    content: extractTextFromRichText(article.content),
    rawContent: article.content, // Keep raw content for detail page
    author,
    category,
    topics: article.tags || [],
    featuredImage: article.featured_image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=600&fit=crop',
    featuredImageAlt: article.featured_image_alt,
    publishedDate: article.published_at || article.created_at,
    readTime: article.read_time || Math.ceil(extractTextFromRichText(article.content).split(' ').length / 200),
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
    enableReactions: article.enable_reactions
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
      // Fetch published articles with author and category info
      const { data: articles, error } = await supabase
        .from('articles')
        .select(`
          *,
          author:profiles!articles_author_id_fkey(
            id,
            full_name,
            display_name,
            avatar_url,
            job_title
          ),
          category:categories(
            id,
            name,
            slug
          )
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;

      // Transform articles
      const transformedArticles = (articles || []).map(transformArticle);
      
      // Get featured articles
      const featured = transformedArticles.filter(article => article.featured);

      // Extract unique categories and topics
      const categories = [...new Set(transformedArticles.map(a => a.category))].filter(Boolean);
      const topics = [...new Set(transformedArticles.flatMap(a => a.topics))].filter(Boolean);

      setData({
        articles: transformedArticles,
        featuredArticles: featured.length > 0 ? featured : transformedArticles.slice(0, 3),
        categories,
        topics,
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
      const { data: article, error } = await supabase
        .from('articles')
        .select(`
          *,
          author:profiles!articles_author_id_fkey(
            id,
            full_name,
            display_name,
            avatar_url,
            job_title,
            bio
          ),
          category:categories(
            id,
            name,
            slug
          )
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;

      const transformedArticle = transformArticle(article);

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
      // Get categories
      const { data: categories } = await supabase
        .from('categories')
        .select('name, slug')
        .order('name');

      // Get unique tags from articles
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