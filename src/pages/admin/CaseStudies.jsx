// src/pages/admin/CaseStudies.jsx
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Checkbox } from '../../components/ui/Checkbox';

const CaseStudies = () => {
  const { userProfile } = useOutletContext();
  const [caseStudies, setCaseStudies] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingStudy, setEditingStudy] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    client_name: '',
    client_logo: '',
    client_website: '',
    industry: '',
    service_type: '',
    business_stage: '',
    hero_image: '',
    hero_video: '',
    gallery: [],
    description: '',
    challenge: '',
    solution: '',
    implementation: '',
    project_duration: '',
    start_date: '',
    end_date: '',
    key_metrics: [
      { label: '', before: '', after: '', improvement: '' }
    ],
    detailed_results: [],
    process_steps: [],
    technologies_used: [],
    deliverables: [],
    testimonial_id: '',
    status: 'draft',
    is_featured: false,
    is_confidential: false,
    is_active: true,
    meta_title: '',
    meta_description: ''
  });

  useEffect(() => {
    fetchCaseStudies();
    fetchTestimonials();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      const { data, error } = await supabase
        .from('case_studies')
        .select(`
          *,
          testimonial:testimonials!testimonial_id(
            client_name,
            quote,
            rating
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCaseStudies(data || []);
    } catch (error) {
      console.error('Error fetching case studies:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const { data } = await supabase
        .from('testimonials')
        .select('id, client_name, client_company')
        .eq('status', 'published')
        .order('client_name');
      
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.slug && formData.title) {
        formData.slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }

      const studyData = {
        ...formData,
        technologies_used: formData.technologies_used.filter(Boolean),
        deliverables: formData.deliverables.filter(Boolean),
        key_metrics: formData.key_metrics.filter(m => m.label),
        gallery: formData.gallery.filter(Boolean),
        updated_by: userProfile.id
      };

      if (editingStudy) {
        const { error } = await supabase
          .from('case_studies')
          .update(studyData)
          .eq('id', editingStudy.id);

        if (error) throw error;
      } else {
        studyData.created_by = userProfile.id;
        const { error } = await supabase
          .from('case_studies')
          .insert(studyData);

        if (error) throw error;
      }

      await fetchCaseStudies();
      setShowEditor(false);
      setEditingStudy(null);
      resetForm();
    } catch (error) {
      console.error('Error saving case study:', error);
      alert('Error saving case study: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this case study?')) return;

    try {
      const { error } = await supabase
        .from('case_studies')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchCaseStudies();
    } catch (error) {
      console.error('Error deleting case study:', error);
      alert('Error deleting case study: ' + error.message);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updateData = { status: newStatus };
      
      if (newStatus === 'approved') {
        updateData.approved_by = userProfile.id;
        updateData.approved_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('case_studies')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      await fetchCaseStudies();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const addMetric = () => {
    setFormData({
      ...formData,
      key_metrics: [...formData.key_metrics, { label: '', before: '', after: '', improvement: '' }]
    });
  };

  const updateMetric = (index, field, value) => {
    const newMetrics = [...formData.key_metrics];
    newMetrics[index][field] = value;
    setFormData({ ...formData, key_metrics: newMetrics });
  };

  const removeMetric = (index) => {
    const newMetrics = formData.key_metrics.filter((_, i) => i !== index);
    setFormData({ ...formData, key_metrics: newMetrics });
  };

  const addGalleryImage = () => {
    setFormData({
      ...formData,
      gallery: [...formData.gallery, '']
    });
  };

  const updateGalleryImage = (index, value) => {
    const newGallery = [...formData.gallery];
    newGallery[index] = value;
    setFormData({ ...formData, gallery: newGallery });
  };

  const removeGalleryImage = (index) => {
    const newGallery = formData.gallery.filter((_, i) => i !== index);
    setFormData({ ...formData, gallery: newGallery });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      client_name: '',
      client_logo: '',
      client_website: '',
      industry: '',
      service_type: '',
      business_stage: '',
      hero_image: '',
      hero_video: '',
      gallery: [],
      description: '',
      challenge: '',
      solution: '',
      implementation: '',
      project_duration: '',
      start_date: '',
      end_date: '',
      key_metrics: [
        { label: '', before: '', after: '', improvement: '' }
      ],
      detailed_results: [],
      process_steps: [],
      technologies_used: [],
      deliverables: [],
      testimonial_id: '',
      status: 'draft',
      is_featured: false,
      is_confidential: false,
      is_active: true,
      meta_title: '',
      meta_description: ''
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-heading-bold uppercase">Case Studies</h1>
          <Button
            variant="default"
            onClick={() => setShowEditor(true)}
            iconName="Plus"
            className="bg-accent hover:bg-accent/90"
          >
            New Case Study
          </Button>
        </div>
      </div>

      {/* Case Studies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {caseStudies.map((study) => (
          <div key={study.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
            {study.hero_image && (
              <img 
                src={study.hero_image} 
                alt={study.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-lg">{study.title}</h3>
                {study.is_featured && (
                  <Icon name="Star" size={16} className="text-yellow-500" />
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{study.client_name}</p>
              <p className="text-sm text-gray-500 mb-4">{study.industry} • {study.service_type}</p>
              
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(study.status)}`}>
                  {study.status}
                </span>
                <span className="text-xs text-gray-500">
                  {study.view_count || 0} views
                </span>
              </div>

              <div className="flex space-x-2">
                {study.status === 'draft' && (
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => handleStatusChange(study.id, 'pending_approval')}
                  >
                    Submit
                  </Button>
                )}
                {study.status === 'pending_approval' && userProfile?.role === 'admin' && (
                  <Button
                    size="xs"
                    variant="success"
                    onClick={() => handleStatusChange(study.id, 'approved')}
                  >
                    Approve
                  </Button>
                )}
                {study.status === 'approved' && (
                  <Button
                    size="xs"
                    variant="default"
                    onClick={() => handleStatusChange(study.id, 'published')}
                  >
                    Publish
                  </Button>
                )}
                
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => {
                    setEditingStudy(study);
                    setFormData(study);
                    setShowEditor(true);
                  }}
                >
                  <Icon name="Edit" size={16} />
                </Button>
                
                {userProfile?.role === 'admin' && (
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => handleDelete(study.id)}
                    className="text-red-600"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {caseStudies.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Icon name="Briefcase" size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 mb-4">No case studies yet</p>
          <Button onClick={() => setShowEditor(true)}>Create Your First Case Study</Button>
        </div>
      )}

      {/* Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-heading-bold uppercase">
                {editingStudy ? 'Edit Case Study' : 'New Case Study'}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowEditor(false);
                  setEditingStudy(null);
                  resetForm();
                }}
              >
                <Icon name="X" size={24} />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Project Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <Input
                  label="Slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="auto-generated"
                />
              </div>

              {/* Client Info */}
              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">Client Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Client Name"
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    required
                  />
                  <Input
                    label="Client Website"
                    value={formData.client_website}
                    onChange={(e) => setFormData({ ...formData, client_website: e.target.value })}
                  />
                  <Input
                    label="Client Logo URL"
                    value={formData.client_logo}
                    onChange={(e) => setFormData({ ...formData, client_logo: e.target.value })}
                  />
                  <Select
                    label="Industry"
                    value={formData.industry}
                    onChange={(value) => setFormData({ ...formData, industry: value })}
                    options={[
                      { value: 'Technology', label: 'Technology' },
                      { value: 'Healthcare', label: 'Healthcare' },
                      { value: 'Finance', label: 'Finance' },
                      { value: 'E-commerce', label: 'E-commerce' },
                      { value: 'Education', label: 'Education' },
                      { value: 'Real Estate', label: 'Real Estate' },
                      { value: 'Manufacturing', label: 'Manufacturing' },
                      { value: 'Other', label: 'Other' }
                    ]}
                  />
                </div>
              </div>

              {/* Project Details */}
              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">Project Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    label="Service Type"
                    value={formData.service_type}
                    onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                  />
                  <Input
                    label="Business Stage"
                    value={formData.business_stage}
                    onChange={(e) => setFormData({ ...formData, business_stage: e.target.value })}
                    placeholder="e.g., Startup, Growth, Enterprise"
                  />
                  <Input
                    label="Project Duration"
                    value={formData.project_duration}
                    onChange={(e) => setFormData({ ...formData, project_duration: e.target.value })}
                    placeholder="e.g., 3 months"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      label="Start Date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    />
                    <Input
                      type="date"
                      label="End Date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
                </div>

                <Input
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief project description"
                />

                <div className="grid grid-cols-1 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Challenge</label>
                    <textarea
                      value={formData.challenge}
                      onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                      className="w-full h-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
                      placeholder="What problems did the client face?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Solution</label>
                    <textarea
                      value={formData.solution}
                      onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                      className="w-full h-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
                      placeholder="How did you solve their problems?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Implementation</label>
                    <textarea
                      value={formData.implementation}
                      onChange={(e) => setFormData({ ...formData, implementation: e.target.value })}
                      className="w-full h-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
                      placeholder="How was the solution implemented?"
                    />
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">Key Metrics</h3>
                {formData.key_metrics.map((metric, index) => (
                  <div key={index} className="grid grid-cols-5 gap-2 mb-2">
                    <Input
                      placeholder="Metric Label"
                      value={metric.label}
                      onChange={(e) => updateMetric(index, 'label', e.target.value)}
                    />
                    <Input
                      placeholder="Before"
                      value={metric.before}
                      onChange={(e) => updateMetric(index, 'before', e.target.value)}
                    />
                    <Input
                      placeholder="After"
                      value={metric.after}
                      onChange={(e) => updateMetric(index, 'after', e.target.value)}
                    />
                    <Input
                      placeholder="Improvement %"
                      value={metric.improvement}
                      onChange={(e) => updateMetric(index, 'improvement', e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMetric(index)}
                    >
                      <Icon name="X" size={16} />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addMetric}
                  iconName="Plus"
                >
                  Add Metric
                </Button>
              </div>

              {/* Media */}
              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">Media</h3>
                <div className="space-y-4">
                  <Input
                    label="Hero Image URL"
                    value={formData.hero_image}
                    onChange={(e) => setFormData({ ...formData, hero_image: e.target.value })}
                  />
                  <Input
                    label="Hero Video URL (optional)"
                    value={formData.hero_video}
                    onChange={(e) => setFormData({ ...formData, hero_video: e.target.value })}
                  />
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Gallery Images</label>
                    {formData.gallery.map((image, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          placeholder="Image URL"
                          value={image}
                          onChange={(e) => updateGalleryImage(index, e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeGalleryImage(index)}
                        >
                          <Icon name="X" size={16} />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addGalleryImage}
                      iconName="Plus"
                    >
                      Add Gallery Image
                    </Button>
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Select
                    label="Status"
                    value={formData.status}
                    onChange={(value) => setFormData({ ...formData, status: value })}
                    options={[
                      { value: 'draft', label: 'Draft' },
                      { value: 'pending_approval', label: 'Pending Approval' },
                      { value: 'approved', label: 'Approved' },
                      { value: 'published', label: 'Published' },
                      { value: 'archived', label: 'Archived' }
                    ]}
                  />
                  
                  <Select
                    label="Testimonial"
                    value={formData.testimonial_id}
                    onChange={(value) => setFormData({ ...formData, testimonial_id: value })}
                    options={[
                      { value: '', label: 'No testimonial' },
                      ...testimonials.map(t => ({
                        value: t.id,
                        label: `${t.client_name} (${t.client_company})`
                      }))
                    ]}
                  />
                </div>

                <div className="flex items-center space-x-6">
                  <Checkbox
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                    label="Featured"
                    description="Show prominently on homepage"
                  />
                  <Checkbox
                    checked={formData.is_confidential}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_confidential: checked })}
                    label="Confidential"
                    description="Hide sensitive details"
                  />
                  <Checkbox
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    label="Active"
                    description="Visible to users"
                  />
                </div>
              </div>

              {/* SEO */}
              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">SEO Settings</h3>
                <div className="space-y-4">
                  <Input
                    label="Meta Title"
                    value={formData.meta_title}
                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                  />
                  <Input
                    label="Meta Description"
                    value={formData.meta_description}
                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditor(false);
                  setEditingStudy(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleSave}
                className="bg-accent hover:bg-accent/90"
              >
                {editingStudy ? 'Update Case Study' : 'Create Case Study'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseStudies;