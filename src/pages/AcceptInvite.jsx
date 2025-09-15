// src/pages/AcceptInvite.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';

const AcceptInvite = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      validateInvitation();
    }
  }, [token]);

  const validateInvitation = async () => {
    try {
      const { data, error } = await supabase
        .from('client_invitations')
        .select('*')
        .eq('token', token)
        .single();

      if (error || !data) {
        setError('Invalid or expired invitation');
        return;
      }

      if (new Date(data.expires_at) < new Date()) {
        setError('This invitation has expired');
        return;
      }

      if (data.status !== 'pending') {
        setError('This invitation has already been used');
        return;
      }

      setInvitation(data);
    } catch (err) {
      setError('Failed to validate invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    navigate(`/login?mode=signup&email=${invitation.email}&invitation=${token}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Invalid Invitation</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4">You're Invited!</h2>
        <p className="text-gray-600 mb-6">
          You've been invited to join {invitation.metadata?.company_name || 'Rule27 Design'} 
          as a client.
        </p>
        <div className="bg-gray-50 rounded p-4 mb-6">
          <p className="text-sm text-gray-600">Email: {invitation.email}</p>
          {invitation.metadata?.full_name && (
            <p className="text-sm text-gray-600">Name: {invitation.metadata.full_name}</p>
          )}
        </div>
        <Button 
          onClick={handleAccept}
          fullWidth
          className="bg-accent hover:bg-accent/90"
        >
          Accept Invitation
        </Button>
      </div>
    </div>
  );
};

export default AcceptInvite;