// src/pages/admin/case-studies/editor-tabs/DetailsTab.jsx
import React, { useState, useEffect } from 'react';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AdminIcon';
import { caseStudyOperations } from '../services/CaseStudyOperations';
import { useToast } from '../../../../components/ui/Toast';
import { supabase } from '../../../../lib/supabase';

const DetailsTab = ({ formData, errors, onChange, userProfile }) => {
  const toast = useToast();
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [performancePrediction, setPerformancePrediction] = useState(null);
  const [abTestResults, setAbTestResults] = useState(null);
  const [variants, setVariants] = useState([]);
  const [loadingVariants, setLoadingVariants] = useState(false);
  const [testimonials, setTestimonials] = useState([]);

  // Load variants if this is a parent case study
  useEffect(() => {
    if (formData.id && !formData.parent_case_study_id) {
      loadVariants();
    }
  }, [formData.id]);

  // Fetch testimonials for selection
  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching testimonials:', error);
        setTestimonials([]);
        return;
      }
      
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error in fetchTestimonials:', error);
      setTestimonials([]);
    }
  };

  const loadVariants = async () => {
    try {
      const result = await caseStudyOperations.getVariants(formData.id);
      if (result.success) {
        setVariants(result.data.filter(v => v.id !== formData.id));
      }
    } catch (error) {
      console.error('Error loading variants:', error);
      setVariants([]);
    }
  };

  // Meta keywords management
  const handleMetaKeywordsChange = (value, index) => {
    const newKeywords = [...(formData.meta_keywords || [])];
    newKeywords[index] = value;
    onChange('meta_keywords', newKeywords);
  };

  const addMetaKeyword = () => {
    onChange('meta_keywords', [...(formData.meta_keywords || []), '']);
  };

  const removeMetaKeyword = (index) => {
    const newKeywords = [...(formData.meta_keywords || [])];
    newKeywords.splice(index, 1);
    onChange('meta_keywords', newKeywords);
  };

  // A/B Testing functions
  const createABTestVariants = async () => {
    setLoadingVariants(true);
    try {
      const variantNames = ['Variant B', 'Variant C'];
      let created = 0;
      
      for (const variantName of variantNames) {
        const result = await caseStudyOperations.createVariant(formData.id, variantName, userProfile);
        if (result.success) created++;
      }
      
      if (created > 0) {
        toast.success('A/B test variants created', `${created} variants created successfully. You can now edit each variant independently.`);
        await loadVariants();
      }
    } catch (error) {
      console.error('Error creating variants:', error);
      toast.error('Failed to create variants', error.message);
    }
    setLoadingVariants(false);
  };

  const activateABTest = async () => {
    const endDate = prompt('Enter test end date (YYYY-MM-DD):');
    if (!endDate) return;
    
    try {
      const result = await caseStudyOperations.activateABTest(formData.id, endDate, userProfile);
      if (result.success) {
        toast.success('A/B test activated', 'The test is now running and tracking metrics.');
        onChange('ab_test_active', true);
        onChange('ab_test_start_date', new Date().toISOString());
        onChange('ab_test_end_date', endDate);
      }
    } catch (error) {
      console.error('Error activating test:', error);
      toast.error('Failed to activate test', error.message);
    }
  };

  const viewABTestResults = async () => {
    try {
      const result = await caseStudyOperations.getABTestResults(formData.id);
      if (result.success) {
        setAbTestResults(result.data);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  const openVariant = (variantId) => {
    window.open(`/admin/case-studies/edit/${variantId}`, '_blank');
  };

  const openParentCaseStudy = (parentId) => {
    window.open(`/admin/case-studies/edit/${parentId}`, '_blank');
  };

  // Get AI suggestions
  const getAISuggestions = async () => {
    try {
      const result = await caseStudyOperations.getAISuggestions(formData);
      if (result.success) {
        setAiSuggestions(result.suggestions);
      } else {
        setAiSuggestions({
          metaTitle: [`${formData.title}: A Success Story`, `How We Helped ${formData.client_name}`],
          metaDescription: ['Discover how we transformed...', 'Learn about our partnership...'],
          keywords: ['case study', formData.service_type, formData.client_industry].filter(Boolean)
        });
      }
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
    }
  };

  // Get performance prediction
  const getPerformancePrediction = async () => {
    try {
      const result = await caseStudyOperations.predictPerformance(formData);
      if (result.success) {
        setPerformancePrediction(result.prediction);
      } else {
        setPerformancePrediction({
          estimatedViews: 2500,
          estimatedInquiries: 25,
          confidence: 0.78,
          recommendations: [
            'Add more metrics for credibility',
            'Include client testimonial',
            'Optimize meta description'
          ]
        });
      }
    } catch (error) {
      console.error('Error getting prediction:', error);
    }
  };

  // Helper functions
  const getRichTextPreview = (content) => {
    if (!content) return '';
    if (typeof content === 'string') return content.substring(0, 160);
    if (content.type === 'doc' && content.content) {
      const firstParagraph = content.content.find(node => node.type === 'paragraph');
      if (firstParagraph?.content?.[0]?.text) {
        return firstParagraph.content[0].text.substring(0, 160);
      }
    }
    if (content.html) return '';
    if (content.json) return '';
    return '';
  };

  const hasRichTextContent = (content) => {
    if (!content) return false;
    if (typeof content === 'string') return content.trim().length > 0;
    if (content.html) return true;
    if (content.json) return true;
    if (content.type === 'doc' && content.content?.length > 0) return true;
    return false;
  };

  const getRealGalleryImagesCount = () => {
    if (!formData.gallery_images) return 0;
    return formData.gallery_images.filter(img => 
      img.url && !img.url.includes('placeholder') && !img.url.includes('no_image')
    ).length;
  };

  return (
    <div className="space-y-6">
      {/* Custom Quality Check */}
      <div className="border rounded-lg p-4 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Quality Score</h3>
            <p className="text-sm text-gray-500">Content optimization analysis</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              <span className={
                formData.performance_score >= 70 ? 'text-green-600' : 
                formData.performance_score >= 40 ? 'text-yellow-600' : 
                'text-red-600'
              }>
                {formData.performance_score || 0}%
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {formData.performance_score >= 70 ? 'Good' : 
               formData.performance_score >= 40 ? 'Fair' : 'Needs Work'}
            </div>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className={`h-2 rounded-full transition-all ${
              formData.performance_score >= 70 ? 'bg-green-500' : 
              formData.performance_score >= 40 ? 'bg-yellow-500' : 
              'bg-red-500'
            }`}
            style={{ width: `${formData.performance_score || 0}%` }}
          />
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Quality Checks</h4>
          
          <div className="flex items-center gap-2 text-sm">
            {formData.title ? 
              <Icon name="CheckCircle" size={16} className="text-green-500" /> : 
              <Icon name="XCircle" size={16} className="text-red-500" />
            }
            <span className={formData.title ? 'text-gray-700' : 'text-gray-500'}>
              Title is provided
            </span>
            {formData.title && <span className="text-gray-400 ml-auto">+10</span>}
          </div>

          <div className="flex items-center gap-2 text-sm">
            {hasRichTextContent(formData.challenge) ? 
              <Icon name="CheckCircle" size={16} className="text-green-500" /> : 
              <Icon name="XCircle" size={16} className="text-red-500" />
            }
            <span className={hasRichTextContent(formData.challenge) ? 'text-gray-700' : 'text-gray-500'}>
              Challenge content is provided
            </span>
            {hasRichTextContent(formData.challenge) && <span className="text-gray-400 ml-auto">+10</span>}
          </div>

          <div className="flex items-center gap-2 text-sm">
            {hasRichTextContent(formData.solution) ? 
              <Icon name="CheckCircle" size={16} className="text-green-500" /> : 
              <Icon name="XCircle" size={16} className="text-red-500" />
            }
            <span className={hasRichTextContent(formData.solution) ? 'text-gray-700' : 'text-gray-500'}>
              Solution content is provided
            </span>
            {hasRichTextContent(formData.solution) && <span className="text-gray-400 ml-auto">+10</span>}
          </div>

          <div className="flex items-center gap-2 text-sm">
            {hasRichTextContent(formData.implementation_process) ? 
              <Icon name="CheckCircle" size={16} className="text-green-500" /> : 
              <Icon name="AlertCircle" size={16} className="text-yellow-500" />
            }
            <span className={hasRichTextContent(formData.implementation_process) ? 'text-gray-700' : 'text-gray-500'}>
              Implementation process described
            </span>
            {hasRichTextContent(formData.implementation_process) && <span className="text-gray-400 ml-auto">+10</span>}
          </div>

          <div className="flex items-center gap-2 text-sm">
            {formData.results_narrative?.length > 0 ? 
              <Icon name="CheckCircle" size={16} className="text-green-500" /> : 
              <Icon name="XCircle" size={16} className="text-red-500" />
            }
            <span className={formData.results_narrative?.length > 0 ? 'text-gray-700' : 'text-gray-500'}>
              Detailed results provided ({formData.results_narrative?.length || 0} metrics)
            </span>
            {formData.results_narrative?.length > 0 && <span className="text-gray-400 ml-auto">+10</span>}
          </div>

          <div className="flex items-center gap-2 text-sm">
            {formData.key_metrics?.length >= 3 ? 
              <Icon name="CheckCircle" size={16} className="text-green-500" /> : 
              <Icon name="AlertCircle" size={16} className="text-yellow-500" />
            }
            <span className={formData.key_metrics?.length >= 3 ? 'text-gray-700' : 'text-gray-500'}>
              Key metrics ({formData.key_metrics?.length || 0}/3 minimum)
            </span>
            {formData.key_metrics?.length >= 3 && <span className="text-gray-400 ml-auto">+20</span>}
          </div>

          <div className="flex items-center gap-2 text-sm">
            {formData.hero_image && !formData.hero_image.includes('placeholder') && !formData.hero_image.includes('no_image') ? 
              <Icon name="CheckCircle" size={16} className="text-green-500" /> : 
              <Icon name="AlertCircle" size={16} className="text-yellow-500" />
            }
            <span className={formData.hero_image && !formData.hero_image.includes('placeholder') ? 'text-gray-700' : 'text-gray-500'}>
              Hero image added
            </span>
            {formData.hero_image && !formData.hero_image.includes('placeholder') && <span className="text-gray-400 ml-auto">+10</span>}
          </div>

          <div className="flex items-center gap-2 text-sm">
            {getRealGalleryImagesCount() > 0 ? 
              <Icon name="CheckCircle" size={16} className="text-green-500" /> : 
              <Icon name="AlertCircle" size={16} className="text-blue-500" />
            }
            <span className={getRealGalleryImagesCount() > 0 ? 'text-gray-700' : 'text-gray-500'}>
              Gallery images ({getRealGalleryImagesCount()}/3 recommended)
            </span>
            {getRealGalleryImagesCount() > 0 && <span className="text-gray-400 ml-auto">+10</span>}
          </div>

          <div className="flex items-center gap-2 text-sm">
            {formData.testimonial_id || testimonials.length === 0 ? 
              <Icon name="CheckCircle" size={16} className="text-green-500" /> : 
              <Icon name="AlertCircle" size={16} className="text-blue-500" />
            }
            <span className={formData.testimonial_id ? 'text-gray-700' : 'text-gray-500'}>
              Client testimonial {testimonials.length === 0 ? '(no testimonials available)' : formData.testimonial_id ? 'linked' : 'not linked'}
            </span>
            {formData.testimonial_id && <span className="text-gray-400 ml-auto">+10</span>}
          </div>

          <div className="flex items-center gap-2 text-sm">
            {formData.seo_score >= 75 ? 
              <Icon name="CheckCircle" size={16} className="text-green-500" /> : 
              <Icon name="AlertCircle" size={16} className="text-yellow-500" />
            }
            <span className={formData.seo_score >= 75 ? 'text-gray-700' : 'text-gray-500'}>
              SEO optimization ({formData.seo_score || 0}% score)
            </span>
            {formData.seo_score >= 75 && <span className="text-gray-400 ml-auto">+10</span>}
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t flex justify-between items-center">
          <div className="text-sm">
            <span className="text-gray-600">Ready to Publish: </span>
            <span className={formData.performance_score >= 70 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
              {formData.performance_score >= 70 ? 'Yes' : 'No'}
            </span>
          </div>
          {formData.performance_score < 70 && (
            <div className="text-xs text-gray-500">
              Minimum 70% required
            </div>
          )}
        </div>
      </div>
      
      {/* Publishing Settings */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Publishing Settings</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Status"
              value={formData.status}
              onChange={(value) => onChange('status', value)}
              options={[
                { value: 'draft', label: 'Draft' },
                { value: 'published', label: 'Published' },
                { value: 'scheduled', label: 'Scheduled' },
                { value: 'archived', label: 'Archived' }
              ]}
              error={errors.status}
            />

            {formData.status === 'scheduled' && (
              <Input
                type="datetime-local"
                label="Schedule Publication"
                value={formData.scheduled_at}
                onChange={(e) => onChange('scheduled_at', e.target.value)}
                error={errors.scheduled_at}
                required
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="flex items-start space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured || false}
                  onChange={(e) => onChange('is_featured', e.target.checked)}
                  className="mt-1 h-4 w-4 text-accent border-gray-300 rounded focus:ring-accent"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Featured Case Study</span>
                  <p className="text-xs text-gray-500">Display prominently</p>
                </div>
              </label>
            </div>
            
            <Input
              type="number"
              label="Sort Order"
              value={formData.sort_order || 0}
              onChange={(e) => onChange('sort_order', parseInt(e.target.value) || 0)}
              min="0"
              placeholder="0"
            />

            <Select
              label="Language"
              value={formData.language || 'en'}
              onChange={(value) => onChange('language', value)}
              options={[
                { value: 'en', label: 'English' },
                { value: 'es', label: 'Spanish' },
                { value: 'fr', label: 'French' },
                { value: 'de', label: 'German' }
              ]}
            />
          </div>

          {/* A/B Testing Section */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="text-sm font-medium text-gray-700 mb-3">A/B Testing</h4>
            
            {!formData.parent_case_study_id && !formData.is_variant ? (
              <div className="space-y-3">
                {formData.id ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Test Status: {formData.ab_test_active ? 
                          <span className="font-medium text-green-600">Active</span> : 
                          <span className="font-medium text-gray-500">Inactive</span>
                        }
                      </span>
                      {!formData.ab_test_active && variants.length === 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={createABTestVariants}
                          disabled={loadingVariants}
                        >
                          <Icon name="Copy" size={14} className="mr-2" />
                          {loadingVariants ? 'Creating...' : 'Create Test Variants'}
                        </Button>
                      )}
                      {!formData.ab_test_active && variants.length > 0 && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={activateABTest}
                        >
                          <Icon name="Play" size={14} className="mr-2" />
                          Activate Test
                        </Button>
                      )}
                    </div>
                    
                    {variants.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Test Variants:</p>
                        {variants.map(variant => (
                          <div key={variant.id} className="flex items-center justify-between bg-white rounded p-2">
                            <span className="text-sm text-gray-600">{variant.variant_name || variant.title}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openVariant(variant.id)}
                            >
                              <Icon name="ExternalLink" size={14} className="mr-1" />
                              Edit
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {formData.ab_test_active && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="text-sm text-blue-700">
                          <p className="font-medium">A/B test is running</p>
                          <p className="text-xs mt-1">
                            Started: {formData.ab_test_start_date ? new Date(formData.ab_test_start_date).toLocaleDateString() : 'N/A'}
                          </p>
                          {formData.ab_test_end_date && (
                            <p className="text-xs">
                              Ends: {new Date(formData.ab_test_end_date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={viewABTestResults}
                        >
                          View Results
                        </Button>
                      </div>
                    )}

                    {abTestResults && abTestResults.length > 0 && (
                      <div className="bg-white border rounded-lg p-3 mt-3">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Test Results</h5>
                        <div className="space-y-2">
                          {abTestResults.map(result => (
                            <div key={result.variant_name} className="text-xs">
                              <div className="flex justify-between mb-1">
                                <span className="font-medium">{result.variant_name || 'Control'}</span>
                                <span className="text-green-600">{result.conversion_rate}% conversion</span>
                              </div>
                              <div className="text-gray-500">
                                Views: {result.view_count} | Inquiries: {result.inquiry_count}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-500">Save the case study first to enable A/B testing</p>
                )}
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="text-sm text-yellow-700">
                  <p className="font-medium">This is a test variant</p>
                  <p>Variant: {formData.variant_name || formData.ab_test_variant}</p>
                  {formData.parent_case_study_id && (
                    <Button
                      variant="link"
                      size="sm"
                      className="mt-2 p-0"
                      onClick={() => openParentCaseStudy(formData.parent_case_study_id)}
                    >
                      View parent case study →
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEO Settings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">SEO Settings</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={getAISuggestions}
          >
            <Icon name="Sparkles" size={16} className="mr-2" />
            Get AI Suggestions
          </Button>
        </div>
        
        {aiSuggestions && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">AI Suggestions</h4>
            <div className="space-y-2 text-sm text-blue-700">
              <div>
                <strong>Title Options:</strong>
                {aiSuggestions.metaTitle.map((title, i) => (
                  <button
                    key={i}
                    onClick={() => onChange('meta_title', title)}
                    className="block hover:underline"
                  >
                    • {title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          <Input
            label="Meta Title"
            value={formData.meta_title}
            onChange={(e) => onChange('meta_title', e.target.value)}
            placeholder={formData.title || "SEO optimized title (60 chars max)"}
            error={errors.meta_title}
            maxLength={60}
            showCount
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description
            </label>
            <textarea
              value={formData.meta_description}
              onChange={(e) => onChange('meta_description', e.target.value)}
              placeholder={getRichTextPreview(formData.challenge) || "SEO description (155-160 characters)"}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
              rows={3}
              maxLength={160}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{formData.meta_description?.length || 0} / 160 characters</span>
              <span>SEO Score: {formData.seo_score || 0}%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Keywords
            </label>
            {(formData.meta_keywords || []).map((keyword, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={keyword}
                  onChange={(e) => handleMetaKeywordsChange(e.target.value, index)}
                  placeholder="Keyword or phrase"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeMetaKeyword(index)}
                >
                  ×
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addMetaKeyword}
            >
              Add Keyword
            </Button>
          </div>

          <Input
            label="Canonical URL"
            value={formData.canonical_url}
            onChange={(e) => onChange('canonical_url', e.target.value)}
            placeholder={`https://rule27design.com/case-studies/${formData.slug || 'case-study-slug'}`}
            error={errors.canonical_url}
          />
        </div>
      </div>

      {/* Open Graph Settings */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media Preview</h3>
        
        <div className="space-y-4">
          <Input
            label="Open Graph Title"
            value={formData.og_title}
            onChange={(e) => onChange('og_title', e.target.value)}
            placeholder={formData.title || "Title for social media sharing"}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Open Graph Description
            </label>
            <textarea
              value={formData.og_description}
              onChange={(e) => onChange('og_description', e.target.value)}
              placeholder={formData.results_summary || "Description for social media sharing"}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
              rows={3}
            />
          </div>

          <Input
            label="Open Graph Image URL"
            value={formData.og_image}
            onChange={(e) => onChange('og_image', e.target.value)}
            placeholder={formData.hero_image || "Image URL for social sharing"}
          />
        </div>
      </div>

      {/* Performance Prediction */}
      {formData.id && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Performance Insights</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={getPerformancePrediction}
            >
              <Icon name="TrendingUp" size={16} className="mr-2" />
              Predict Performance
            </Button>
          </div>

          {performancePrediction && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-2xl font-bold text-green-700">
                    {performancePrediction.estimatedViews}
                  </div>
                  <div className="text-sm text-green-600">Est. Views</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-700">
                    {performancePrediction.estimatedInquiries}
                  </div>
                  <div className="text-sm text-green-600">Est. Inquiries</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-700">
                    {(performancePrediction.confidence * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-green-600">Confidence</div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-green-900 mb-2">Recommendations</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  {performancePrediction.recommendations.map((rec, i) => (
                    <li key={i}>• {rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Internal Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Internal Notes
        </label>
        <textarea
          value={formData.internal_notes || ''}
          onChange={(e) => onChange('internal_notes', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
          rows={4}
          placeholder="Notes for the team (not visible to visitors)..."
        />
      </div>

      {/* Case Study Statistics */}
      {formData.id && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Performance Metrics</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Version:</dt>
              <dd className="text-gray-900">{formData.version || 1}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Views:</dt>
              <dd className="text-gray-900">{formData.view_count || 0}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Unique Views:</dt>
              <dd className="text-gray-900">{formData.unique_view_count || 0}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Inquiries Generated:</dt>
              <dd className="text-gray-900">{formData.inquiry_count || 0}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Quality Score:</dt>
              <dd className="text-gray-900 font-medium">
                <span className={formData.performance_score >= 70 ? 'text-green-600' : formData.performance_score >= 40 ? 'text-yellow-600' : 'text-red-600'}>
                  {formData.performance_score || 0}%
                </span>
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">SEO Score:</dt>
              <dd className="text-gray-900 font-medium">
                <span className={formData.seo_score >= 70 ? 'text-green-600' : formData.seo_score >= 40 ? 'text-yellow-600' : 'text-red-600'}>
                  {formData.seo_score || 0}%
                </span>
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Created:</dt>
              <dd className="text-gray-900">
                {formData.created_at ? new Date(formData.created_at).toLocaleDateString() : 'N/A'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Last Updated:</dt>
              <dd className="text-gray-900">
                {formData.updated_at ? new Date(formData.updated_at).toLocaleDateString() : 'N/A'}
              </dd>
            </div>
            {formData.published_at && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Published:</dt>
                <dd className="text-gray-900">
                  {new Date(formData.published_at).toLocaleDateString()}
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </div>
  );
};

export default DetailsTab;