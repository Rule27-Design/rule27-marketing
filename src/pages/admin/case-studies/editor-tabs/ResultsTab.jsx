// src/pages/admin/case-studies/editor-tabs/ResultsTab.jsx
import React from 'react';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AdminIcon';

const ResultsTab = ({ formData, errors, onChange, testimonials = [] }) => {
  // Key metrics management
  const addMetric = () => {
    const newMetric = {
      label: '',
      value: '',
      unit: '',
      improvement: '',
      before: '',
      after: ''
    };
    onChange('key_metrics', [...(formData.key_metrics || []), newMetric]);
  };

  const updateMetric = (index, field, value) => {
    const newMetrics = [...(formData.key_metrics || [])];
    newMetrics[index] = { ...newMetrics[index], [field]: value };
    onChange('key_metrics', newMetrics);
  };

  const removeMetric = (index) => {
    const newMetrics = [...(formData.key_metrics || [])];
    newMetrics.splice(index, 1);
    onChange('key_metrics', newMetrics);
  };

  const moveMetric = (fromIndex, toIndex) => {
    const newMetrics = [...(formData.key_metrics || [])];
    const [movedItem] = newMetrics.splice(fromIndex, 1);
    newMetrics.splice(toIndex, 0, movedItem);
    onChange('key_metrics', newMetrics);
  };

  return (
    <div className="space-y-6">
      {/* Challenge */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          The Challenge <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.challenge}
          onChange={(e) => onChange('challenge', e.target.value)}
          placeholder="Describe the challenges the client was facing..."
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
          rows={4}
          required
        />
        {errors.challenge && (
          <p className="text-sm text-red-500 mt-1">{errors.challenge}</p>
        )}
      </div>

      {/* Solution */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Our Solution <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.solution}
          onChange={(e) => onChange('solution', e.target.value)}
          placeholder="Describe the solution you provided..."
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
          rows={4}
          required
        />
        {errors.solution && (
          <p className="text-sm text-red-500 mt-1">{errors.solution}</p>
        )}
      </div>

      {/* Implementation Process */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Implementation Process
        </label>
        <textarea
          value={formData.implementation_process}
          onChange={(e) => onChange('implementation_process', e.target.value)}
          placeholder="Describe how the solution was implemented..."
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
          rows={4}
        />
      </div>

      {/* Key Metrics */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Key Metrics & Results <span className="text-red-500">*</span>
          </label>
          <Button
            variant="outline"
            size="sm"
            onClick={addMetric}
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Add Metric
          </Button>
        </div>

        {(formData.key_metrics || []).length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Icon name="BarChart" size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600 mb-3">No metrics added yet</p>
            <Button
              variant="primary"
              size="sm"
              onClick={addMetric}
            >
              Add Your First Metric
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {formData.key_metrics.map((metric, index) => (
              <div key={index} className="bg-white border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Metric #{index + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => moveMetric(index, index - 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Move up"
                      >
                        <Icon name="ChevronUp" size={14} />
                      </button>
                    )}
                    {index < formData.key_metrics.length - 1 && (
                      <button
                        type="button"
                        onClick={() => moveMetric(index, index + 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Move down"
                      >
                        <Icon name="ChevronDown" size={14} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeMetric(index)}
                      className="p-1 hover:bg-red-100 text-red-500 rounded"
                      title="Remove"
                    >
                      <Icon name="X" size={14} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    label="Metric Label"
                    value={metric.label}
                    onChange={(e) => updateMetric(index, 'label', e.target.value)}
                    placeholder="e.g., Revenue Growth"
                    required
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      label="Value"
                      value={metric.value}
                      onChange={(e) => updateMetric(index, 'value', e.target.value)}
                      placeholder="150"
                      required
                    />
                    <Input
                      label="Unit"
                      value={metric.unit}
                      onChange={(e) => updateMetric(index, 'unit', e.target.value)}
                      placeholder="%"
                    />
                  </div>

                  <Input
                    label="Before"
                    value={metric.before}
                    onChange={(e) => updateMetric(index, 'before', e.target.value)}
                    placeholder="Previous value"
                  />
                  
                  <Input
                    label="After"
                    value={metric.after}
                    onChange={(e) => updateMetric(index, 'after', e.target.value)}
                    placeholder="New value"
                  />

                  <Input
                    label="Improvement"
                    value={metric.improvement}
                    onChange={(e) => updateMetric(index, 'improvement', e.target.value)}
                    placeholder="e.g., +150%"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {errors.key_metrics && (
          <p className="text-sm text-red-500 mt-1">{errors.key_metrics}</p>
        )}
      </div>

      {/* Results Narrative */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Results Narrative
        </label>
        <textarea
          value={formData.results_narrative}
          onChange={(e) => onChange('results_narrative', e.target.value)}
          placeholder="Provide a detailed narrative of the results achieved..."
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
          rows={6}
        />
      </div>

      {/* Testimonial */}
      <div>
        <Select
          label="Client Testimonial (Optional)"
          value={formData.testimonial_id || ''}
          onChange={(value) => onChange('testimonial_id', value || null)}
          options={[
            { value: '', label: 'Select testimonial...' },
            ...testimonials.map(t => ({
              value: t.id,
              label: `${t.client_name} - ${t.company_name || 'No company'}`
            }))
          ]}
        />
        <p className="text-xs text-gray-500 mt-1">
          Link an existing testimonial to this case study
        </p>
      </div>

      {/* Success Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Tips for Compelling Results</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Use specific numbers and percentages whenever possible</li>
          <li>• Include before/after comparisons to show impact</li>
          <li>• Focus on business outcomes (revenue, efficiency, growth)</li>
          <li>• Add context to make metrics meaningful to readers</li>
          <li>• Order metrics by importance or impact</li>
        </ul>
      </div>
    </div>
  );
};

export default ResultsTab;