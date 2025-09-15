// src/pages/client/Projects.jsx
import React from 'react';
import Icon from '../../components/AppIcon';

const ClientProjects = () => {
  const projects = [
    { id: 1, name: 'Website Redesign', status: 'In Progress', progress: 65 },
    { id: 2, name: 'Brand Identity', status: 'Completed', progress: 100 },
    { id: 3, name: 'Marketing Campaign', status: 'Planning', progress: 15 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-heading-bold uppercase mb-8">Projects</h1>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Project Name</th>
                <th className="text-left py-3">Status</th>
                <th className="text-left py-3">Progress</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b">
                  <td className="py-4">{project.name}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-accent h-2 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
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

export default ClientProjects; // Added default export