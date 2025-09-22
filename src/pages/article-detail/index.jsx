import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Image from '../../components/AppImage';
import { useArticle, useArticles } from '../../hooks/useArticles';

const ArticleDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { article, loading, error, trackEngagement } = useArticle(slug);
  const { articles } = useArticles();
  
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (article && articles.length > 0) {
      // Get related articles based on category and tags
      const related = articles
        .filter(a => 
          a.id !== article.id && 
          (a.category === article.category || 
           a.topics.some(t => article.topics.includes(t)))
        )
        .slice(0, 3);
      setRelatedArticles(related);
    }
  }, [article, articles]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      trackEngagement('like');
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    if (!isBookmarked) {
      trackEngagement('bookmark');
    }
  };

  const handleShare = async () => {
    trackEngagement('share');
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title,
          text: article?.excerpt,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text-secondary font-sans">Loading article...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <Icon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-heading-regular text-primary mb-2 tracking-wider uppercase">Article Not Found</h2>
            <p className="text-text-secondary mb-4 font-sans">{error || 'The article you are looking for does not exist.'}</p>
            <Button
              variant="outline"
              onClick={() => navigate('/articles')}
              className="border-accent text-accent hover:bg-accent hover:text-white"
            >
              <span className="font-heading-regular tracking-wider uppercase">Back to Articles</span>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Check if we have co-authors
  const hasCoAuthors = article.coAuthors && article.coAuthors.length > 0;

  return (
    <>
      <Helmet>
        <title>{article.metaTitle || article.title} | Rule27 Design</title>
        <meta name="description" content={article.metaDescription || article.excerpt} />
        <meta property="og:title" content={article.metaTitle || article.title} />
        <meta property="og:description" content={article.metaDescription || article.excerpt} />
        <meta property="og:image" content={article.ogImage || article.featuredImage} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={`/article/${slug}`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero Section */}
        <section className="relative h-[50vh] sm:h-[60vh] min-h-[400px] overflow-hidden pt-16">
          <div className="absolute inset-0">
            <Image
              src={article.featuredImage}
              alt={article.featuredImageAlt || article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
          </div>

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-4xl mx-auto">
              {/* Category & Meta */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-accent/80 backdrop-blur-sm text-white text-sm font-heading-regular tracking-wider uppercase rounded-full">
                  {article.category}
                </span>
                <div className="flex items-center space-x-4 text-white/80 text-sm font-sans">
                  <span className="flex items-center gap-1">
                    <Icon name="Clock" size={14} />
                    {article.readTime} min read
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="Eye" size={14} />
                    <span className="font-heading-regular tracking-wider">{article.views?.toLocaleString()}</span> views
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading-regular text-white mb-4 tracking-wider uppercase">
                {article.title}
              </h1>

              {/* Author Info with Co-Authors */}
              <div className="flex items-center space-x-4">
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-12 h-12 rounded-full border-2 border-white/20"
                />
                <div>
                  <div className="flex items-center flex-wrap gap-1">
                    <p className="text-white font-sans font-semibold">
                      {article.author.name}
                    </p>
                    {hasCoAuthors && (
                      <span className="text-white/70 font-sans">
                        {' & '}
                        {article.coAuthors.map((coAuthor, index) => (
                          <span key={coAuthor.id}>
                            {coAuthor.name}
                            {index < article.coAuthors.length - 1 && ', '}
                          </span>
                        ))}
                      </span>
                    )}
                  </div>
                  <p className="text-white/70 text-sm font-sans">
                    {article.author.role} • {formatDate(article.publishedDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Action Bar */}
        <div className="sticky top-16 z-40 bg-white border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={isLiked ? 'text-accent' : 'text-text-secondary hover:text-accent'}
                >
                  <Icon name="Heart" size={18} className={isLiked ? 'fill-current' : ''} />
                  <span className="ml-2 font-heading-regular tracking-wider">{article.likes + (isLiked ? 1 : 0)}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBookmark}
                  className={isBookmarked ? 'text-accent' : 'text-text-secondary hover:text-accent'}
                >
                  <Icon name="Bookmark" size={18} className={isBookmarked ? 'fill-current' : ''} />
                  <span className="ml-2 font-heading-regular tracking-wider uppercase">Save</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="text-text-secondary hover:text-accent"
                >
                  <Icon name="Share2" size={18} />
                  <span className="ml-2 font-heading-regular tracking-wider uppercase">Share</span>
                </Button>
              </div>
              
              <div className="text-sm text-text-secondary font-sans">
                {article.readTime} min read
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Excerpt */}
            <div className="text-xl text-text-secondary mb-8 leading-relaxed font-sans">
              {article.excerpt}
            </div>

            {/* Main Content */}
            <div className="prose prose-lg max-w-none">
              {article.contentHtml ? (
                <div 
                  className="article-content font-sans text-text-primary leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: article.contentHtml }}
                />
              ) : (
                <div className="article-content font-sans text-text-primary leading-relaxed whitespace-pre-wrap">
                  {article.content}
                </div>
              )}
            </div>

            {/* Co-Authors Section - Only show if there are co-authors */}
            {hasCoAuthors && (
              <div className="mt-12 p-6 bg-gray-50 rounded-xl">
                <h3 className="font-heading-regular text-primary mb-4 tracking-wider uppercase">
                  Contributing Author{article.coAuthors.length > 1 ? 's' : ''}
                </h3>
                <div className="space-y-4">
                  {article.coAuthors.map((coAuthor) => (
                    <div key={coAuthor.id} className="flex items-start space-x-4">
                      <img
                        src={coAuthor.avatar}
                        alt={coAuthor.name}
                        className="w-12 h-12 rounded-full flex-shrink-0"
                      />
                      <div className="flex-1">
                        <p className="font-sans font-medium text-primary">
                          {coAuthor.name}
                        </p>
                        <p className="text-sm text-text-secondary font-sans">
                          {coAuthor.role}
                        </p>
                        {coAuthor.bio && (
                          <p className="text-sm text-text-secondary font-sans mt-2">
                            {coAuthor.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Topics */}
            {article.topics.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="text-sm font-heading-regular text-text-secondary mb-4 tracking-wider uppercase">
                  Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {article.topics.map((topic, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-muted text-sm text-text-secondary rounded-full hover:bg-accent/10 hover:text-accent cursor-pointer transition-colors font-sans"
                      onClick={() => navigate(`/articles?topic=${encodeURIComponent(topic)}`)}
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Main Author Bio */}
            <div className="mt-12 p-6 bg-muted rounded-xl">
              <div className="flex items-start space-x-4">
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-16 h-16 rounded-full flex-shrink-0"
                />
                <div className="flex-1">
                  <h3 className="font-heading-regular text-primary mb-1 tracking-wider uppercase">
                    About the {hasCoAuthors ? 'Lead Author' : 'Author'}
                  </h3>
                  <p className="font-sans font-medium text-primary">
                    {article.author.name}
                  </p>
                  <p className="text-sm text-text-secondary mb-2 font-sans">
                    {article.author.role} at Rule27 Design
                  </p>
                  <p className="text-sm text-text-secondary font-sans">
                    {article.author.bio || `With expertise in digital design and strategy, ${article.author.name} helps brands discover their authentic voice in the digital landscape.`}
                  </p>
                </div>
              </div>
            </div>

            {/* Share Section */}
            <div className="mt-12 p-6 bg-accent/5 rounded-xl text-center">
              <h3 className="text-lg font-heading-regular text-primary mb-3 tracking-wider uppercase">
                Share This Article
              </h3>
              <div className="flex items-center justify-center space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                  className="hover:fill-accent"
                >
                  <Icon name="Twitter" size={20} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank','noopener,noreferrer')}
                  className="hover:fill-accent"
                >
                  <Icon name="Linkedin" size={20} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                  className="hover:fill-accent"
                >
                  <Icon name="Facebook" size={20} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleShare}
                  className="hover:fill-accent"
                >
                  <Icon name="Link" size={20} />
                </Button>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="py-12 bg-muted">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl sm:text-3xl font-heading-regular text-primary mb-8 tracking-wider uppercase">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <div
                    key={relatedArticle.id}
                    className="bg-white rounded-xl overflow-hidden brand-shadow hover:brand-shadow-lg transition-all duration-300 cursor-pointer group"
                    onClick={() => navigate(`/article/${relatedArticle.slug}`)}
                  >
                    <div className="h-48 overflow-hidden">
                      <Image
                        src={relatedArticle.featuredImage}
                        alt={relatedArticle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-heading-regular text-accent uppercase tracking-wider">
                          {relatedArticle.category}
                        </span>
                        <span className="text-xs text-text-secondary">•</span>
                        <span className="text-xs text-text-secondary font-sans">
                          {relatedArticle.readTime} min read
                        </span>
                      </div>
                      <h3 className="font-heading-regular text-primary text-lg mb-2 tracking-wider uppercase line-clamp-2 group-hover:text-accent transition-colors">
                        {relatedArticle.title}
                      </h3>
                      <p className="text-sm text-text-secondary font-sans line-clamp-2">
                        {relatedArticle.excerpt}
                      </p>
                      <div className="mt-3 flex items-center text-xs text-text-secondary">
                        <span className="font-sans">By {relatedArticle.author.name}</span>
                        {relatedArticle.coAuthors && relatedArticle.coAuthors.length > 0 && (
                          <span className="font-sans ml-1">
                            & {relatedArticle.coAuthors.length} other{relatedArticle.coAuthors.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <Footer />
      </div>
    </>
  );
};

export default ArticleDetail;