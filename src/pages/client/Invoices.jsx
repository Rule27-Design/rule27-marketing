// src/pages/client/Invoices.jsx
import React from 'react';
import Button from '../../components/ui/Button';

const ClientInvoices = () => {
  const invoices = [
    { id: 'INV-001', date: '2024-01-15', amount: '$5,000', status: 'Paid' },
    { id: 'INV-002', date: '2024-02-15', amount: '$7,450', status: 'Pending' },
    { id: 'INV-003', date: '2024-03-15', amount: '$5,000', status: 'Pending' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-heading-bold uppercase mb-8">Invoices</h1>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Invoice #</th>
                <th className="text-left py-3">Date</th>
                <th className="text-left py-3">Amount</th>
                <th className="text-left py-3">Status</th>
                <th className="text-left py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b">
                  <td className="py-4">{invoice.id}</td>
                  <td className="py-4">{invoice.date}</td>
                  <td className="py-4 font-medium">{invoice.amount}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientInvoices; // Added default export