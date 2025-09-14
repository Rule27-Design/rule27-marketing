// src/pages/admin/services/editor-tabs/FeaturesTab.jsx
import React from 'react';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AdminIcon';

const FeaturesTab = ({ formData, errors, onChange }) => {
  // Features management
  const addFeature = () => {
    onChange('features', [...(formData.features || []), '']);
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures[index] = value;
    onChange('features', newFeatures);
  };

  const removeFeature = (index) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures.splice(index, 1);
    onChange('features', newFeatures);
  };

  const moveFeature = (fromIndex, toIndex) => {
    const newFeatures = [...(formData.features || [])];
    const [movedItem] = newFeatures.splice(fromIndex, 1);
    newFeatures.splice(toIndex, 0, movedItem);
    onChange('features', newFeatures);
  };

  // Technologies management
  const addTechnology = () => {
    onChange('technologies', [...(formData.technologies || []), '']);
  };

  const updateTechnology = (index, value) => {
    const newTechnologies = [...(formData.technologies || [])];
    newTechnologies[index] = value;
    onChange('technologies', newTechnologies);
  };

  const removeTechnology = (index) => {
    const newTechnologies = [...(formData.technologies || [])];
    newTechnologies.splice(index, 1);
    onChange('technologies', newTechnologies);
  };

  // Process steps management
  const addProcessStep = () => {
    const newStep = {
      title: '',
      description: '',
      duration: ''
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

  // Expected results management
  const addExpectedResult = () => {
    const newResult = {
      metric: '',
      description: '',
      timeframe: ''
    };
    onChange('expected_results', [...(formData.expected_results || []), newResult]);
  };

  const updateExpectedResult = (index, field, value) => {
    const newResults = [...(formData.expected_results || [])];
    newResults[index] = { ...newResults[index], [field]: value };
    onChange('expected_results', newResults);
  };

  const removeExpectedResult = (index) => {
    const newResults = [...(formData.expected_results || [])];
    newResults.splice(index, 1);
    onChange('expected_results', newResults);
  };

  return (
    <div className="space-y-6">
      {/* Features */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Service Features
          </label>
          <Button
            variant="outline"
            size="sm"
            onClick={addFeature}
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Add Feature
          </Button>
        </div>

        {(formData.features || []).length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Icon name="List" size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600 mb-3">No features added yet</p>
            <Button
              variant="primary"
              size="sm"
              onClick={addFeature}
            >
              Add Your First Feature
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => moveFeature(index, index - 1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Icon name="ChevronUp" size={14} />
                    </button>
                  )}
                  {index < formData.features.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveFeature(index, index + 1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Icon name="ChevronDown" size={14} />
                    </button>
                  )}
                </div>
                <Input
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  placeholder="Feature description"
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFeature(index)}
                >
                  <Icon name="X" size={16} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Technologies */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Technologies Used
          </label>
          <Button
            variant="outline"
            size="sm"
            onClick={addTechnology}
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Add Technology
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {(formData.technologies || []).map((tech, index) => (
            <div key={index} className="flex items-center gap-1">
              <Input
                value={tech}
                onChange={(e) => updateTechnology(index, e.target.value)}
                placeholder="Technology"
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeTechnology(index)}
              >
                <Icon name="X" size={14} />
              </Button>
            </div>
          ))}
          {(formData.technologies || []).length === 0 && (
            <Button
              variant="outline"
              onClick={addTechnology}
              className="col-span-full"
            >
              Add Technology
            </Button>
          )}
        </div>
      </div>

      {/* Process Steps */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Process Steps
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
                <div className="space-y-2">
                  <Input
                    label="Title"
                    value={step.title}
                    onChange={(e) => updateProcessStep(index, 'title', e.target.value)}
                    placeholder="Step title"
                  />
                  <textarea
                    value={step.description}
                    onChange={(e) => updateProcessStep(index, 'description', e.target.value)}
                    placeholder="Step description"
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={2}
                  />
                  <Input
                    label="Duration"
                    value={step.duration}
                    onChange={(e) => updateProcessStep(index, 'duration', e.target.value)}
                    placeholder="e.g., 1-2 weeks"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expected Results */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Expected Results
          </label>
          <Button
            variant="outline"
            size="sm"
            onClick={addExpectedResult}
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Add Result
          </Button>
        </div>

        {(formData.expected_results || []).length > 0 && (
          <div className="space-y-3">
            {formData.expected_results.map((result, index) => (
              <div key={index} className="bg-white border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-accent">
                    Result #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeExpectedResult(index)}
                    className="text-red-500 hover:bg-red-100 p-1 rounded"
                  >
                    <Icon name="X" size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Input
                    label="Metric"
                    value={result.metric}
                    onChange={(e) => updateExpectedResult(index, 'metric', e.target.value)}
                    placeholder="e.g., Conversion Rate"
                  />
                  <Input
                    label="Timeframe"
                    value={result.timeframe}
                    onChange={(e) => updateExpectedResult(index, 'timeframe', e.target.value)}
                    placeholder="e.g., 3-6 months"
                  />
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={result.description}
                      onChange={(e) => updateExpectedResult(index, 'description', e.target.value)}
                      placeholder="Expected outcome description"
                      className="w-full px-3 py-2 border rounded-lg"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturesTab;