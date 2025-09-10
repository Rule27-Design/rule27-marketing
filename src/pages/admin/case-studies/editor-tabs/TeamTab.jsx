// src/pages/admin/case-studies/editor-tabs/TeamTab.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AdminIcon';

const TeamTab = ({ formData, errors, onChange, userProfile }) => {
  const [availableProfiles, setAvailableProfiles] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    fetchProfiles();
    fetchTestimonials();
  }, []);

  const fetchProfiles = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, title, avatar_url')
      .in('role', ['admin', 'contributor'])
      .order('full_name');
    
    setAvailableProfiles(data || []);
  };

  const fetchTestimonials = async () => {
    const { data } = await supabase
      .from('testimonials')
      .select('id, author_name, author_title, company')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    setTestimonials(data || []);
  };

  // Handle team members
  const addTeamMember = () => {
    const newMembers = [...(formData.team_members || [])];
    newMembers.push({ 
      profile_id: '', 
      role: '', 
      responsibilities: [] 
    });
    onChange('team_members', newMembers);
  };

  const updateTeamMember = (index, field, value) => {
    const newMembers = [...(formData.team_members || [])];
    newMembers[index] = { ...newMembers[index], [field]: value };
    onChange('team_members', newMembers);
  };

  const removeTeamMember = (index) => {
    const newMembers = formData.team_members.filter((_, i) => i !== index);
    onChange('team_members', newMembers);
  };

  // Handle responsibilities
  const addResponsibility = (memberIndex) => {
    const newMembers = [...formData.team_members];
    if (!newMembers[memberIndex].responsibilities) {
      newMembers[memberIndex].responsibilities = [];
    }
    newMembers[memberIndex].responsibilities.push('');
    onChange('team_members', newMembers);
  };

  const updateResponsibility = (memberIndex, respIndex, value) => {
    const newMembers = [...formData.team_members];
    newMembers[memberIndex].responsibilities[respIndex] = value;
    onChange('team_members', newMembers);
  };

  const removeResponsibility = (memberIndex, respIndex) => {
    const newMembers = [...formData.team_members];
    newMembers[memberIndex].responsibilities.splice(respIndex, 1);
    onChange('team_members', newMembers);
  };

  return (
    <div className="space-y-6">
      {/* Project Lead */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Lead
        </label>
        <Select
          value={formData.project_lead || ''}
          onChange={(value) => onChange('project_lead', value)}
          options={[
            { value: '', label: 'Select project lead...' },
            ...availableProfiles.map(profile => ({
              value: profile.id,
              label: `${profile.full_name} - ${profile.title}`
            }))
          ]}
        />
        {errors.project_lead && (
          <p className="text-xs text-red-500 mt-1">{errors.project_lead}</p>
        )}
      </div>

      {/* Team Members */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Team Members
          </label>
          <Button
            variant="outline"
            size="xs"
            onClick={addTeamMember}
            iconName="Plus"
          >
            Add Team Member
          </Button>
        </div>
        
        <div className="space-y-4">
          {(formData.team_members || []).map((member, memberIndex) => (
            <div key={memberIndex} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Select
                    value={member.profile_id || ''}
                    onChange={(value) => updateTeamMember(memberIndex, 'profile_id', value)}
                    options={[
                      { value: '', label: 'Select team member...' },
                      ...availableProfiles
                        .filter(p => p.id !== formData.project_lead)
                        .map(profile => ({
                          value: profile.id,
                          label: profile.full_name
                        }))
                    ]}
                    size="sm"
                  />
                  
                  <Input
                    type="text"
                    value={member.role || ''}
                    onChange={(e) => updateTeamMember(memberIndex, 'role', e.target.value)}
                    placeholder="Role in project"
                    size="sm"
                  />
                </div>
                
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => removeTeamMember(memberIndex)}
                  className="text-red-500 ml-2"
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
              
              {/* Responsibilities */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-gray-600">Responsibilities</label>
                  <button
                    onClick={() => addResponsibility(memberIndex)}
                    className="text-xs text-accent hover:text-accent/80"
                  >
                    + Add
                  </button>
                </div>
                
                <div className="space-y-1">
                  {(member.responsibilities || []).map((resp, respIndex) => (
                    <div key={respIndex} className="flex items-center space-x-2">
                      <span className="text-gray-400">•</span>
                      <Input
                        type="text"
                        value={resp}
                        onChange={(e) => updateResponsibility(memberIndex, respIndex, e.target.value)}
                        placeholder="Responsibility"
                        size="xs"
                      />
                      <button
                        onClick={() => removeResponsibility(memberIndex, respIndex)}
                        className="text-red-500 hover:text-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {(formData.team_members || []).length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No team members added yet
          </p>
        )}
      </div>

      {/* Client Testimonial */}
      <div className="border-t pt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Client Testimonial
        </label>
        <Select
          value={formData.testimonial_id || ''}
          onChange={(value) => onChange('testimonial_id', value)}
          options={[
            { value: '', label: 'Select testimonial...' },
            { value: 'new', label: '+ Create new testimonial' },
            ...testimonials.map(test => ({
              value: test.id,
              label: `${test.author_name} - ${test.company}`
            }))
          ]}
        />
        
        {formData.testimonial_id === 'new' && (
          <div className="mt-3 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              You can create a new testimonial from the Testimonials section after saving this case study.
            </p>
          </div>
        )}
        
        {formData.testimonial_id && formData.testimonial_id !== 'new' && (
          <div className="mt-3 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              ✓ Testimonial linked to this case study
            </p>
          </div>
        )}
      </div>

      {/* Team Preview */}
      {(formData.project_lead || formData.team_members?.length > 0) && (
        <div className="border-t pt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Team Preview</h3>
          
          <div className="space-y-2">
            {formData.project_lead && (
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                <div className="w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center">
                  <Icon name="Star" size={16} />
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {availableProfiles.find(p => p.id === formData.project_lead)?.full_name}
                  </p>
                  <p className="text-xs text-gray-500">Project Lead</p>
                </div>
              </div>
            )}
            
            {formData.team_members?.map((member, index) => {
              const profile = availableProfiles.find(p => p.id === member.profile_id);
              if (!profile) return null;
              
              return (
                <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    {profile.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt={profile.full_name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <Icon name="User" size={16} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{profile.full_name}</p>
                    <p className="text-xs text-gray-500">{member.role || 'Team Member'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamTab;