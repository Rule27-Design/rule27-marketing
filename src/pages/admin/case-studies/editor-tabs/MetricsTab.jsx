// src/pages/admin/case-studies/editor-tabs/MetricsTab.jsx
import React from 'react';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AdminIcon';
import TiptapContentEditor from '../../../../components/ui/TiptapContentEditor';
import { cn } from '../../../../utils';

const MetricsTab = ({ formData, errors, onChange }) => {
  const metricTypes = [
    { value: 'percentage', label: 'Percentage' },
    { value: 'number', label: 'Number' },
    { value: 'currency', label: 'Currency' },
    { value: 'time', label: 'Time' },
    { value: 'text', label: 'Text' }
  ];

  const addKeyMetric = () => {
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

  const updateKeyMetric = (index, field, value) => {
    const newMetrics = [...(formData.key_metrics || [])];
    newMetrics[index] = { ...newMetrics[index], [field]: value };
    
    // Auto-calculate improvement if before and after are numbers
    if (field === 'after' || field === 'before') {
      const before = parseFloat(newMetrics[index].before?.replace(/[^0-9.-]/g, ''));
      const after = parseFloat(newMetrics[index].after?.replace(/[^0-9.-]/g, ''));
      
      if (!isNaN(before) && !isNaN(after) && before > 0) {
        const improvement = Math.round(((after - before) / before) * 100);
        newMetrics[index].improvement = `${improvement > 0 ? '+' : ''}${improvement}%`;
      }
    }
    
    onChange('key_metrics', newMetrics);
  };

  const removeKeyMetric = (index) => {
    onChange('key_metrics', formData.key_metrics.filter((_, i) => i !== index));
  };

  const addDetailedResult = () => {
    const newResults = [...(formData.detailed_results || [])];
    newResults.push({
      title: '',
      description: '',
      metrics: []
    });
    onChange('detailed_results', newResults);
  };

  const updateDetailedResult = (index, field, value) => {
    const newResults = [...(formData.detailed_results || [])];
    newResults[index] = { ...newResults[index], [field]: value };
    onChange('detailed_results', newResults);
  };

  const removeDetailedResult = (index) => {
    onChange('detailed_results', formData.detailed_results.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Key Metrics *
          </label>
          <Button
            variant="outline"
            size="xs"
            onClick={addKeyMetric}
            iconName="Plus"
          >
            Add Metric
          </Button>
        </div>
        
        {errors.key_metrics && (
          <p className="text-xs text-red-500 mb-2">{errors.key_metrics}</p>
        )}
        
        <div className="space-y-3">
          {(formData.key_metrics || []).map((metric, index) => (
            <div key={index} className={cn(
              "p-4 border rounded-lg",
              "bg-gray-50"
            )}>
              <div className="grid grid-cols-5 gap-3 items-end">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Metric Label</label>
                  <Input
                    type="text"
                    value={metric.label || ''}
                    onChange={(e) => updateKeyMetric(index, 'label', e.target.value)}
                    placeholder="e.g., Revenue Growth"
                    size="sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Before</label>
                  <Input
                    type="text"
                    value={metric.before || ''}
                    onChange={(e) => updateKeyMetric(index, 'before', e.target.value)}
                    placeholder="e.g., $100k"
                    size="sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-600 mb-1">After</label>
                  <Input
                    type="text"
                    value={metric.after || ''}
                    onChange={(e) => updateKeyMetric(index, 'after', e.target.value)}
                    placeholder="e.g., $250k"
                    size="sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Improvement</label>
                  <Input
                    type="text"
                    value={metric.improvement || ''}
                    onChange={(e) => updateKeyMetric(index, 'improvement', e.target.value)}
                    placeholder="e.g., +150%"
                    size="sm"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Select
                    value={metric.type || 'percentage'}
                    onChange={(value) => updateKeyMetric(index, 'type', value)}
                    options={metricTypes}
                    size="sm"
                  />
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => removeKeyMetric(index)}
                    className="text-red-500"
                  >
                    <Icon name="X" size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {(!formData.key_metrics || formData.key_metrics.length === 0) && (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <Icon name="ChartBar" size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">No metrics added yet</p>
            <Button
              variant="outline"
              size="sm"
              onClick={addKeyMetric}
              className="mt-2"
            >
              Add First Metric
            </Button>
          </div>
        )}
      </div>

      {/* Detailed Results */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Detailed Results
          </label>
          <Button
            variant="outline"
            size="xs"
            onClick={addDetailedResult}
            iconName="Plus"
          >
            Add Result Section
          </Button>
        </div>
        
        <div className="space-y-4">
          {(formData.detailed_results || []).map((result, index) => (
            <div key={index} className="p-4 border rounded-lg bg-white">
              <div className="flex items-start justify-between mb-3">
                <Input
                  type="text"
                  value={result.title || ''}
                  onChange={(e) => updateDetailedResult(index, 'title', e.target.value)}
                  placeholder="Result section title"
                  className="font-medium"
                />
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => removeDetailedResult(index)}
                  className="text-red-500"
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
              
              <TiptapContentEditor
                content={result.description}
                onChange={(content) => updateDetailedResult(index, 'description', content)}
                placeholder="Describe the results in detail..."
                minHeight="150px"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Process Steps */}
      <div className="border-t pt-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Process Steps
        </label>
        
        <div className="space-y-3">
          {(formData.process_steps || []).map((step, index) => (
            <div key={index} className="p-3 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-3 gap-3">
                <Input
                  type="text"
                  value={step.title || ''}
                  onChange={(e) => {
                    const newSteps = [...(formData.process_steps || [])];
                    newSteps[index].title = e.target.value;
                    onChange('process_steps', newSteps);
                  }}
                  placeholder="Step title"
                  size="sm"
                />
                <Input
                  type="text"
                  value={step.duration || ''}
                  onChange={(e) => {
                    const newSteps = [...(formData.process_steps || [])];
                    newSteps[index].duration = e.target.value;
                    onChange('process_steps', newSteps);
                  }}
                  placeholder="Duration"
                  size="sm"
                />
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    value={step.description || ''}
                    onChange={(e) => {
                      const newSteps = [...(formData.process_steps || [])];
                      newSteps[index].description = e.target.value;
                      onChange('process_steps', newSteps);
                    }}
                    placeholder="Description"
                    size="sm"
                  />
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => {
                      onChange('process_steps', 
                        formData.process_steps.filter((_, i) => i !== index)
                      );
                    }}
                    className="text-red-500"
                  >
                    <Icon name="X" size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newSteps = [...(formData.process_steps || [])];
              newSteps.push({ title: '', description: '', duration: '' });
              onChange('process_steps', newSteps);
            }}
            iconName="Plus"
          >
            Add Process Step
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MetricsTab;