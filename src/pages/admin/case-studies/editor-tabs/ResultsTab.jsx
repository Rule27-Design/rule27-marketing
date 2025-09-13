// src/pages/admin/case-studies/editor-tabs/ResultsTab.jsx
import React from 'react';
import TiptapContentEditor from '../../../../components/ui/TiptapContentEditor';
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

  // Process steps management
  const addProcessStep = () => {
    const newStep = {
      title: '',
      description: ''
    };
    onChange('process_steps', [...(formData.process_steps || []), newStep]);
  };

  const updateProcessStep = (index, field, value) => {
    const newSteps = [...(formData.process_steps || [])];
    newSteps[index] = { ...newSteps[index], [field]: value };
    onChange('process_steps', newSteps);
  };

  const removeProcessStep = (index) => {
    const newSteps = [...(formData.process_steps || [])];
    newSteps.splice(index, 1);
    onChange('process_steps', newSteps);
  };

  // Deliverables management
  const addDeliverable = () => {
    onChange('deliverables', [...(formData.deliverables || []), '']);
  };

  const updateDeliverable = (index, value) => {
    const newDeliverables = [...(formData.deliverables || [])];
    newDeliverables[index] = value;
    onChange('deliverables', newDeliverables);
  };

  const removeDeliverable = (index) => {
    const newDeliverables = [...(formData.deliverables || [])];
    newDeliverables.splice(index, 1);
    onChange('deliverables', newDeliverables);
  };

  return (
    <div className="space-y-6">
      {/* Challenge - Using TiptapContentEditor */}
      <div>
        <TiptapContentEditor
          value={formData.challenge}
          onChange={(content) => onChange('challenge', content)}
          label="The Challenge"
          placeholder="Describe the challenges the client was facing..."
          minHeight="200px"
          error={errors.challenge}
          required
        />
      </div>

      {/* Solution - Using TiptapContentEditor */}
      <div>
        <TiptapContentEditor
          value={formData.solution}
          onChange={(content) => onChange('solution', content)}
          label="Our Solution"
          placeholder="Describe the solution you provided..."
          minHeight="200px"
          error={errors.solution}
          required
        />
      </div>

      {/* Implementation Process - Using TiptapContentEditor */}
      <div>
        <TiptapContentEditor
          value={formData.implementation_process}
          onChange={(content) => onChange('implementation_process', content)}
          label="Implementation Process"
          placeholder="Describe how the solution was implemented..."
          minHeight="200px"
          error={errors.implementation_process}
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

      {/* Results Summary */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Results Summary
          <span className="text-gray-500 font-normal ml-2">(Brief summary for listings)</span>
        </label>
        <textarea
          value={formData.results_summary || ''}
          onChange={(e) => onChange('results_summary', e.target.value)}
          placeholder="Brief summary of results for listings and previews..."
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
          rows={3}
          maxLength={300}
        />
        <div className="text-xs text-gray-500 mt-1">
          {formData.results_summary?.length || 0} / 300 characters
        </div>
        {errors.results_summary && (
          <p className="text-sm text-red-500 mt-1">{errors.results_summary}</p>
        )}
      </div>

      {/* Results Narrative - Using TiptapContentEditor */}
      <div>
        <TiptapContentEditor
          value={formData.results_narrative}
          onChange={(content) => onChange('results_narrative', content)}
          label="Detailed Results Narrative"
          placeholder="Provide a detailed narrative of the results achieved..."
          minHeight="300px"
          error={errors.results_narrative}
        />
      </div>

      {/* Process Steps */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Process Steps (Optional)
          </label>
          <Button
            variant="outline"
            size="sm"
            onClick={addProcessStep}
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Add Step
          </Button>
        </div>

        {(formData.process_steps || []).length > 0 && (
          <div className="space-y-3">
            {formData.process_steps.map((step, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium">Step {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeProcessStep(index)}
                    className="text-red-500 hover:bg-red-100 p-1 rounded"
                  >
                    <Icon name="X" size={14} />
                  </button>
                </div>
                <Input
                  label="Title"
                  value={step.title}
                  onChange={(e) => updateProcessStep(index, 'title', e.target.value)}
                  placeholder="Step title..."
                  className="mb-2"
                />
                <textarea
                  value={step.description}
                  onChange={(e) => updateProcessStep(index, 'description', e.target.value)}
                  placeholder="Step description..."
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={2}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Deliverables */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Deliverables (Optional)
          </label>
          <Button
            variant="outline"
            size="sm"
            onClick={addDeliverable}
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Add Deliverable
          </Button>
        </div>

        {(formData.deliverables || []).length > 0 && (
          <div className="space-y-2">
            {formData.deliverables.map((deliverable, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={deliverable}
                  onChange={(e) => updateDeliverable(index, e.target.value)}
                  placeholder="Enter deliverable..."
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
                />
                <button
                  type="button"
                  onClick={() => removeDeliverable(index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
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
              label: `${t.client_name}${t.client_company ? ` - ${t.client_company}` : ''}`
            }))
          ]}
        />
        <p className="text-xs text-gray-500 mt-1">
          Link an existing testimonial to this case study
        </p>
        
        {formData.testimonial_id && testimonials.length > 0 && (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
            {(() => {
              const selected = testimonials.find(t => t.id === formData.testimonial_id);
              return selected ? (
                <>
                  <p className="text-sm italic text-gray-600">"{selected.quote}"</p>
                  <p className="text-xs text-gray-500 mt-2">
                    — {selected.client_name}
                    {selected.client_title && `, ${selected.client_title}`}
                    {selected.client_company && ` at ${selected.client_company}`}
                  </p>
                  {selected.rating && (
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Icon 
                          key={i}
                          name="Star" 
                          size={12} 
                          className={i < selected.rating ? 'text-yellow-500' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : null;
            })()}
          </div>
        )}
      </div>

      {/* Content Statistics */}
      {(formData.challenge || formData.solution || formData.results_narrative) && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Content Statistics</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center space-x-2">
                <Icon name="FileText" size={16} className="text-gray-400" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {[formData.challenge, formData.solution, formData.implementation_process, formData.results_narrative]
                      .filter(Boolean)
                      .reduce((sum, content) => sum + (content.wordCount || 0), 0)}
                  </div>
                  <div className="text-xs text-gray-500">Total Words</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={16} className="text-gray-400" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.ceil(
                      [formData.challenge, formData.solution, formData.implementation_process, formData.results_narrative]
                        .filter(Boolean)
                        .reduce((sum, content) => sum + (content.wordCount || 0), 0) / 200
                    )}
                  </div>
                  <div className="text-xs text-gray-500">Min Read</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center space-x-2">
                <Icon name="TrendingUp" size={16} className="text-gray-400" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formData.key_metrics?.length || 0}
                  </div>
                  <div className="text-xs text-gray-500">Metrics</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tips for Compelling Results */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Tips for Compelling Results</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Use specific numbers and percentages whenever possible</li>
          <li>• Include before/after comparisons to show impact</li>
          <li>• Focus on business outcomes (revenue, efficiency, growth)</li>
          <li>• Add context to make metrics meaningful to readers</li>
          <li>• Order metrics by importance or impact</li>
          <li>• Use rich formatting to highlight key points</li>
        </ul>
      </div>
    </div>
  );
};

export default ResultsTab;