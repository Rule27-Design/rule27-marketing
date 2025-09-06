// src/pages/NoAccess.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/AppIcon';
import Button from '../components/ui/Button';

const NoAccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md">
        <Icon name="Lock" size={64} className="mx-auto text-gray-400 mb-6" />
        <h1 className="text-2xl font-heading-bold uppercase mb-4">Access Restricted</h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access the admin panel. 
          If you believe this is an error, please contact your administrator.
        </p>
        <div className="space-y-3">
          <Link to="/">
            <Button variant="default" fullWidth className="bg-accent hover:bg-accent/90">
              Return to Homepage
            </Button>
          </Link>
          <Link to="/admin/login">
            <Button variant="outline" fullWidth>
              Try Different Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NoAccess;