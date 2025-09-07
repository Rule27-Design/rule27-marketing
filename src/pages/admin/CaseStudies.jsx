// src/pages/admin/CaseStudies.jsx - Enhanced version
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Icon from '../../components/AdminIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Checkbox } from '../../components/ui/Checkbox';
import ImageUpload, { GalleryUpload } from '../../components/ui/ImageUpload';
import ContentEditor, { ContentDisplay } from '../../components/ui/ContentEditor';

const CaseStudies = () => {
  const { userProfile } = useOutletContext();
  const [caseStudies, setCaseStudies] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingStudy, setEditingStudy] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, content, media, metrics, settings
  const [filters, setFilters] = useState({
    status: 'all',
    industry: 'all',
    service_type: 'all',
    featured: 'all',
    search: ''
  });
  
  // Enhanced form state
  const [formData, setFormData] = useState({
    // Basic Info
    title: '',
    slug: '',
    client_name: '',
    client_logo: '',
    client_website: '',
    industry: '',
    service_type: '',
    business_stage: '',
    
    // Media
    hero_image: '',
    hero_video: '',
    gallery: [],
    
    // Content
    description: '',
    challenge: null,
    solution: null,
    implementation: null,
    
    // Project Details
    project_duration: '',
    start_date: '',
    end_date: '',
    technologies_used: [],
    deliverables: [],
    team_members: [],
    project_lead: '',
    
    // Metrics & Results
    key_metrics: [
      { label: '', before: '', after: '', improvement: '', type: 'percentage' }
    ],
    detailed_results: [],
    process_steps: [],
    
    // Settings
    testimonial_id: '',
    status: 'draft',
    is_featured: false,
    is_confidential: false,
    is_active: true,
    sort_order: 0,
    
    // SEO
    meta_title: '',
    meta_description: '',
    meta_keywords: [],
    og_title: '',
    og_description: '',
    og_image: '',
    
    // Internal
    internal_notes: '',
    schema_markup: null
  });

  // Filter options
  const [filterOptions, setFilterOptions] = useState({
    industries: [],
    serviceTypes: [],
    businessStages: []
  });

  useEffect(() => {
    fetchCaseStudies();
    fetchTestimonials();
    fetchFilterOptions();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      const { data, error } = await supabase
        .from('case_studies')
        .select(`
          *,
          testimonial:testimonials!testimonial_id(
            id,
            client_name,
            client_company,
            quote,
            rating
          ),
          project_lead_profile:profiles!project_lead(
            id,
            full_name,
            avatar_url
          )
        `)
        .order('updated_at', { ascending: false });

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
        .select('id, client_name, client_company, quote')
        .eq('status', 'published')
        .order('client_name');
      
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const { data: studies } = await supabase
        .from('case_studies')
        .select('industry, service_type, business_stage')
        .eq('is_active', true);

      if (studies) {
        const industries = [...new Set(studies.map(s => s.industry).filter(Boolean))];
        const serviceTypes = [...new Set(studies.map(s => s.service_type).filter(Boolean))];
        const businessStages = [...new Set(studies.map(s => s.business_stage).filter(Boolean))];

        setFilterOptions({
          industries,
          serviceTypes,
          businessStages
        });
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const filterCaseStudies = () => {
    return caseStudies.filter(study => {
      if (filters.status !== 'all' && study.status !== filters.status) return false;
      if (filters.industry !== 'all' && study.industry !== filters.industry) return false;
      if (filters.service_type !== 'all' && study.service_type !== filters.service_type) return false;
      if (filters.featured !== 'all') {
        const isFeatured = study.is_featured ? 'featured' : 'not_featured';
        if (isFeatured !== filters.featured) return false;
      }
      if (filters.search && !study.title.toLowerCase().includes(filters.search.toLowerCase()) && 
          !study.client_name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
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
        meta_keywords: formData.meta_keywords.filter(Boolean),
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
      setActiveTab('overview');
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

  const handleEditStudy = (study) => {
    setEditingStudy(study);
    setFormData({
      title: study.title || '',
      slug: study.slug || '',
      client_name: study.client_name || '',
      client_logo: study.client_logo || '',
      client_website: study.client_website || '',
      industry: study.industry || '',
      service_type: study.service_type || '',
      business_stage: study.business_stage || '',
      hero_image: study.hero_image || '',
      hero_video: study.hero_video || '',
      gallery: study.gallery || [],
      description: study.description || '',
      challenge: study.challenge,
      solution: study.solution,
      implementation: study.implementation,
      project_duration: study.project_duration || '',
      start_date: study.start_date || '',
      end_date: study.end_date || '',
      technologies_used: study.technologies_used || [],
      deliverables: study.deliverables || [],
      team_members: study.team_members || [],
      project_lead: study.project_lead || '',
      key_metrics: study.key_metrics || [{ label: '', before: '', after: '', improvement: '', type: 'percentage' }],
      detailed_results: study.detailed_results || [],
      process_steps: study.process_steps || [],
      testimonial_id: study.testimonial_id || '',
      status: study.status || 'draft',
      is_featured: study.is_featured || false,
      is_confidential: study.is_confidential || false,
      is_active: study.is_active !== false,
      sort_order: study.sort_order || 0,
      meta_title: study.meta_title || '',
      meta_description: study.meta_description || '',
      meta_keywords: study.meta_keywords || [],
      og_title: study.og_title || '',
      og_description: study.og_description || '',
      og_image: study.og_image || '',
      internal_notes: study.internal_notes || '',
      schema_markup: study.schema_markup
    });
    setShowEditor(true);
  };

  const addMetric = () => {
    setFormData({
      ...formData,
      key_metrics: [...formData.key_metrics, { label: '', before: '', after: '', improvement: '', type: 'percentage' }]
    });
  };

  const updateMetric = (index, field, value) => {
    const newMetrics = [...formData.key_metrics];
    newMetrics[index][field] = value;
    
    // Auto-calculate improvement if before and after are numbers
    if (field === 'before' || field === 'after') {
      const before = parseFloat(newMetrics[index].before?.replace(/[^0-9.-]/g, ''));
      const after = parseFloat(newMetrics[index].after?.replace(/[^0-9.-]/g, ''));
      
      if (!isNaN(before) && !isNaN(after) && before > 0) {
        const improvement = Math.round(((after - before) / before) * 100);
        newMetrics[index].improvement = `${improvement > 0 ? '+' : ''}${improvement}%`;
      }
    }
    
    setFormData({ ...formData, key_metrics: newMetrics });
  };

  const removeMetric = (index) => {
    const newMetrics = formData.key_metrics.filter((_, i) => i !== index);
    setFormData({ ...formData, key_metrics: newMetrics });
  };

  const addArrayItem = (field) => {
    setFormData({
      ...formData,
      [field]: [...(formData[field] || []), '']
    });
  };

  const updateArrayItem = (field, index, value) => {
    const newArray = [...(formData[field] || [])];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const removeArrayItem = (field, index) => {
    const newArray = (formData[field] || []).filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
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
      challenge: null,
      solution: null,
      implementation: null,
      project_duration: '',
      start_date: '',
      end_date: '',
      technologies_used: [],
      deliverables: [],
      team_members: [],
      project_lead: '',
      key_metrics: [{ label: '', before: '', after: '', improvement: '', type: 'percentage' }],
      detailed_results: [],
      process_steps: [],
      testimonial_id: '',
      status: 'draft',
      is_featured: false,
      is_confidential: false,
      is_active: true,
      sort_order: 0,
      meta_title: '',
      meta_description: '',
      meta_keywords: [],
      og_title: '',
      og_description: '',
      og_image: '',
      internal_notes: '',
      schema_markup: null
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

  const filteredCaseStudies = filterCaseStudies();

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
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-heading-bold uppercase">Case Studies</h1>
            <p className="text-gray-600 mt-1">{filteredCaseStudies.length} of {caseStudies.length} case studies</p>
          </div>
          <Button
            variant="default"
            onClick={() => setShowEditor(true)}
            iconName="Plus"
            className="bg-accent hover:bg-accent/90"
          >
            New Case Study
          </Button>
        </div>

        {/* Enhanced Filters */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Input
            placeholder="Search studies..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          
          <Select
            value={filters.status}
            onChange={(value) => setFilters({ ...filters, status: value })}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'draft', label: 'Draft' },
              { value: 'pending_approval', label: 'Pending' },
              { value: 'approved', label: 'Approved' },
              { value: 'published', label: 'Published' },
              { value: 'archived', label: 'Archived' }
            ]}
          />

          <Select
            value={filters.industry}
            onChange={(value) => setFilters({ ...filters, industry: value })}
            options={[
              { value: 'all', label: 'All Industries' },
              ...filterOptions.industries.map(industry => ({ value: industry, label: industry }))
            ]}
          />

          <Select
            value={filters.service_type}
            onChange={(value) => setFilters({ ...filters, service_type: value })}
            options={[
              { value: 'all', label: 'All Services' },
              ...filterOptions.serviceTypes.map(service => ({ value: service, label: service }))
            ]}
          />

          <Select
            value={filters.featured}
            onChange={(value) => setFilters({ ...filters, featured: value })}
            options={[
              { value: 'all', label: 'All Studies' },
              { value: 'featured', label: 'Featured' },
              { value: 'not_featured', label: 'Not Featured' }
            ]}
          />

          <Button
            variant="outline"
            onClick={fetchCaseStudies}
            iconName="RefreshCw"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Case Studies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCaseStudies.map((study) => (
          <div key={study.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
            {study.hero_image && (
              <div className="relative">
                <img 
                  src={study.hero_image} 
                  alt={study.title}
                  className="w-full h-48 object-cover"
                />
                {study.is_featured && (
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Icon name="Star" size={12} className="mr-1" />
                      Featured
                    </span>
                  </div>
                )}
                {study.is_confidential && (
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <Icon name="Lock" size={12} className="mr-1" />
                      Confidential
                    </span>
                  </div>
                )}
              </div>
            )}
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-lg line-clamp-2">{study.title}</h3>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  {study.client_logo && (
                    <img 
                      src={study.client_logo} 
                      alt={study.client_name}
                      className="w-6 h-6 object-contain"
                    />
                  )}
                  <p className="text-sm font-medium text-gray-900">{study.client_name}</p>
                </div>
                <p className="text-sm text-gray-500">{study.industry} • {study.service_type}</p>
                {study.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{study.description}</p>
                )}
              </div>

              {/* Key Metrics Preview */}
              {study.key_metrics && study.key_metrics.length > 0 && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    {study.key_metrics.slice(0, 2).map((metric, index) => (
                      <div key={index}>
                        <div className="text-lg font-bold text-accent">{metric.improvement || metric.after}</div>
                        <div className="text-xs text-gray-600">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(study.status)}`}>
                  {study.status}
                </span>
                <div className="flex items-center space-x-3 text-xs text-gray-500">
                  <span><Icon name="Eye" size={12} className="inline mr-1" />{study.view_count || 0}</span>
                  <span><Icon name="TrendingUp" size={12} className="inline mr-1" />{study.conversion_count || 0}</span>
                </div>
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
                    variant="default"
                    onClick={() => handleStatusChange(study.id, 'approved')}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Approve
                  </Button>
                )}
                {study.status === 'approved' && (
                  <Button
                    size="xs"
                    variant="default"
                    onClick={() => handleStatusChange(study.id, 'published')}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    Publish
                  </Button>
                )}
                
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => handleEditStudy(study)}
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

      {filteredCaseStudies.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Icon name="Briefcase" size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 mb-4">
            {caseStudies.length === 0 ? 'No case studies yet' : 'No case studies match your filters'}
          </p>
          <Button onClick={() => setShowEditor(true)}>Create Your First Case Study</Button>
        </div>
      )}

      {/* Enhanced Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gray-50">
              <div>
                <h2 className="text-xl font-heading-bold uppercase">
                  {editingStudy ? 'Edit Case Study' : 'New Case Study'}
                </h2>
                {editingStudy && (
                  <p className="text-sm text-gray-600 mt-1">
                    Last updated: {new Date(editingStudy.updated_at).toLocaleString()}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowEditor(false);
                  setEditingStudy(null);
                  setActiveTab('overview');
                  resetForm();
                }}
              >
                <Icon name="X" size={24} />
              </Button>
            </div>

            {/* Tab Navigation */}
            <div className="border-b bg-white">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'overview', label: 'Overview', icon: 'Briefcase' },
                  { id: 'content', label: 'Content', icon: 'Edit' },
                  { id: 'media', label: 'Media', icon: 'Image' },
                  { id: 'metrics', label: 'Metrics', icon: 'TrendingUp' },
                  { id: 'settings', label: 'Settings', icon: 'Settings' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-accent text-accent'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon name={tab.icon} size={16} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Project Title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      placeholder="Enter case study title"
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
                    </div>
                    
                    <div className="mt-4">
                      <ImageUpload
                        label="Client Logo"
                        value={formData.client_logo}
                        onChange={(value) => setFormData({ ...formData, client_logo: value })}
                        bucket="media"
                        folder="case-studies/logos"
                      />
                    </div>
                  </div>

                  {/* Project Classification */}
                  <div className="border-t pt-6">
                    <h3 className="font-medium mb-4">Project Classification</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Select
                        label="Industry"
                        value={formData.industry}
                        onChange={(value) => setFormData({ ...formData, industry: value })}
                        options={[
                          { value: '', label: 'Select industry...' },
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
                      
                      <Input
                        label="Service Type"
                        value={formData.service_type}
                        onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                        placeholder="e.g., Web Development, Branding"
                      />
                      
                      <Input
                        label="Business Stage"
                        value={formData.business_stage}
                        onChange={(e) => setFormData({ ...formData, business_stage: e.target.value })}
                        placeholder="e.g., Startup, Growth, Enterprise"
                      />
                    </div>
                  </div>

                  {/* Project Timeline */}
                  <div className="border-t pt-6">
                    <h3 className="font-medium mb-4">Project Timeline</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        label="Project Duration"
                        value={formData.project_duration}
                        onChange={(e) => setFormData({ ...formData, project_duration: e.target.value })}
                        placeholder="e.g., 3 months"
                      />
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
                </div>
              )}

              {activeTab === 'content' && (
                <div className="space-y-6">
                  <ContentEditor
                    value={formData.challenge}
                    onChange={(content) => setFormData({ ...formData, challenge: content })}
                    label="Challenge"
                    placeholder="What problems did the client face?"
                  />

                  <ContentEditor
                    value={formData.solution}
                    onChange={(content) => setFormData({ ...formData, solution: content })}
                    label="Solution"
                    placeholder="How did you solve their problems?"
                  />

                  <ContentEditor
                    value={formData.implementation}
                    onChange={(content) => setFormData({ ...formData, implementation: content })}
                    label="Implementation"
                    placeholder="How was the solution implemented?"
                  />

                  {/* Technologies & Deliverables */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Technologies Used</label>
                      {formData.technologies_used.map((tech, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <Input
                            value={tech}
                            onChange={(e) => updateArrayItem('technologies_used', index, e.target.value)}
                            placeholder="Technology name"
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeArrayItem('technologies_used', index)}
                          >
                            <Icon name="X" size={16} />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addArrayItem('technologies_used')}
                        iconName="Plus"
                      >
                        Add Technology
                      </Button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Deliverables</label>
                      {formData.deliverables.map((deliverable, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <Input
                            value={deliverable}
                            onChange={(e) => updateArrayItem('deliverables', index, e.target.value)}
                            placeholder="Deliverable item"
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeArrayItem('deliverables', index)}
                          >
                            <Icon name="X" size={16} />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addArrayItem('deliverables')}
                        iconName="Plus"
                      >
                        Add Deliverable
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'media' && (
                <div className="space-y-6">
                  <ImageUpload
                    label="Hero Image"
                    value={formData.hero_image}
                    onChange={(value) => setFormData({ ...formData, hero_image: value })}
                    bucket="media"
                    folder="case-studies"
                  />

                  <Input
                    label="Hero Video URL (optional)"
                    value={formData.hero_video}
                    onChange={(e) => setFormData({ ...formData, hero_video: e.target.value })}
                    placeholder="YouTube, Vimeo, or direct video URL"
                  />

                  <GalleryUpload
                    label="Project Gallery"
                    value={formData.gallery}
                    onChange={(value) => setFormData({ ...formData, gallery: value })}
                    bucket="media"
                    folder="case-studies/gallery"
                    maxImages={10}
                  />
                </div>
              )}

              {activeTab === 'metrics' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-4">Key Metrics</h3>
                    {formData.key_metrics.map((metric, index) => (
                      <div key={index} className="grid grid-cols-6 gap-2 mb-4 p-4 border rounded-lg">
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
                          placeholder="Improvement"
                          value={metric.improvement}
                          onChange={(e) => updateMetric(index, 'improvement', e.target.value)}
                        />
                        <Select
                          value={metric.type}
                          onChange={(value) => updateMetric(index, 'type', value)}
                          options={[
                            { value: 'percentage', label: 'Percentage' },
                            { value: 'number', label: 'Number' },
                            { value: 'currency', label: 'Currency' },
                            { value: 'time', label: 'Time' }
                          ]}
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

                  {/* Results Preview */}
                  {formData.key_metrics.some(m => m.label) && (
                    <div className="border-t pt-6">
                      <h4 className="font-medium mb-4">Metrics Preview</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {formData.key_metrics.filter(m => m.label).map((metric, index) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-accent">{metric.improvement || metric.after}</div>
                            <div className="text-sm text-gray-600">{metric.label}</div>
                            {metric.before && (
                              <div className="text-xs text-gray-500">From {metric.before}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Publishing Settings</h3>
                      
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
                            label: `${t.client_name}${t.client_company ? ` (${t.client_company})` : ''}`
                          }))
                        ]}
                      />

                      <div className="space-y-3">
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

                    <div className="space-y-4">
                      <h3 className="font-medium">SEO Settings</h3>
                      
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

                      <ImageUpload
                        label="Open Graph Image"
                        value={formData.og_image}
                        onChange={(value) => setFormData({ ...formData, og_image: value })}
                        bucket="media"
                        folder="case-studies/social"
                        showPreview={true}
                      />
                    </div>
                  </div>

                  {/* Internal Notes */}
                  <div className="border-t pt-6">
                    <h3 className="font-medium mb-4">Internal Notes</h3>
                    <textarea
                      value={formData.internal_notes}
                      onChange={(e) => setFormData({ ...formData, internal_notes: e.target.value })}
                      className="w-full h-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
                      placeholder="Notes for the team..."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="border-t bg-gray-50 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditor(false);
                    setEditingStudy(null);
                    setActiveTab('overview');
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              </div>

              <div className="flex items-center space-x-3">
                {formData.status === 'draft' && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFormData({ ...formData, status: 'pending_approval' });
                      setTimeout(handleSave, 100);
                    }}
                    className="bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100"
                  >
                    Submit for Review
                  </Button>
                )}
                
                <Button
                  variant="default"
                  onClick={handleSave}
                  className="bg-accent hover:bg-accent/90"
                  iconName="Save"
                >
                  {editingStudy ? 'Update Case Study' : 'Create Case Study'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseStudies;