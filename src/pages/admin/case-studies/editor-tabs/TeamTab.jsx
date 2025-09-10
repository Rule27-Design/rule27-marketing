// src/pages/admin/case-studies/editor-tabs/TeamTab.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AdminIcon';
import { cn } from '../../../../utils';

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
      .select('id, full_name, role, avatar_url')
      .in('role', ['admin', 'contributor'])
      .order('full_name');
    setAvailableProfiles(data || []);
  };

  const fetchTestimonials = async () => {
    const { data } = await supabase
      .from('testimonials')
      .select('id, author_name, author_title, company')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });
    setTestimonials(data || []);
  };

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
    onChange('team_members', formData.team_members.filter((_, i) => i !== index));
  };

  const addResponsibility = (memberIndex, responsibility) => {
    if (!responsibility.trim()) return;
    
    const newMembers = [...(formData.team_members || [])];
    const currentResp = newMembers[memberIndex].responsibilities || [];
    newMembers[memberIndex].responsibilities = [...currentResp, responsibility];
    onChange('team_members', newMembers);
  };

  const removeResponsibility = (memberIndex, respIndex) => {
    const newMembers = [...(formData.team_members || [])];
    newMembers[memberIndex].responsibilities = 
      newMembers[memberIndex].responsibilities.filter((_, i) => i !== respIndex);
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
            { value: '', label: 'Select project lead' },
            { value: userProfile?.id, label: `${userProfile?.full_name} (Me)` },
            ...availableProfiles
              .filter(p => p.id !== userProfile?.id)
              .map(profile => ({
                value: profile.id,
                label: profile.full_name
              }))
          ]}
        />
      </div>

      {/* Team Members */}
      <div>
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
        
        <div className="space-y-3">
          {(formData.team_members || []).map((member, index) => {
            const profile = availableProfiles.find(p => p.id === member.profile_id);
            
            return (
              <div key={index} className={cn(
                "p-4 border rounded-lg",
                "bg-gray-50"
              )}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {profile?.avatar_url && (
                      <img
                        src={profile.avatar_url}
                        alt={profile.full_name}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div className="flex-1">
                      <Select
                        value={member.profile_id || ''}
                        onChange={(value) => updateTeamMember(index, 'profile_id', value)}
                        options={[
                          { value: '', label: 'Select team member' },
                          ...availableProfiles
                            .filter(p => !formData.team_members.some(
                              (m, i) => i !== index && m.profile_id === p.id
                            ))
                            .map(profile => ({
                              value: profile.id,
                              label: profile.full_name
                            }))
                        ]}
                        size="sm"
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => removeTeamMember(index)}
                    className="text-red-500"
                  >
                    <Icon name="X" size={16} />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Input
                    type="text"
                    value={member.role || ''}
                    onChange={(e) => updateTeamMember(index, 'role', e.target.value)}
                    placeholder="Role in project (e.g., Lead Developer)"
                    size="sm"
                  />
                  
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Responsibilities
                    </label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="text"
                        placeholder="Add responsibility..."
                        size="sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addResponsibility(index, e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                    </div>
                    
                    {member.responsibilities?.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {member.responsibilities.map((resp, respIdx) => (
                          <li key={respIdx} className="flex items-center justify-between text-sm">
                            <span>• {resp}</span>
                            <button
                              onClick={() => removeResponsibility(index, respIdx)}
                              className="text-red-500 hover:text-red-600"
                            >
                              ×
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {(!formData.team_members || formData.team_members.length === 0) && (
          <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
            <Icon name="Users" size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">No team members added yet</p>
          </div>
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
            { value: '', label: 'Select testimonial (optional)' },
            ...testimonials.map(test => ({
              value: test.id,
              label: `${test.author_name} - ${test.author_title} at ${test.company}`
            }))
          ]}
        />
        <p className="text-xs text-gray-500 mt-1">
          Link an existing testimonial to this case study
        </p>
      </div>
    </div>
  );
};

export default TeamTab;