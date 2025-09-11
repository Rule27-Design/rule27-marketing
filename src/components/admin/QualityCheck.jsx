// src/components/admin/QualityCheck.jsx
import React, { useState, useEffect } from 'react';
import Icon from '../AdminIcon';
import Progress from '../ui/Progress';

const QualityCheck = ({ 
  data, 
  config = 'article', // 'article', 'case-study', 'service', or custom config object
  onScoreChange 
}) => {
  const [score, setScore] = useState(0);
  const [checks, setChecks] = useState([]);

  // Default configurations for different content types
  const defaultConfigs = {
    'article': {
      title: { min: 30, max: 60, weight: 20 },
      content: { minWords: 300, weight: 30 },
      excerpt: { min: 100, weight: 5 },
      metaTitle: { min: 30, max: 60, weight: 10 },
      metaDescription: { min: 120, max: 160, weight: 10 },
      featuredImage: { required: true, weight: 10 },
      tags: { min: 3, weight: 5 },
      requiredFields: ['title', 'content', 'slug']
    },
    'case-study': {
      title: { min: 30, max: 70, weight: 15 },
      content: { minWords: 500, weight: 25 },
      clientName: { required: true, weight: 10 },
      projectDuration: { required: true, weight: 5 },
      results: { required: true, weight: 15 },
      testimonial: { required: false, weight: 10 },
      gallery: { min: 3, weight: 10 },
      metaTitle: { min: 30, max: 60, weight: 5 },
      metaDescription: { min: 120, max: 160, weight: 5 },
      requiredFields: ['title', 'content', 'client_name', 'project_start_date']
    },
    'service': {
      title: { min: 20, max: 50, weight: 20 },
      description: { minWords: 200, weight: 25 },
      features: { min: 3, weight: 15 },
      pricing: { required: true, weight: 15 },
      icon: { required: true, weight: 5 },
      metaTitle: { min: 30, max: 60, weight: 10 },
      metaDescription: { min: 120, max: 160, weight: 10 },
      requiredFields: ['title', 'description', 'slug']
    }
  };

  const activeConfig = typeof config === 'object' ? config : defaultConfigs[config] || defaultConfigs['article'];

  useEffect(() => {
    performQualityChecks();
  }, [data]);

  useEffect(() => {
    if (onScoreChange) {
      onScoreChange(score);
    }
  }, [score, onScoreChange]);

  const performQualityChecks = () => {
    const newChecks = [];
    let totalScore = 0;
    let maxScore = 0;

    // Required fields check
    activeConfig.requiredFields?.forEach(field => {
      maxScore += 10;
      const value = field.includes('.') 
        ? field.split('.').reduce((obj, key) => obj?.[key], data)
        : data[field];
        
      if (value) {
        newChecks.push({ 
          id: `required-${field}`, 
          status: 'pass', 
          message: `${formatFieldName(field)} is provided`, 
          points: 10 
        });
        totalScore += 10;
      } else {
        newChecks.push({ 
          id: `required-${field}`, 
          status: 'error', 
          message: `${formatFieldName(field)} is required`, 
          points: 0 
        });
      }
    });

    // Title checks
    if (activeConfig.title && data.title) {
      maxScore += activeConfig.title.weight;
      const titleLength = data.title.length;
      const { min, max } = activeConfig.title;
      
      if (titleLength >= min && titleLength <= max) {
        newChecks.push({ 
          id: 'title-length', 
          status: 'pass', 
          message: `Title length is optimal (${min}-${max} chars)`, 
          points: activeConfig.title.weight 
        });
        totalScore += activeConfig.title.weight;
      } else {
        newChecks.push({ 
          id: 'title-length', 
          status: 'warning', 
          message: `Title: ${titleLength} chars (optimal: ${min}-${max})`, 
          points: 0 
        });
      }
    }

    // Content/Description checks
    const contentField = data.content || data.description;
    if (activeConfig.content && contentField) {
      maxScore += activeConfig.content.weight;
      const wordCount = contentField.wordCount || contentField.text?.split(/\s+/).length || 0;
      
      if (wordCount >= activeConfig.content.minWords) {
        newChecks.push({ 
          id: 'content-length', 
          status: 'pass', 
          message: `Content length: ${wordCount} words`, 
          points: activeConfig.content.weight 
        });
        totalScore += activeConfig.content.weight;
      } else {
        newChecks.push({ 
          id: 'content-length', 
          status: 'warning', 
          message: `Content: ${wordCount} words (min: ${activeConfig.content.minWords})`, 
          points: 0 
        });
      }

      // Check for structure (headings)
      if (contentField.html?.includes('<h')) {
        maxScore += 5;
        newChecks.push({ 
          id: 'headings', 
          status: 'pass', 
          message: 'Content has headings', 
          points: 5 
        });
        totalScore += 5;
      }
    }

    // SEO checks
    if (activeConfig.metaTitle && data.meta_title) {
      maxScore += activeConfig.metaTitle.weight;
      const { min, max } = activeConfig.metaTitle;
      
      if (data.meta_title.length >= min && data.meta_title.length <= max) {
        newChecks.push({ 
          id: 'meta-title', 
          status: 'pass', 
          message: 'Meta title optimized', 
          points: activeConfig.metaTitle.weight 
        });
        totalScore += activeConfig.metaTitle.weight;
      } else {
        newChecks.push({ 
          id: 'meta-title', 
          status: 'warning', 
          message: `Meta title: ${data.meta_title.length} chars (optimal: ${min}-${max})`, 
          points: 0 
        });
      }
    }

    if (activeConfig.metaDescription && data.meta_description) {
      maxScore += activeConfig.metaDescription.weight;
      const { min, max } = activeConfig.metaDescription;
      
      if (data.meta_description.length >= min && data.meta_description.length <= max) {
        newChecks.push({ 
          id: 'meta-desc', 
          status: 'pass', 
          message: 'Meta description optimized', 
          points: activeConfig.metaDescription.weight 
        });
        totalScore += activeConfig.metaDescription.weight;
      } else {
        newChecks.push({ 
          id: 'meta-desc', 
          status: 'warning', 
          message: `Meta description: ${data.meta_description.length} chars (optimal: ${min}-${max})`, 
          points: 0 
        });
      }
    }

    // Media checks
    if (activeConfig.featuredImage && activeConfig.featuredImage.required) {
      maxScore += activeConfig.featuredImage.weight;
      if (data.featured_image) {
        newChecks.push({ 
          id: 'featured-image', 
          status: 'pass', 
          message: 'Featured image set', 
          points: activeConfig.featuredImage.weight 
        });
        totalScore += activeConfig.featuredImage.weight;
      } else {
        newChecks.push({ 
          id: 'featured-image', 
          status: 'warning', 
          message: 'Add featured image', 
          points: 0 
        });
      }
    }

    // Gallery checks (for case studies)
    if (activeConfig.gallery && data.gallery_images) {
      maxScore += activeConfig.gallery.weight;
      if (data.gallery_images.length >= activeConfig.gallery.min) {
        newChecks.push({ 
          id: 'gallery', 
          status: 'pass', 
          message: `${data.gallery_images.length} gallery images`, 
          points: activeConfig.gallery.weight 
        });
        totalScore += activeConfig.gallery.weight;
      } else {
        newChecks.push({ 
          id: 'gallery', 
          status: 'info', 
          message: `Add more gallery images (${data.gallery_images.length}/${activeConfig.gallery.min})`, 
          points: 0 
        });
      }
    }

    // Tags/Features checks
    if (activeConfig.tags && data.tags) {
      maxScore += activeConfig.tags.weight;
      if (data.tags.length >= activeConfig.tags.min) {
        newChecks.push({ 
          id: 'tags', 
          status: 'pass', 
          message: `${data.tags.length} tags added`, 
          points: activeConfig.tags.weight 
        });
        totalScore += activeConfig.tags.weight;
      } else {
        newChecks.push({ 
          id: 'tags', 
          status: 'info', 
          message: `Add more tags (${data.tags.length}/${activeConfig.tags.min})`, 
          points: 0 
        });
      }
    }

    setChecks(newChecks);
    setScore(maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0);
  };

  const formatFieldName = (field) => {
    return field.split(/[._]/).map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = () => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Improvement';
    return 'Poor';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pass':
        return <Icon name="CheckCircle" size={16} className="text-green-500" />;
      case 'warning':
        return <Icon name="AlertCircle" size={16} className="text-yellow-500" />;
      case 'error':
        return <Icon name="XCircle" size={16} className="text-red-500" />;
      case 'info':
        return <Icon name="Info" size={16} className="text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border p-4 space-y-4">
      {/* Overall Score */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Quality Score</h3>
          <p className="text-sm text-gray-500">Content optimization analysis</p>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold ${getScoreColor()}`}>
            {score}%
          </div>
          <div className="text-sm text-gray-500">{getScoreLabel()}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <Progress value={score} className="h-2" />

      {/* Quality Checks */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Quality Checks</h4>
        <div className="space-y-1 max-h-60 overflow-y-auto">
          {checks.map((check) => (
            <div key={check.id} className="flex items-start space-x-2 py-1">
              {getStatusIcon(check.status)}
              <span className="text-sm text-gray-600 flex-1">{check.message}</span>
              {check.points > 0 && (
                <span className="text-xs text-gray-400">+{check.points}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Publishing Readiness */}
      <div className="pt-3 border-t">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Ready to Publish</span>
          <span className={`text-sm font-medium ${score >= 60 ? 'text-green-600' : 'text-red-600'}`}>
            {score >= 60 ? 'Yes' : 'Not Yet'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QualityCheck;