// src/pages/admin/AdminLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Icon from '../../components/AdminIcon';
import Button from '../../components/ui/Button';

const AdminLayout = ({ userProfile, setUserProfile }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sessionWarning, setSessionWarning] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', path: '/admin', icon: 'LayoutDashboard' },
    { name: 'Services', path: '/admin/services', icon: 'Zap' },
    { name: 'Articles', path: '/admin/articles', icon: 'FileText' },
    { name: 'Case Studies', path: '/admin/case-studies', icon: 'Briefcase' },
    { name: 'Profiles', path: '/admin/profiles', icon: 'Users', adminOnly: true },
    { name: 'Leads', path: '/admin/leads', icon: 'UserCheck' },
    { name: 'Analytics', path: '/admin/analytics', icon: 'TrendingUp' },
    { name: 'Settings', path: '/admin/settings', icon: 'Settings', adminOnly: true },
  ];

  const filteredNavigation = navigation.filter(item => {
    if (item.adminOnly && userProfile?.role !== 'admin') {
      return false;
    }
    return true;
  });

  // Load notification count
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const { count } = await supabase
        .from('contact_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('lead_status', 'new');
      
      setNotificationCount(count || 0);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  // Session management
  useEffect(() => {
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);
        
        if (event === 'SIGNED_OUT') {
          console.log('User signed out, redirecting to login');
          navigate('/admin/login');
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Session refreshed successfully');
          setSessionWarning(false);
        } else if (event === 'USER_UPDATED') {
          if (session?.user?.id) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('auth_user_id', session.user.id)
              .single();
            
            if (profile && setUserProfile) {
              setUserProfile(profile);
              console.log('Profile reloaded after user update');
            }
          }
        }
      }
    );
    
    const sessionInterval = setInterval(() => {
      checkSession();
    }, 5 * 60 * 1000);
    
    return () => {
      subscription.unsubscribe();
      clearInterval(sessionInterval);
    };
  }, [navigate, setUserProfile]);

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session check error:', error);
        navigate('/admin/login');
        return;
      }
      
      if (!session) {
        console.log('No active session, redirecting to login');
        navigate('/admin/login');
        return;
      }
      
      const expiresAt = new Date(session.expires_at * 1000);
      const now = new Date();
      const timeUntilExpiry = expiresAt - now;
      
      if (timeUntilExpiry < 10 * 60 * 1000 && timeUntilExpiry > 0) {
        setSessionWarning(true);
        
        if (timeUntilExpiry < 5 * 60 * 1000) {
          console.log('Session expiring soon, attempting refresh...');
          const { data, error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError) {
            console.error('Failed to refresh session:', refreshError);
            setSessionWarning(true);
          } else {
            console.log('Session refreshed successfully');
            setSessionWarning(false);
          }
        }
      } else {
        setSessionWarning(false);
      }
    } catch (error) {
      console.error('Session check failed:', error);
      navigate('/admin/login');
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      }
      navigate('/admin/login');
    } catch (error) {
      console.error('Sign out failed:', error);
      navigate('/admin/login');
    }
  };

  const isActivePath = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const handleRefreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      setSessionWarning(false);
      console.log('Session manually refreshed');
    } catch (error) {
      console.error('Manual refresh failed:', error);
      navigate('/admin/login');
    }
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Handle window resize for responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Session Warning Banner */}
      {sessionWarning && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-white px-4 py-2">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-2">
              <Icon name="AlertTriangle" size={20} />
              <span className="text-sm font-medium">
                Your session is about to expire. Please save your work.
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="xs"
                variant="ghost"
                onClick={handleRefreshSession}
                className="text-white hover:bg-yellow-600"
              >
                Refresh Session
              </Button>
              <button
                onClick={() => setSessionWarning(false)}
                className="text-white hover:text-yellow-100"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-white shadow-md hover:shadow-lg"
        >
          <Icon name={mobileMenuOpen ? 'X' : 'Menu'} size={24} />
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b">
            <Link to="/admin" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <Icon name="Zap" size={20} className="text-white" />
              </div>
              <div>
                <div className="font-heading-bold text-xl">RULE27</div>
                <div className="text-xs text-gray-600 uppercase tracking-wider">Admin Panel</div>
              </div>
            </Link>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                {userProfile?.avatar_url ? (
                  <img 
                    src={userProfile.avatar_url} 
                    alt={userProfile.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Icon name="User" size={20} className="text-gray-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userProfile?.full_name || 'User'}
                </p>
                <p className="text-xs text-gray-500 uppercase">
                  {userProfile?.role || 'contributor'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {filteredNavigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200
                  ${isActivePath(item.path)
                    ? 'bg-accent text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <Icon name={item.icon} size={20} />
                <span className="font-medium">{item.name}</span>
                {item.adminOnly && (
                  <span className="ml-auto text-xs opacity-60">Admin</span>
                )}
              </Link>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="border-t p-4 space-y-2">
            <Link
              to="/"
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Icon name="Home" size={20} />
              <span>View Site</span>
            </Link>
            <Link
              to="/admin/profile"
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Icon name="User" size={20} />
              <span>My Profile</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Icon name="LogOut" size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`
        transition-all duration-300
        ${sidebarOpen && window.innerWidth >= 1024 ? 'lg:ml-64' : 'lg:ml-0'}
        ${sessionWarning ? 'pt-10' : ''}
      `}>
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:block text-gray-600 hover:text-gray-900"
              >
                <Icon name={sidebarOpen ? 'PanelLeftClose' : 'PanelLeftOpen'} size={24} />
              </button>
              <h1 className="text-lg lg:text-xl font-heading-bold uppercase ml-14 lg:ml-0">
                {filteredNavigation.find(item => isActivePath(item.path))?.name || 'Admin'}
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              {/* Session Status Indicator */}
              <div className="hidden sm:flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${sessionWarning ? 'bg-yellow-500' : 'bg-green-500'}`} />
                <span className="text-xs text-gray-500">
                  {sessionWarning ? 'Session Expiring' : 'Connected'}
                </span>
              </div>
              
              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/admin/leads')}
                className="relative"
              >
                <Icon name="Bell" size={20} />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          <Outlet context={{ userProfile, checkSession }} />
        </main>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;