// src/pages/admin/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  // Check if already logged in
  React.useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setSession(session);
      checkAuthorization(session);
    }
  };

  const checkAuthorization = async (session) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('auth_user_id', session.user.id)
      .single();

    if (profile && (profile.role === 'admin' || profile.role === 'contributor')) {
      navigate('/admin');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if user has admin or contributor role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('auth_user_id', data.user.id)
        .single();

      if (!profile || (profile.role !== 'admin' && profile.role !== 'contributor')) {
        await supabase.auth.signOut();
        throw new Error('You do not have permission to access the admin panel.');
      }

      navigate('/admin');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
        },
      });

      if (error) throw error;

      setError('Check your email for the login link!');
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
          <form onSubmit={handleLogin} className="space-y-6">
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
            </div>

            {error && (
              <div className={`p-3 rounded-lg text-sm ${
                error.includes('Check your email') 
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {error}
              </div>
            )}

            <div className="space-y-3">
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

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={handleMagicLink}
                loading={loading}
                disabled={loading || !email}
                iconName="Mail"
              >
                Send Magic Link
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <a 
              href="/" 
              className="text-sm text-gray-600 hover:text-accent transition-colors"
            >
              ← Back to website
            </a>
          </div>
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