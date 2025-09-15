// src/pages/client/Dashboard.jsx
import React from 'react';
import Icon from '../../components/AppIcon';

const ClientDashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-heading-bold uppercase mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <Icon name="Briefcase" size={24} className="text-accent" />
            <span className="text-2xl font-heading-bold">3</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Active Projects</h3>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <Icon name="FileText" size={24} className="text-green-500" />
            <span className="text-2xl font-heading-bold">$12,450</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Outstanding Balance</h3>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <Icon name="MessageCircle" size={24} className="text-blue-500" />
            <span className="text-2xl font-heading-bold">2</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Open Tickets</h3>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-heading-bold uppercase mb-4">Recent Activity</h2>
        <div className="text-gray-600">
          <p>No recent activity to display.</p>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard; // Added default export