// src/pages/admin/case-studies/editor-tabs/MetricsTab.jsx
import React from 'react';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AdminIcon';
import { useMetricsCalculation } from '../hooks/useMetricsCalculation';

const MetricsTab = ({ formData, errors, onChange }) => {
  const { calculateImprovement } = useMetricsCalculation();

  // Handle key metrics
  const addMetric = () => {
    const newMetrics = [...(formData.key_metrics || [])];
    newMetrics.push({ 
      label: '', 
      before: '', 
      after: '', 
      improvement: '', 
      type: 'percentage' 
    });
    onChange('key_metrics', newMetrics);
  };

  const updateMetric = (index, field, value) => {
    const newMetrics = [...(formData.key_metrics || [])];
    newMetrics[index] = { ...newMetrics[index], [field]: value };
    
    // Auto-calculate improvement
    if (field === 'before' || field === 'after') {
      const improvement = calculateImprovement(
        newMetrics[index].before,
        newMetrics[index].after,
        newMetrics[index].type
      );
      newMetrics[index].improvement = improvement;
    }
    
    onChange('key_metrics', newMetrics);
  };

  const removeMetric = (index) => {
    const newMetrics = formData.key_metrics.filter((_, i) => i !== index);
    onChange('key_metrics', newMetrics);
  };

  // Handle deliverables
  const addDeliverable = () => {
    onChange('deliverables', [...(formData.deliverables || []), '']);
  };

  const updateDeliverable = (index, value) => {
    const newDeliverables = [...formData.deliverables];
    newDeliverables[index] = value;
    onChange('deliverables', newDeliverables);
  };

  const removeDeliverable = (index) => {
    onChange('deliverables', formData.deliverables.filter((_, i) => i !== index));
  };

  // Handle technologies
  const addTechnology = () => {
    onChange('technologies_used', [...(formData.technologies_used || []), '']);
  };

  const updateTechnology = (index, value) => {
    const newTech = [...formData.technologies_used];
    newTech[index] = value;
    onChange('technologies_used', newTech);
  };

  const removeTechnology = (index) => {
    onChange('technologies_used', formData.technologies_used.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Key Metrics & Results
          </label>
          <Button
            variant="outline"
            size="xs"
            onClick={addMetric}
            iconName="Plus"
          >
            Add Metric
          </Button>
        </div>
        
        <div className="space-y-3">
          {(formData.key_metrics || []).map((metric, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div className="md:col-span-2">
                  <Input
                    type="text"
                    value={metric.label || ''}
                    onChange={(e) => updateMetric(index, 'label', e.target.value)}
                    placeholder="Metric name (e.g., Conversion Rate)"
                    size="sm"
                  />
                </div>
                
                <div>
                  <Input
                    type="text"
                    value={metric.before || ''}
                    onChange={(e) => updateMetric(index, 'before', e.target.value)}
                    placeholder="Before"
                    size="sm"
                  />
                </div>
                
                <div>
                  <Input
                    type="text"
                    value={metric.after || ''}
                    onChange={(e) => updateMetric(index, 'after', e.target.value)}
                    placeholder="After"
                    size="sm"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex-1">
                    <Input
                      type="text"
                      value={metric.improvement || ''}
                      onChange={(e) => updateMetric(index, 'improvement', e.target.value)}
                      placeholder="Auto"
                      size="sm"
                      className="bg-green-50"
                      readOnly
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => removeMetric(index)}
                    className="text-red-500"
                  >
                    <Icon name="X" size={16} />
                  </Button>
                </div>
              </div>
              
              <div className="mt-2">
                <Select
                  value={metric.type || 'percentage'}
                  onChange={(value) => updateMetric(index, 'type', value)}
                  options={[
                    { value: 'percentage', label: 'Percentage' },
                    { value: 'number', label: 'Number' },
                    { value: 'currency', label: 'Currency' },
                    { value: 'time', label: 'Time' }
                  ]}
                  size="sm"
                />
              </div>
            </div>
          ))}
        </div>
        
        {errors.key_metrics && (
          <p className="text-xs text-red-500 mt-1">{errors.key_metrics}</p>
        )}
      </div>

      {/* Timeline */}
      <div className="border-t pt-6">
        <label className="text-sm font-medium text-gray-700 mb-3 block">
          Project Timeline
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Duration</label>
            <Input
              type="text"
              value={formData.project_duration || ''}
              onChange={(e) => onChange('project_duration', e.target.value)}
              placeholder="e.g., 3 months"
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-600 mb-1">Start Date</label>
            <Input
              type="date"
              value={formData.start_date || ''}
              onChange={(e) => onChange('start_date', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-600 mb-1">End Date</label>
            <Input
              type="date"
              value={formData.end_date || ''}
              onChange={(e) => onChange('end_date', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Deliverables */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Project Deliverables
          </label>
          <Button
            variant="outline"
            size="xs"
            onClick={addDeliverable}
            iconName="Plus"
          >
            Add Deliverable
          </Button>
        </div>
        
        <div className="space-y-2">
          {(formData.deliverables || []).map((deliverable, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                type="text"
                value={deliverable}
                onChange={(e) => updateDeliverable(index, e.target.value)}
                placeholder="Deliverable item"
                size="sm"
              />
              <Button
                variant="ghost"
                size="xs"
                onClick={() => removeDeliverable(index)}
                className="text-red-500"
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Technologies Used */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Technologies Used
          </label>
          <Button
            variant="outline"
            size="xs"
            onClick={addTechnology}
            iconName="Plus"
          >
            Add Technology
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {(formData.technologies_used || []).map((tech, index) => (
            <div key={index} className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
              <input
                type="text"
                value={tech}
                onChange={(e) => updateTechnology(index, e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-24"
                placeholder="Technology"
              />
              <button
                onClick={() => removeTechnology(index)}
                className="text-blue-600 hover:text-red-500"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MetricsTab;