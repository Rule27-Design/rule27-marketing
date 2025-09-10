// src/pages/admin/case-studies/editor-tabs/ContentTab.jsx
import React from 'react';
import TiptapContentEditor from '../../../../components/ui/TiptapContentEditor';

const ContentTab = ({ formData, errors, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Challenge */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          The Challenge
        </label>
        <TiptapContentEditor
          content={formData.challenge}
          onChange={(content) => onChange('challenge', content)}
          placeholder="Describe the challenges the client was facing..."
          minHeight="200px"
        />
        {errors.challenge && (
          <p className="text-xs text-red-500 mt-1">{errors.challenge}</p>
        )}
      </div>

      {/* Solution */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Our Solution
        </label>
        <TiptapContentEditor
          content={formData.solution}
          onChange={(content) => onChange('solution', content)}
          placeholder="Explain how you solved the client's challenges..."
          minHeight="200px"
        />
        {errors.solution && (
          <p className="text-xs text-red-500 mt-1">{errors.solution}</p>
        )}
      </div>

      {/* Implementation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Implementation Process
        </label>
        <TiptapContentEditor
          content={formData.implementation}
          onChange={(content) => onChange('implementation', content)}
          placeholder="Detail the implementation process and methodology..."
          minHeight="200px"
        />
        {errors.implementation && (
          <p className="text-xs text-red-500 mt-1">{errors.implementation}</p>
        )}
      </div>

      {/* Process Steps */}
      <div className="border-t pt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Process Steps
        </label>
        <ProcessStepsEditor
          steps={formData.process_steps || []}
          onChange={(steps) => onChange('process_steps', steps)}
        />
      </div>
    </div>
  );
};

// Process Steps Component
const ProcessStepsEditor = ({ steps, onChange }) => {
  const addStep = () => {
    onChange([...steps, { title: '', description: '', icon: 'Circle' }]);
  };

  const updateStep = (index, field, value) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    onChange(newSteps);
  };

  const removeStep = (index) => {
    onChange(steps.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex-1 space-y-2">
            <input
              type="text"
              value={step.title || ''}
              onChange={(e) => updateStep(index, 'title', e.target.value)}
              placeholder="Step title"
              className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
            />
            <textarea
              value={step.description || ''}
              onChange={(e) => updateStep(index, 'description', e.target.value)}
              placeholder="Step description"
              rows={2}
              className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <button
            onClick={() => removeStep(index)}
            className="text-red-500 hover:text-red-600 mt-1"
          >
            ×
          </button>
        </div>
      ))}
      
      <button
        onClick={addStep}
        className="text-sm text-accent hover:text-accent/80"
      >
        + Add Process Step
      </button>
    </div>
  );
};

export default ContentTab;