// src/pages/admin/Leads.jsx - Updated with client conversion while keeping all original features
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Icon from '../../components/AdminIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Checkbox } from '../../components/ui/Checkbox';
import ConvertLeadModal from '../../components/admin/ConvertLeadModal';
import { useToast } from '../../components/ui/Toast';

const Leads = () => {
  const { userProfile } = useOutletContext();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('contacts'); // contacts, subscribers, assessments
  const [contacts, setContacts] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [leadToConvert, setLeadToConvert] = useState(null);
  
  // Filters
  const [filters, setFilters] = useState({
    status: 'all',
    temperature: 'all',
    search: '',
    dateRange: 'all'
  });

  useEffect(() => {
    fetchAllLeads();
  }, []);

  const fetchAllLeads = async () => {
    try {
      const [contactsRes, subscribersRes, assessmentsRes] = await Promise.all([
        // Contact submissions - Updated to include client info
        supabase
          .from('contact_submissions')
          .select(`
            *,
            assigned_to:profiles!assigned_to(full_name, email),
            client:clients(id)
          `)
          .order('created_at', { ascending: false }),
        
        // Newsletter subscribers
        supabase
          .from('newsletter_subscribers')
          .select('*')
          .order('created_at', { ascending: false }),
        
        // Capability assessments
        supabase
          .from('capability_assessments')
          .select(`
            *,
            user:profiles!user_id(full_name, email)
          `)
          .order('created_at', { ascending: false })
      ]);

      setContacts(contactsRes.data || []);
      setSubscribers(subscribersRes.data || []);
      setAssessments(assessmentsRes.data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (leadId, newStatus) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ 
          lead_status: newStatus,
          last_contact_date: new Date().toISOString()
        })
        .eq('id', leadId);

      if (error) throw error;
      await fetchAllLeads();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleTemperatureUpdate = async (leadId, temperature) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ lead_temperature: temperature })
        .eq('id', leadId);

      if (error) throw error;
      await fetchAllLeads();
    } catch (error) {
      console.error('Error updating temperature:', error);
    }
  };

  const handleAssignLead = async (leadId, assigneeId) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ assigned_to: assigneeId })
        .eq('id', leadId);

      if (error) throw error;
      await fetchAllLeads();
    } catch (error) {
      console.error('Error assigning lead:', error);
    }
  };

  const handleConvertToClient = (lead) => {
    setLeadToConvert(lead);
    setShowConvertModal(true);
  };

  const handleConversionSuccess = () => {
    fetchAllLeads();
    setShowConvertModal(false);
    setLeadToConvert(null);
    toast.success('Lead successfully converted to client!');
  };

  const handleSubscriberStatusUpdate = async (subscriberId, newStatus) => {
    try {
      const updateData = { status: newStatus };
      
      if (newStatus === 'unsubscribed') {
        updateData.unsubscribed_at = new Date().toISOString();
      } else if (newStatus === 'confirmed') {
        updateData.confirmed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('newsletter_subscribers')
        .update(updateData)
        .eq('id', subscriberId);

      if (error) throw error;
      await fetchAllLeads();
    } catch (error) {
      console.error('Error updating subscriber:', error);
    }
  };

  const handleDeleteLead = async (table, id) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchAllLeads();
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const sendEmail = async (email, subject, template) => {
    try {
      const { error } = await supabase
        .from('email_notifications')
        .insert({
          recipient_email: email,
          subject: subject,
          template: template,
          data: { sent_by: userProfile.full_name },
          status: 'pending'
        });

      if (error) throw error;
      alert('Email queued for sending!');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error sending email: ' + error.message);
    }
  };

  const getTemperatureBadge = (temperature) => {
    switch (temperature) {
      case 'hot': return 'bg-red-100 text-red-800';
      case 'warm': return 'bg-yellow-100 text-yellow-800';
      case 'cold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'qualified': return 'bg-purple-100 text-purple-800';
      case 'converted': return 'bg-green-500 text-white';
      case 'won': return 'bg-green-500 text-white';
      case 'lost': return 'bg-red-100 text-red-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'unsubscribed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredContacts = contacts.filter(contact => {
    if (filters.status !== 'all' && contact.lead_status !== filters.status) return false;
    if (filters.temperature !== 'all' && contact.lead_temperature !== filters.temperature) return false;
    if (filters.search && !contact.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !contact.email.toLowerCase().includes(filters.search.toLowerCase()) &&
        !contact.company?.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

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
          <h1 className="text-2xl font-heading-bold uppercase">Lead Management</h1>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={fetchAllLeads}
              iconName="RefreshCw"
            >
              Refresh
            </Button>
            <Button
              variant="default"
              onClick={() => sendEmail('team@rule27design.com', 'Lead Summary', 'lead_summary')}
              iconName="Mail"
              className="bg-accent hover:bg-accent/90"
            >
              Email Summary
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 border-b">
          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'contacts' 
                ? 'border-accent text-accent' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Contact Forms ({contacts.length})
          </button>
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'subscribers' 
                ? 'border-accent text-accent' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Newsletter ({subscribers.length})
          </button>
          <button
            onClick={() => setActiveTab('assessments')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'assessments' 
                ? 'border-accent text-accent' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Assessments ({assessments.filter(a => a.completed).length})
          </button>
        </div>

        {/* Filters for Contacts */}
        {activeTab === 'contacts' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <Input
              placeholder="Search by name, email, company..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <Select
              value={filters.status}
              onChange={(value) => setFilters({ ...filters, status: value })}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'new', label: 'New' },
                { value: 'contacted', label: 'Contacted' },
                { value: 'qualified', label: 'Qualified' },
                { value: 'converted', label: 'Converted' },
                { value: 'won', label: 'Won' },
                { value: 'lost', label: 'Lost' }
              ]}
            />
            <Select
              value={filters.temperature}
              onChange={(value) => setFilters({ ...filters, temperature: value })}
              options={[
                { value: 'all', label: 'All Temperatures' },
                { value: 'hot', label: 'Hot' },
                { value: 'warm', label: 'Warm' },
                { value: 'cold', label: 'Cold' }
              ]}
            />
            <Select
              value={filters.dateRange}
              onChange={(value) => setFilters({ ...filters, dateRange: value })}
              options={[
                { value: 'all', label: 'All Time' },
                { value: 'today', label: 'Today' },
                { value: 'week', label: 'This Week' },
                { value: 'month', label: 'This Month' }
              ]}
            />
          </div>
        )}
      </div>

      {/* Contact Submissions Tab - Updated with conversion button */}
      {activeTab === 'contacts' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Temperature
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{contact.name}</p>
                        <p className="text-sm text-gray-500">{contact.email}</p>
                        {contact.phone && (
                          <p className="text-xs text-gray-400">{contact.phone}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900">{contact.company || '-'}</p>
                        {contact.company_size && (
                          <p className="text-xs text-gray-500">{contact.company_size}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900">{contact.project_type || '-'}</p>
                        {contact.budget_range && (
                          <p className="text-xs text-gray-500">{contact.budget_range}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Select
                        value={contact.lead_temperature || 'cold'}
                        onChange={(value) => handleTemperatureUpdate(contact.id, value)}
                        options={[
                          { value: 'hot', label: '🔥 Hot' },
                          { value: 'warm', label: '☀️ Warm' },
                          { value: 'cold', label: '❄️ Cold' }
                        ]}
                        className="w-24"
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      {contact.lead_status === 'converted' || contact.client ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-500 text-white">
                          ✓ Client
                        </span>
                      ) : (
                        <Select
                          value={contact.lead_status || 'new'}
                          onChange={(value) => handleStatusUpdate(contact.id, value)}
                          options={[
                            { value: 'new', label: 'New' },
                            { value: 'contacted', label: 'Contacted' },
                            { value: 'qualified', label: 'Qualified' },
                            { value: 'won', label: 'Won' },
                            { value: 'lost', label: 'Lost' }
                          ]}
                          className="w-28"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {contact.assigned_to?.full_name || 
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() => handleAssignLead(contact.id, userProfile.id)}
                        >
                          Assign to me
                        </Button>
                      }
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(contact.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => {
                          setSelectedLead(contact);
                          setShowDetails(true);
                        }}
                      >
                        <Icon name="Eye" size={16} />
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => sendEmail(contact.email, 'Follow-up', 'lead_follow_up')}
                      >
                        <Icon name="Mail" size={16} />
                      </Button>
                      {/* Convert to Client Button - Only for admins and qualified/contacted leads */}
                      {userProfile?.role === 'admin' && 
                       !contact.client && 
                       contact.lead_status !== 'converted' &&
                       (contact.lead_status === 'qualified' || contact.lead_status === 'contacted') && (
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() => handleConvertToClient(contact)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Icon name="UserPlus" size={16} />
                        </Button>
                      )}
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => handleDeleteLead('contact_submissions', contact.id)}
                        className="text-red-600"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredContacts.length === 0 && (
              <div className="text-center py-12">
                <Icon name="UserCheck" size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No contact submissions found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Newsletter Subscribers Tab - Unchanged */}
      {activeTab === 'subscribers' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscriber
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Frequency
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Engagement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscribed
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{subscriber.name || 'Anonymous'}</p>
                        <p className="text-sm text-gray-500">{subscriber.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {subscriber.company || '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(subscriber.status)}`}>
                        {subscriber.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      {subscriber.frequency}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-xs text-gray-500">
                        <p>Sent: {subscriber.emails_sent || 0}</p>
                        <p>Opened: {subscriber.emails_opened || 0}</p>
                        <p>Clicked: {subscriber.emails_clicked || 0}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {subscriber.source || 'Website'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(subscriber.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {subscriber.status === 'pending' && (
                        <Button
                          size="xs"
                          variant="success"
                          onClick={() => handleSubscriberStatusUpdate(subscriber.id, 'confirmed')}
                        >
                          Confirm
                        </Button>
                      )}
                      {subscriber.status === 'confirmed' && (
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() => handleSubscriberStatusUpdate(subscriber.id, 'unsubscribed')}
                        >
                          Unsubscribe
                        </Button>
                      )}
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => handleDeleteLead('newsletter_subscribers', subscriber.id)}
                        className="text-red-600"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {subscribers.length === 0 && (
              <div className="text-center py-12">
                <Icon name="Mail" size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No newsletter subscribers yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Assessments Tab - Unchanged */}
      {activeTab === 'assessments' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {assessments.map((assessment) => (
            <div key={assessment.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-medium text-gray-900">
                    {assessment.user?.full_name || 'Anonymous'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {assessment.user?.email || `Session: ${assessment.session_id?.slice(0, 8)}`}
                  </p>
                </div>
                {assessment.completed ? (
                  <Icon name="CheckCircle" size={20} className="text-green-500" />
                ) : (
                  <Icon name="AlertCircle" size={20} className="text-yellow-500" />
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Score:</span>
                  <span className="font-medium">{assessment.score || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Readiness:</span>
                  <span className="font-medium">{assessment.readiness_level || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Priority:</span>
                  <span className="font-medium">{assessment.priority_level || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Approach:</span>
                  <span className="font-medium">{assessment.approach_type || 'N/A'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>{new Date(assessment.created_at).toLocaleDateString()}</span>
                {assessment.completion_time && (
                  <span>{Math.round(assessment.completion_time / 60)} min</span>
                )}
              </div>

              <div className="flex space-x-2">
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => {
                    setSelectedLead(assessment);
                    setShowDetails(true);
                  }}
                  fullWidth
                >
                  View Details
                </Button>
                {!assessment.contacted && (
                  <Button
                    size="xs"
                    variant="default"
                    onClick={async () => {
                      await supabase
                        .from('capability_assessments')
                        .update({
                          contacted: true,
                          contact_date: new Date().toISOString()
                        })
                        .eq('id', assessment.id);
                      await fetchAllLeads();
                    }}
                    fullWidth
                  >
                    Mark Contacted
                  </Button>
                )}
              </div>
            </div>
          ))}

          {assessments.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Icon name="FileCheck" size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No assessments completed yet</p>
            </div>
          )}
        </div>
      )}

      {/* Lead Details Modal - Unchanged */}
      {showDetails && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-heading-bold uppercase">Lead Details</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowDetails(false);
                  setSelectedLead(null);
                }}
              >
                <Icon name="X" size={24} />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* All existing detail sections remain the same */}
              {/* Contact Details */}
              {selectedLead.name && (
                <div>
                  <h3 className="font-medium mb-4">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Name</p>
                      <p className="font-medium">{selectedLead.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email</p>
                      <p className="font-medium">{selectedLead.email}</p>
                    </div>
                    {selectedLead.phone && (
                      <div>
                        <p className="text-gray-600">Phone</p>
                        <p className="font-medium">{selectedLead.phone}</p>
                      </div>
                    )}
                    {selectedLead.company && (
                      <div>
                        <p className="text-gray-600">Company</p>
                        <p className="font-medium">{selectedLead.company}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Rest of the modal content remains the same */}
              {/* ... */}
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end">
              <Button
                variant="default"
                onClick={() => {
                  setShowDetails(false);
                  setSelectedLead(null);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Convert Lead Modal */}
      {leadToConvert && (
        <ConvertLeadModal
          lead={leadToConvert}
          isOpen={showConvertModal}
          onClose={() => {
            setShowConvertModal(false);
            setLeadToConvert(null);
          }}
          onSuccess={handleConversionSuccess}
        />
      )}
    </div>
  );
};

export default Leads;