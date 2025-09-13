// src/pages/admin/case-studies/editor-tabs/ResultsTab.jsx
import React from 'react';
import TiptapContentEditor from '../../../../components/ui/TiptapContentEditor';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AdminIcon';

const ResultsTab = ({ formData, errors, onChange, testimonials = [] }) => {
  // Key metrics management (simplified version)
  const addMetric = () => {
    const newMetric = {
      label: '',
      value: '',
      unit: '%',
      improvement: ''
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

  // Detailed results management
  const addDetailedResult = () => {
    const newResult = {
      type: 'percentage',
      value: '',
      metric: '',
      description: ''
    };
    onChange('detailed_results', [...(formData.detailed_results || []), newResult]);
  };

  const updateDetailedResult = (index, field, value) => {
    const newResults = [...(formData.detailed_results || [])];
    newResults[index] = { ...newResults[index], [field]: value };
    onChange('detailed_results', newResults);
  };

  const removeDetailedResult = (index) => {
    const newResults = [...(formData.detailed_results || [])];
    newResults.splice(index, 1);
    onChange('detailed_results', newResults);
  };

  const moveDetailedResult = (fromIndex, toIndex) => {
    const newResults = [...(formData.detailed_results || [])];
    const [movedItem] = newResults.splice(fromIndex, 1);
    newResults.splice(toIndex, 0, movedItem);
    onChange('detailed_results', newResults);
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

  // Format value for display
  const formatMetricValue = (value, type) => {
    if (!value) return '';
    if (type === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }
    return `${value}%`;
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

      {/* Key Metrics - Simplified version for quick stats */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Key Metrics <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">Quick highlight metrics for listings and summaries</p>
          </div>
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
            <p className="text-gray-600 mb-3">No key metrics added yet</p>
            <Button
              variant="primary"
              size="sm"
              onClick={addMetric}
            >
              Add Your First Metric
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {formData.key_metrics.map((metric, index) => (
              <div key={index} className="bg-white border rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500">
                    Key Metric #{index + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => moveMetric(index, index - 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Move up"
                      >
                        <Icon name="ChevronUp" size={12} />
                      </button>
                    )}
                    {index < formData.key_metrics.length - 1 && (
                      <button
                        type="button"
                        onClick={() => moveMetric(index, index + 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Move down"
                      >
                        <Icon name="ChevronDown" size={12} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeMetric(index)}
                      className="p-1 hover:bg-red-100 text-red-500 rounded"
                      title="Remove"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <Input
                      label="Label"
                      value={metric.label}
                      onChange={(e) => updateMetric(index, 'label', e.target.value)}
                      placeholder="e.g., Revenue Growth"
                      required
                    />
                  </div>
                  <div className="flex gap-1">
                    <Input
                      label="Value"
                      type="number"
                      value={metric.value}
                      onChange={(e) => updateMetric(index, 'value', e.target.value)}
                      placeholder="400"
                      required
                    />
                    <div className="mt-6">
                      <span className="text-lg text-gray-600">%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {errors.key_metrics && (
          <p className="text-sm text-red-500 mt-1">{errors.key_metrics}</p>
        )}
      </div>

      {/* Detailed Results - NEW structured format */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Detailed Results & Metrics
            </label>
            <p className="text-xs text-gray-500 mt-1">Comprehensive metrics with descriptions</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={addDetailedResult}
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Add Result
          </Button>
        </div>

        {(formData.detailed_results || []).length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Icon name="TrendingUp" size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600 mb-3">No detailed results added yet</p>
            <Button
              variant="primary"
              size="sm"
              onClick={addDetailedResult}
            >
              Add Your First Result
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {formData.detailed_results.map((result, index) => (
              <div key={index} className="bg-white border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Result #{index + 1}
                    {result.value && result.type && (
                      <span className="ml-2 text-accent font-bold">
                        {formatMetricValue(result.value, result.type)}
                      </span>
                    )}
                  </span>
                  <div className="flex items-center gap-1">
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => moveDetailedResult(index, index - 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Move up"
                      >
                        <Icon name="ChevronUp" size={14} />
                      </button>
                    )}
                    {index < formData.detailed_results.length - 1 && (
                      <button
                        type="button"
                        onClick={() => moveDetailedResult(index, index + 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Move down"
                      >
                        <Icon name="ChevronDown" size={14} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeDetailedResult(index)}
                      className="p-1 hover:bg-red-100 text-red-500 rounded"
                      title="Remove"
                    >
                      <Icon name="X" size={14} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Input
                    label="Metric Name"
                    value={result.metric}
                    onChange={(e) => updateDetailedResult(index, 'metric', e.target.value)}
                    placeholder="e.g., Monthly Revenue"
                    required
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <Select
                      label="Type"
                      value={result.type}
                      onChange={(value) => updateDetailedResult(index, 'type', value)}
                      options={[
                        { value: 'percentage', label: 'Percentage' },
                        { value: 'currency', label: 'Currency (USD)' }
                      ]}
                      required
                    />
                    
                    <Input
                      label={result.type === 'currency' ? 'Value ($)' : 'Value (%)'}
                      type="number"
                      value={result.value}
                      onChange={(e) => updateDetailedResult(index, 'value', e.target.value)}
                      placeholder={result.type === 'currency' ? '2500000' : '340'}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={result.description}
                      onChange={(e) => updateDetailedResult(index, 'description', e.target.value)}
                      placeholder="e.g., From $500K to $2.5M monthly recurring revenue"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {errors.detailed_results && (
          <p className="text-sm text-red-500 mt-1">{errors.detailed_results}</p>
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

      {/* Results Statistics */}
      {((formData.key_metrics && formData.key_metrics.length > 0) || 
        (formData.detailed_results && formData.detailed_results.length > 0)) && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Results Overview</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center space-x-2">
                <Icon name="BarChart" size={16} className="text-gray-400" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {(formData.key_metrics?.length || 0)}
                  </div>
                  <div className="text-xs text-gray-500">Key Metrics</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center space-x-2">
                <Icon name="TrendingUp" size={16} className="text-gray-400" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {(formData.detailed_results?.length || 0)}
                  </div>
                  <div className="text-xs text-gray-500">Detailed Results</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center space-x-2">
                <Icon name="Target" size={16} className="text-gray-400" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {(formData.deliverables?.length || 0)}
                  </div>
                  <div className="text-xs text-gray-500">Deliverables</div>
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
          <li>• Use Key Metrics for 3-5 high-level stats that grab attention</li>
          <li>• Use Detailed Results for comprehensive metrics with context</li>
          <li>• Include before/after comparisons in descriptions</li>
          <li>• Focus on business outcomes (revenue, efficiency, growth)</li>
          <li>• Use specific numbers rather than vague statements</li>
          <li>• Order metrics by importance or impact</li>
        </ul>
      </div>
    </div>
  );
};

export default ResultsTab;