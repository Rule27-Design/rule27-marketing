// src/pages/admin/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AdminIcon';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if we have a valid session from the reset link
    checkSession();
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      // No valid reset session, redirect to login
      navigate('/admin/login');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      // Password updated successfully, redirect to dashboard
      navigate('/admin');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-accent flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
            <span className="text-3xl font-bold text-accent">27</span>
          </div>
          <h1 className="text-3xl font-heading-bold text-white uppercase">Set New Password</h1>
          <p className="text-gray-400 mt-2">Choose a strong password for your account</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleResetPassword} className="space-y-6">
            <Input
              type="password"
              label="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="At least 6 characters"
              className="w-full"
            />

            <Input
              type="password"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Re-enter your password"
              className="w-full"
            />

            {error && (
              <div className="p-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="default"
              fullWidth
              loading={loading}
              disabled={loading || !password || !confirmPassword}
              className="bg-accent hover:bg-accent/90"
              iconName="Lock"
            >
              Update Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;