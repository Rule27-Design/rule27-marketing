import { useState } from 'react';
import { supabase } from '../lib/supabase';

export const useContactSubmissions = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submitContactForm = async (formData) => {
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Combine the form data into the format expected by the database
      const submission = {
        // Combine first and last name
        name: `${formData.contactInfo.firstName} ${formData.contactInfo.lastName}`.trim(),
        email: formData.contactInfo.email,
        phone: formData.contactInfo.phone,
        company: formData.contactInfo.company,
        
        // Map project details
        project_type: formData.projectDetails.projectType,
        budget_range: formData.projectDetails.budget,
        timeline: formData.projectDetails.timeline,
        website: formData.projectDetails.currentWebsite || null,
        
        // Map services array
        services_needed: formData.preferences.services || [],
        
        // Combine challenges and additional info into message
        message: [
          formData.projectDetails.challenges && `Challenges: ${formData.projectDetails.challenges}`,
          formData.preferences.additionalInfo && `Additional Info: ${formData.preferences.additionalInfo}`
        ].filter(Boolean).join('\n\n'),
        
        // Add source tracking
        source_page: 'contact-consultation-portal',
        referrer: formData.preferences.referralSource || null,
        
        // Parse UTM parameters from URL if present
        utm_source: new URLSearchParams(window.location.search).get('utm_source') || null,
        utm_medium: new URLSearchParams(window.location.search).get('utm_medium') || null,
        utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign') || null,
        utm_term: new URLSearchParams(window.location.search).get('utm_term') || null,
        utm_content: new URLSearchParams(window.location.search).get('utm_content') || null,
        
        // Set initial lead status
        lead_status: 'new',
        lead_temperature: determineLeadTemperature(formData),
        
        // Add role as company size if it maps
        company_size: mapRoleToCompanySize(formData.contactInfo.role),
        
        // Newsletter preference in notes
        notes: formData.agreement.newsletterOptIn 
          ? 'Newsletter opt-in: Yes\nCommunication preference: ' + formData.preferences.communicationPreference
          : 'Newsletter opt-in: No\nCommunication preference: ' + formData.preferences.communicationPreference,
      };

      // Insert into Supabase
      const { data, error: submitError } = await supabase
        .from('contact_submissions')
        .insert([submission])
        .select()
        .single();

      if (submitError) throw submitError;

      // Track the submission event (optional analytics)
      if (window.gtag) {
        window.gtag('event', 'form_submit', {
          event_category: 'Contact',
          event_label: 'Consultation Form',
          value: mapBudgetToValue(formData.projectDetails.budget)
        });
      }

      setSuccess(true);
      return { success: true, data };

    } catch (err) {
      console.error('Error submitting contact form:', err);
      setError(err.message || 'Failed to submit form. Please try again.');
      return { success: false, error: err.message };
    } finally {
      setSubmitting(false);
    }
  };

  // Helper function to determine lead temperature based on form data
  const determineLeadTemperature = (formData) => {
    const { projectDetails, preferences } = formData;
    
    // Hot leads: urgent timeline, high budget, multiple services
    if (
      (projectDetails.timeline === 'asap' || projectDetails.timeline === '1-month') &&
      (projectDetails.budget === '100k-250k' || projectDetails.budget === 'over-250k') &&
      preferences.services.length >= 3
    ) {
      return 'hot';
    }
    
    // Warm leads: reasonable timeline and budget
    if (
      (projectDetails.budget === '50k-100k' || projectDetails.budget === '100k-250k') &&
      preferences.services.length >= 2
    ) {
      return 'warm';
    }
    
    // Default to cold
    return 'cold';
  };

  // Map role to company size
  const mapRoleToCompanySize = (role) => {
    const roleToSize = {
      'founder': '1-10 employees',
      'cmo': '51-200 employees',
      'cto': '51-200 employees',
      'designer': '11-50 employees',
      'manager': '51-200 employees',
      'other': null
    };
    
    return roleToSize[role] || null;
  };

  // Map budget to numeric value for analytics
  const mapBudgetToValue = (budget) => {
    const budgetValues = {
      'under-25k': 15000,
      '25k-50k': 37500,
      '50k-100k': 75000,
      '100k-250k': 175000,
      'over-250k': 300000,
      'not-sure': 0
    };
    
    return budgetValues[budget] || 0;
  };

  return {
    submitContactForm,
    submitting,
    error,
    success
  };
};

// Hook to fetch contact submissions (for admin use later)
export const useContactSubmissionsList = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubmissions = async (filters = {}) => {
    try {
      let query = supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters if provided
      if (filters.status) {
        query = query.eq('lead_status', filters.status);
      }
      if (filters.temperature) {
        query = query.eq('lead_temperature', filters.temperature);
      }
      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setSubmissions(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError(err.message);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    submissions,
    loading,
    error,
    fetchSubmissions
  };
};