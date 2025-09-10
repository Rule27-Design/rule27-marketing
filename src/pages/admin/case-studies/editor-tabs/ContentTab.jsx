// src/pages/admin/case-studies/editor-tabs/ContentTab.jsx
import React from 'react';
import TiptapContentEditor from '../../../../components/ui/TiptapContentEditor';
import { cn } from '../../../../utils';

const ContentTab = ({ formData, errors, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Challenge */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          The Challenge *
        </label>
        <TiptapContentEditor
          content={formData.challenge}
          onChange={(content) => onChange('challenge', content)}
          placeholder="Describe the challenges the client was facing..."
          error={errors.challenge}
          minHeight="200px"
        />
      </div>

      {/* Solution */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Our Solution *
        </label>
        <TiptapContentEditor
          content={formData.solution}
          onChange={(content) => onChange('solution', content)}
          placeholder="Explain how you addressed the challenges..."
          error={errors.solution}
          minHeight="200px"
        />
      </div>

      {/* Implementation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Implementation Process
        </label>
        <TiptapContentEditor
          content={formData.implementation}
          onChange={(content) => onChange('implementation', content)}
          placeholder="Detail the implementation process, methodologies, and approach..."
          minHeight="250px"
        />
      </div>

      {/* Technologies Used */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Technologies Used
        </label>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Add technologies (press Enter)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const value = e.target.value.trim();
                if (value) {
                  const current = formData.technologies_used || [];
                  onChange('technologies_used', [...current, value]);
                  e.target.value = '';
                }
              }
            }}
          />
          
          {formData.technologies_used?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.technologies_used.map((tech, idx) => (
                <span
                  key={idx}
                  className={cn(
                    "inline-flex items-center px-3 py-1 rounded-full text-sm",
                    "bg-blue-100 text-blue-700"
                  )}
                >
                  {tech}
                  <button
                    onClick={() => {
                      onChange('technologies_used',
                        formData.technologies_used.filter((_, i) => i !== idx)
                      );
                    }}
                    className="ml-2 hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Deliverables */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Key Deliverables
        </label>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Add deliverable (press Enter)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const value = e.target.value.trim();
                if (value) {
                  const current = formData.deliverables || [];
                  onChange('deliverables', [...current, value]);
                  e.target.value = '';
                }
              }
            }}
          />
          
          {formData.deliverables?.length > 0 && (
            <ul className="space-y-1">
              {formData.deliverables.map((deliverable, idx) => (
                <li key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{deliverable}</span>
                  <button
                    onClick={() => {
                      onChange('deliverables',
                        formData.deliverables.filter((_, i) => i !== idx)
                      );
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentTab;