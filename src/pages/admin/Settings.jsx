// src/pages/admin/Settings.jsx
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Icon from '../../components/AdminIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Checkbox } from '../../components/ui/Checkbox';

const Settings = () => {
  const { userProfile } = useOutletContext();
  const [activeTab, setActiveTab] = useState('categories');
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingType, setEditingType] = useState('');

  // Data states
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [partnerships, setPartnerships] = useState([]);
  const [awards, setAwards] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Form state
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [
        categoriesRes,
        tagsRes,
        testimonialsRes,
        partnershipsRes,
        awardsRes,
        departmentsRes
      ] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('tags').select('*').order('name'),
        supabase.from('testimonials').select('*').order('sort_order'),
        supabase.from('partnerships').select('*').order('sort_order'),
        supabase.from('awards').select('*').order('year', { ascending: false }),
        supabase.from('departments').select('*').order('sort_order')
      ]);

      setCategories(categoriesRes.data || []);
      setTags(tagsRes.data || []);
      setTestimonials(testimonialsRes.data || []);
      setPartnerships(partnershipsRes.data || []);
      setAwards(awardsRes.data || []);
      setDepartments(departmentsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      let tableName = editingType;
      let data = { ...formData };

      // Generate slug if needed
      if ((tableName === 'categories' || tableName === 'tags' || tableName === 'departments' || tableName === 'partnerships') && !data.slug && data.name) {
        data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }

      if (editingItem) {
        const { error } = await supabase
          .from(tableName)
          .update(data)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from(tableName)
          .insert(data);
        if (error) throw error;
      }

      await fetchAllData();
      setShowEditor(false);
      setEditingItem(null);
      setEditingType('');
      setFormData({});
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving: ' + error.message);
    }
  };

  const handleDelete = async (tableName, id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchAllData();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Error deleting: ' + error.message);
    }
  };

  const openEditor = (type, item = null) => {
    setEditingType(type);
    setEditingItem(item);
    
    // Set default form data based on type
    if (item) {
      setFormData(item);
    } else {
      switch(type) {
        case 'categories':
          setFormData({
            name: '',
            slug: '',
            description: '',
            type: 'article',
            icon: '',
            color: '',
            sort_order: 0,
            is_active: true
          });
          break;
        case 'tags':
          setFormData({
            name: '',
            slug: '',
            type: '',
            description: '',
            is_active: true
          });
          break;
        case 'testimonials':
          setFormData({
            client_name: '',
            client_title: '',
            client_company: '',
            client_avatar: '',
            client_logo: '',
            quote: '',
            long_quote: '',
            rating: 5,
            video_url: '',
            is_featured: false,
            display_locations: [],
            industry: '',
            service_type: '',
            sort_order: 0,
            status: 'published'
          });
          break;
        case 'partnerships':
          setFormData({
            slug: '',
            name: '',
            category: '',
            icon: '',
            color: '',
            description: '',
            services: [],
            certification_count: 0,
            project_count: 0,
            benefits: [],
            features: [],
            is_active: true,
            is_featured: false,
            sort_order: 0
          });
          break;
        case 'awards':
          setFormData({
            title: '',
            organization: '',
            year: new Date().getFullYear().toString(),
            category: '',
            description: '',
            icon: '',
            color: '',
            sort_order: 0,
            is_active: true
          });
          break;
        case 'departments':
          setFormData({
            name: '',
            slug: '',
            description: '',
            icon: '',
            color: '',
            sort_order: 0,
            is_active: true
          });
          break;
        default:
          setFormData({});
      }
    }
    
    setShowEditor(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  // Only admins can access settings
  if (userProfile?.role !== 'admin') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <Icon name="AlertCircle" size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-medium text-red-900 mb-2">Access Denied</h2>
        <p className="text-red-700">Only administrators can manage settings.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-heading-bold uppercase">Site Settings</h1>
          <Button
            variant="outline"
            onClick={fetchAllData}
            iconName="RefreshCw"
          >
            Refresh
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 border-b overflow-x-auto">
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'categories' 
                ? 'border-accent text-accent' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Categories ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab('tags')}
            className={`px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'tags' 
                ? 'border-accent text-accent' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Tags ({tags.length})
          </button>
          <button
            onClick={() => setActiveTab('testimonials')}
            className={`px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'testimonials' 
                ? 'border-accent text-accent' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Testimonials ({testimonials.length})
          </button>
          <button
            onClick={() => setActiveTab('partnerships')}
            className={`px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'partnerships' 
                ? 'border-accent text-accent' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Partnerships ({partnerships.length})
          </button>
          <button
            onClick={() => setActiveTab('awards')}
            className={`px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'awards' 
                ? 'border-accent text-accent' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Awards ({awards.length})
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'departments' 
                ? 'border-accent text-accent' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Departments ({departments.length})
          </button>
        </div>
      </div>

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="font-heading-bold text-lg uppercase">Content Categories</h2>
            <Button
              variant="default"
              size="sm"
              onClick={() => openEditor('categories')}
              iconName="Plus"
              className="bg-accent hover:bg-accent/90"
            >
              Add Category
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {category.icon && <Icon name={category.icon} size={16} />}
                        <span className="font-medium">{category.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{category.slug}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{category.type}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        category.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {category.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => openEditor('categories', category)}
                      >
                        <Icon name="Edit" size={16} />
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => handleDelete('categories', category.id)}
                        className="text-red-600"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tags Tab */}
      {activeTab === 'tags' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="font-heading-bold text-lg uppercase">Tags</h2>
            <Button
              variant="default"
              size="sm"
              onClick={() => openEditor('tags')}
              iconName="Plus"
              className="bg-accent hover:bg-accent/90"
            >
              Add Tag
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
            {tags.map((tag) => (
              <div key={tag.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium">{tag.name}</h3>
                  <span className="text-xs text-gray-500">Used {tag.usage_count || 0}x</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{tag.slug}</p>
                <div className="flex justify-end space-x-2">
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => openEditor('tags', tag)}
                  >
                    <Icon name="Edit" size={14} />
                  </Button>
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => handleDelete('tags', tag.id)}
                    className="text-red-600"
                  >
                    <Icon name="Trash2" size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Testimonials Tab */}
      {activeTab === 'testimonials' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="font-heading-bold text-lg uppercase">Testimonials</h2>
            <Button
              variant="default"
              size="sm"
              onClick={() => openEditor('testimonials')}
              iconName="Plus"
              className="bg-accent hover:bg-accent/90"
            >
              Add Testimonial
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {testimonial.client_avatar ? (
                      <img 
                        src={testimonial.client_avatar} 
                        alt={testimonial.client_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <Icon name="User" size={20} className="text-gray-600" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{testimonial.client_name}</p>
                      <p className="text-sm text-gray-600">
                        {testimonial.client_title} {testimonial.client_company && `at ${testimonial.client_company}`}
                      </p>
                    </div>
                  </div>
                  {testimonial.is_featured && (
                    <Icon name="Star" size={16} className="text-yellow-500" />
                  )}
                </div>
                
                <p className="text-sm text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                
                {testimonial.rating && (
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Icon 
                        key={i} 
                        name="Star" 
                        size={14} 
                        className={i < testimonial.rating ? 'text-yellow-500' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    testimonial.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {testimonial.status}
                  </span>
                  <div className="space-x-2">
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => openEditor('testimonials', testimonial)}
                    >
                      <Icon name="Edit" size={14} />
                    </Button>
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => handleDelete('testimonials', testimonial.id)}
                      className="text-red-600"
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Partnerships Tab */}
      {activeTab === 'partnerships' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="font-heading-bold text-lg uppercase">Technology Partnerships</h2>
            <Button
              variant="default"
              size="sm"
              onClick={() => openEditor('partnerships')}
              iconName="Plus"
              className="bg-accent hover:bg-accent/90"
            >
              Add Partnership
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {partnerships.map((partnership) => (
              <div key={partnership.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {partnership.icon && (
                      <div className={`p-2 rounded-lg ${partnership.color || 'bg-gray-100'}`}>
                        <Icon name={partnership.icon} size={20} />
                      </div>
                    )}
                    <h3 className="font-medium">{partnership.name}</h3>
                  </div>
                  {partnership.is_featured && (
                    <Icon name="Star" size={16} className="text-yellow-500" />
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{partnership.description}</p>
                
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
                  <div>
                    <span className="font-medium">{partnership.certification_count || 0}</span> Certifications
                  </div>
                  <div>
                    <span className="font-medium">{partnership.project_count || 0}</span> Projects
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => openEditor('partnerships', partnership)}
                  >
                    <Icon name="Edit" size={14} />
                  </Button>
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => handleDelete('partnerships', partnership.id)}
                    className="text-red-600"
                  >
                    <Icon name="Trash2" size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Awards Tab */}
      {activeTab === 'awards' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="font-heading-bold text-lg uppercase">Awards & Recognition</h2>
            <Button
              variant="default"
              size="sm"
              onClick={() => openEditor('awards')}
              iconName="Plus"
              className="bg-accent hover:bg-accent/90"
            >
              Add Award
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Award</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Organization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Year</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {awards.map((award) => (
                  <tr key={award.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {award.icon && <Icon name={award.icon} size={16} />}
                        <span className="font-medium">{award.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{award.organization}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{award.category}</td>
                    <td className="px-6 py-4 text-center text-sm font-medium">{award.year}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => openEditor('awards', award)}
                      >
                        <Icon name="Edit" size={16} />
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => handleDelete('awards', award.id)}
                        className="text-red-600"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Departments Tab */}
      {activeTab === 'departments' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="font-heading-bold text-lg uppercase">Departments</h2>
            <Button
              variant="default"
              size="sm"
              onClick={() => openEditor('departments')}
              iconName="Plus"
              className="bg-accent hover:bg-accent/90"
            >
              Add Department
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {departments.map((dept) => (
              <div key={dept.id} className="border rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-3">
                  {dept.icon && (
                    <div className={`p-2 rounded-lg ${dept.color || 'bg-gray-100'}`}>
                      <Icon name={dept.icon} size={20} />
                    </div>
                  )}
                  <h3 className="font-medium">{dept.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">{dept.description}</p>
                <div className="flex justify-between items-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    dept.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {dept.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <div className="space-x-2">
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => openEditor('departments', dept)}
                    >
                      <Icon name="Edit" size={14} />
                    </Button>
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => handleDelete('departments', dept.id)}
                      className="text-red-600"
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-heading-bold uppercase">
                {editingItem ? `Edit ${editingType.slice(0, -1)}` : `New ${editingType.slice(0, -1)}`}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowEditor(false);
                  setEditingItem(null);
                  setEditingType('');
                  setFormData({});
                }}
              >
                <Icon name="X" size={24} />
              </Button>
            </div>

            <div className="p-6 space-y-4">
              {/* Dynamic form based on type */}
              {editingType === 'categories' && (
                <>
                  <Input
                    label="Name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Slug"
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="auto-generated"
                  />
                  <Input
                    label="Description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                  <Select
                    label="Type"
                    value={formData.type || 'article'}
                    onChange={(value) => setFormData({ ...formData, type: value })}
                    options={[
                      { value: 'article', label: 'Article' },
                      { value: 'resource', label: 'Resource' },
                      { value: 'case_study', label: 'Case Study' }
                    ]}
                  />
                  <Checkbox
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    label="Active"
                  />
                </>
              )}

              {editingType === 'tags' && (
                <>
                  <Input
                    label="Name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Slug"
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="auto-generated"
                  />
                  <Input
                    label="Description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                  <Checkbox
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    label="Active"
                  />
                </>
              )}

              {editingType === 'testimonials' && (
                <>
                  <Input
                    label="Client Name"
                    value={formData.client_name || ''}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Title"
                      value={formData.client_title || ''}
                      onChange={(e) => setFormData({ ...formData, client_title: e.target.value })}
                    />
                    <Input
                      label="Company"
                      value={formData.client_company || ''}
                      onChange={(e) => setFormData({ ...formData, client_company: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Quote</label>
                    <textarea
                      value={formData.quote || ''}
                      onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                      className="w-full h-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
                      required
                    />
                  </div>
                  <Select
                    label="Rating"
                    value={formData.rating || 5}
                    onChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}
                    options={[
                      { value: 5, label: '5 Stars' },
                      { value: 4, label: '4 Stars' },
                      { value: 3, label: '3 Stars' },
                      { value: 2, label: '2 Stars' },
                      { value: 1, label: '1 Star' }
                    ]}
                  />
                  <Checkbox
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                    label="Featured"
                  />
                </>
              )}

              {editingType === 'partnerships' && (
                <>
                  <Input
                    label="Name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="number"
                      label="Certifications"
                      value={formData.certification_count || 0}
                      onChange={(e) => setFormData({ ...formData, certification_count: parseInt(e.target.value) })}
                    />
                    <Input
                      type="number"
                      label="Projects"
                      value={formData.project_count || 0}
                      onChange={(e) => setFormData({ ...formData, project_count: parseInt(e.target.value) })}
                    />
                  </div>
                  <Checkbox
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                    label="Featured"
                  />
                  <Checkbox
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    label="Active"
                  />
                </>
              )}

              {editingType === 'awards' && (
                <>
                  <Input
                    label="Award Title"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                  <Input
                    label="Organization"
                    value={formData.organization || ''}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Year"
                      value={formData.year || ''}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      required
                    />
                    <Input
                      label="Category"
                      value={formData.category || ''}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    />
                  </div>
                  <Input
                    label="Description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </>
              )}

              {editingType === 'departments' && (
                <>
                  <Input
                    label="Name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Slug"
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="auto-generated"
                  />
                  <Input
                    label="Description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                  <Checkbox
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    label="Active"
                  />
                </>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditor(false);
                  setEditingItem(null);
                  setEditingType('');
                  setFormData({});
                }}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleSave}
                className="bg-accent hover:bg-accent/90"
              >
                {editingItem ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;