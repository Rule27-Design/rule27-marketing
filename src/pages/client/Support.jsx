// src/pages/client/Support.jsx
import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const ClientSupport = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  return (
    <div>
      <h1 className="text-2xl font-heading-bold uppercase mb-8">Support</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-heading-bold uppercase mb-4">New Support Ticket</h2>
          <form className="space-y-4">
            <Input
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of your issue"
            />
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full h-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
                placeholder="Describe your issue in detail..."
              />
            </div>
            <Button variant="default" className="bg-accent hover:bg-accent/90">
              Submit Ticket
            </Button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-heading-bold uppercase mb-4">Recent Tickets</h2>
          <div className="space-y-3">
            <p className="text-gray-600">No tickets submitted yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientSupport; // Added default export