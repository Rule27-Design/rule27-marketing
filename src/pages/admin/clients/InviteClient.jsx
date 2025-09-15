// src/pages/admin/clients/InviteClient.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { useToast } from '../../../components/ui/Toast';

const InviteClient = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    company_name: '',
    company_website: '',
    industry: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate invitation token
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

      // Get current user (inviter)
      const { data: { user } } = await supabase.auth.getUser();
      const { data: inviter } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('auth_user_id', user.id)
        .single();

      // Create invitation record
      const { data: invitation, error: inviteError } = await supabase
        .from('client_invitations')
        .insert({
          email: formData.email,
          invited_by: inviter.id,
          token,
          expires_at: expiresAt,
          metadata: {
            full_name: formData.full_name,
            company_name: formData.company_name,
            company_website: formData.company_website,
            industry: formData.industry,
            message: formData.message
          }
        })
        .select()
        .single();

      if (inviteError) throw inviteError;

      // Send invitation email
      const inviteUrl = `${window.location.origin}/accept-invite?token=${token}`;
      
      // You'll need to set up email sending via Supabase Edge Functions or a service
      // For now, we'll just copy the link
      
      toast.success('Client invitation created successfully!');
      
      // Copy invite link to clipboard
      navigator.clipboard.writeText(inviteUrl);
      toast.info('Invite link copied to clipboard');
      
      navigate('/admin/clients/invitations');
    } catch (error) {
      console.error('Invite error:', error);
      toast.error('Failed to create invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-heading-bold uppercase">Invite Client</h1>
        <p className="text-gray-600 mt-1">Send an invitation to a new client</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            
            <Input
              label="Full Name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
            />
            
            <Input
              label="Company Name"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              required
            />
            
            <Input
              label="Company Website"
              type="url"
              value={formData.company_website}
              onChange={(e) => setFormData({ ...formData, company_website: e.target.value })}
              placeholder="https://example.com"
            />
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Industry</label>
              <select
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
              >
                <option value="">Select Industry</option>
                <option value="technology">Technology</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance</option>
                <option value="retail">Retail</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Personal Message (Optional)
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full h-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
                placeholder="Add a personal welcome message..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => navigate('/admin/clients')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              loading={loading}
              disabled={loading}
              className="bg-accent hover:bg-accent/90"
            >
              Send Invitation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteClient;