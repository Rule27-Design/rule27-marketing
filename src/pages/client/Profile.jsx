// src/pages/client/Profile.jsx
import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const ClientProfile = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    company: '',
    phone: '',
  });

  return (
    <div>
      <h1 className="text-2xl font-heading-bold uppercase mb-8">My Profile</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <form className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          
          <div className="flex space-x-3">
            <Button variant="default" className="bg-accent hover:bg-accent/90">
              Save Changes
            </Button>
            <Button variant="outline">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientProfile;