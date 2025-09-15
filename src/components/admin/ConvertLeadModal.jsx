// src/components/admin/ConvertLeadModal.jsx
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import { useToast } from '../ui/Toast';

const ConvertLeadModal = ({ lead, isOpen, onClose, onSuccess }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: lead?.company || '',
    company_website: lead?.website || '',
    industry: '',
    client_type: 'standard',
    billing_cycle: 'monthly',
    send_invitation: true,
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      const { data: converter } = await supabase
        .from('profiles')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      // Create or find profile for the lead
      let profileId;
      
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', lead.email)
        .single();

      if (existingProfile) {
        profileId = existingProfile.id;
        
        // Update profile with client info
        await supabase
          .from('profiles')
          .update({
            company_name: formData.company_name,
            company_website: formData.company_website,
            industry: formData.industry,
            client_status: 'active',
            client_since: new Date().toISOString()
          })
          .eq('id', profileId);
      } else {
        // Create new profile
        const { data: newProfile, error: profileError } = await supabase
          .from('profiles')
          .insert({
            email: lead.email,
            full_name: lead.name,
            company_name: formData.company_name,
            company_website: formData.company_website,
            industry: formData.industry,
            role: 'standard',
            client_status: 'active',
            client_since: new Date().toISOString(),
            is_active: true,
            is_public: false,
            onboarding_completed: false
          })
          .select()
          .single();

        if (profileError) throw profileError;
        profileId = newProfile.id;
      }

      // Create client record
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .insert({
          profile_id: profileId,
          client_type: formData.client_type,
          account_status: 'active',
          billing_cycle: formData.billing_cycle,
          notes: formData.notes
        })
        .select()
        .single();

      if (clientError) throw clientError;

      // Create lead conversion record
      await supabase
        .from('lead_conversions')
        .insert({
          lead_id: lead.id,
          client_id: client.id,
          profile_id: profileId,
          converted_by: converter.id,
          conversion_notes: formData.notes
        });

      // Update original lead
      await supabase
        .from('contact_submissions')
        .update({
          converted_to_client_at: new Date().toISOString(),
          converted_by: converter.id,
          client_id: client.id,
          lead_status: 'converted'
        })
        .eq('id', lead.id);

      // Send invitation email if requested
      if (formData.send_invitation) {
        const token = crypto.randomUUID();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await supabase
          .from('client_invitations')
          .insert({
            email: lead.email,
            invited_by: converter.id,
            profile_id: profileId,
            client_id: client.id,
            token,
            expires_at: expiresAt,
            metadata: {
              full_name: lead.name,
              company_name: formData.company_name,
              converted_from_lead: true
            }
          });

        // Copy invite link
        const inviteUrl = `${window.location.origin}/accept-invite?token=${token}`;
        navigator.clipboard.writeText(inviteUrl);
        toast.info('Invite link copied to clipboard');
      }

      toast.success('Lead successfully converted to client!');
      onSuccess?.(client);
      onClose();
    } catch (error) {
      console.error('Conversion error:', error);
      toast.error('Failed to convert lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Convert Lead to Client">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-medium mb-2">Lead Information</h3>
          <p className="text-sm text-gray-600">Name: {lead?.name}</p>
          <p className="text-sm text-gray-600">Email: {lead?.email}</p>
          <p className="text-sm text-gray-600">Company: {lead?.company}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          
          <div>
            <label className="block text-sm font-medium mb-2">Industry</label>
            <select
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
              required
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
          
          <div>
            <label className="block text-sm font-medium mb-2">Client Type</label>
            <select
              value={formData.client_type}
              onChange={(e) => setFormData({ ...formData, client_type: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
            >
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Billing Cycle</label>
            <select
              value={formData.billing_cycle}
              onChange={(e) => setFormData({ ...formData, billing_cycle: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annually">Annually</option>
              <option value="project">Per Project</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full h-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
            placeholder="Add any relevant notes about this conversion..."
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="send_invitation"
            checked={formData.send_invitation}
            onChange={(e) => setFormData({ ...formData, send_invitation: e.target.checked })}
            className="mr-2"
          />
          <label htmlFor="send_invitation" className="text-sm">
            Send client portal invitation email
          </label>
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
            loading={loading}
            disabled={loading}
            className="bg-accent hover:bg-accent/90"
          >
            Convert to Client
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ConvertLeadModal;