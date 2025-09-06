// src/pages/admin/AdminLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const AdminLayout = ({ userProfile }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const isActivePath = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-white shadow-md"
        >
          <Icon name={mobileMenuOpen ? 'X' : 'Menu'} size={24} />
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b">
            <Link to="/admin" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <span className="text-white font-bold">27</span>
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
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                {userProfile?.avatar_url ? (
                  <img 
                    src={userProfile.avatar_url} 
                    alt={userProfile.full_name}
                    className="w-full h-full rounded-full object-cover"
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
        ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}
      `}>
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:block text-gray-600 hover:text-gray-900"
              >
                <Icon name={sidebarOpen ? 'PanelLeftClose' : 'PanelLeftOpen'} size={24} />
              </button>
              <h1 className="text-xl font-heading-bold uppercase">
                {filteredNavigation.find(item => isActivePath(item.path))?.name || 'Admin'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Quick Actions */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin/articles?action=new')}
                iconName="Plus"
              >
                New Article
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin/leads')}
                className="relative"
              >
                <Icon name="Bell" size={20} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"></span>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet context={{ userProfile }} />
        </main>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;