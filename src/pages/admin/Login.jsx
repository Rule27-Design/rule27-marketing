// src/pages/admin/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AdminIcon';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [authMethod, setAuthMethod] = useState('password'); // 'password' or 'magic'
  const navigate = useNavigate();

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      checkAuthorization(session);
    }
  };

  const checkAuthorization = async (session) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, onboarding_completed')
      .eq('auth_user_id', session.user.id)
      .single();

    if (profile) {
      // Check if onboarding is needed
      if (!profile.onboarding_completed) {
        navigate('/admin/setup-profile');
      } else if (profile.role === 'admin' || profile.role === 'contributor') {
        navigate('/admin');
      }
    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, onboarding_completed')
        .eq('auth_user_id', data.user.id)
        .single();

      if (!profile || (profile.role !== 'admin' && profile.role !== 'contributor')) {
        await supabase.auth.signOut();
        throw new Error('You do not have permission to access the admin panel.');
      }

      // Check if onboarding is needed
      if (!profile.onboarding_completed) {
        navigate('/admin/setup-profile');
      } else {
        navigate('/admin');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      setSuccess('Check your email for the login link!');
      setEmail('');
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
          <h1 className="text-3xl font-heading-bold text-white uppercase">Rule27 Admin</h1>
          <p className="text-gray-400 mt-2">Sign in to manage your content</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Auth Method Tabs */}
          <div className="flex space-x-2 mb-6">
            <button
              type="button"
              onClick={() => setAuthMethod('password')}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                authMethod === 'password'
                  ? 'bg-accent text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('magic')}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                authMethod === 'magic'
                  ? 'bg-accent text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Magic Link
            </button>
          </div>

          {authMethod === 'password' ? (
            <form onSubmit={handlePasswordLogin} className="space-y-6">
              <div>
                <Input
                  type="email"
                  label="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@rule27design.com"
                  className="w-full"
                />
              </div>

              <div>
                <Input
                  type="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full"
                />
                <div className="mt-2 text-right">
                  <Link 
                    to="/admin/forgot-password" 
                    className="text-sm text-accent hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

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
                disabled={loading || !email || !password}
                className="bg-accent hover:bg-accent/90"
              >
                Sign In
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <Input
                  type="email"
                  label="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@rule27design.com"
                  className="w-full"
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 rounded-lg text-sm bg-green-50 text-green-700 border border-green-200">
                  {success}
                </div>
              )}

              <Button
                type="button"
                variant="default"
                fullWidth
                onClick={handleMagicLink}
                loading={loading}
                disabled={loading || !email}
                className="bg-accent hover:bg-accent/90"
                iconName="Mail"
              >
                Send Magic Link
              </Button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>Access restricted to authorized personnel only.</p>
          <p className="mt-1">Contact IT support if you need assistance.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;