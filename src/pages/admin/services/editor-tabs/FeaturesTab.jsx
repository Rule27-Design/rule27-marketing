// src/pages/admin/services/editor-tabs/FeaturesTab.jsx
import React, { useState } from 'react';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AdminIcon';
import TiptapContentEditor from '../../../../components/ui/TiptapContentEditor';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { cn } from '../../../../utils';

const FeaturesTab = ({ formData, errors, onChange }) => {
  const [expandedFeature, setExpandedFeature] = useState(null);

  // Handle Features
  const addFeature = () => {
    const newFeatures = [...(formData.features || [])];
    newFeatures.push({ title: '', description: '', icon: '' });
    onChange('features', newFeatures);
  };

  const updateFeature = (index, field, value) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    onChange('features', newFeatures);
  };

  const removeFeature = (index) => {
    onChange('features', formData.features.filter((_, i) => i !== index));
  };

  const reorderFeatures = (startIndex, endIndex) => {
    const result = Array.from(formData.features || []);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    onChange('features', result);
  };

  // Handle Benefits
  const addBenefit = () => {
    const newBenefits = [...(formData.benefits || [])];
    newBenefits.push('');
    onChange('benefits', newBenefits);
  };

  const updateBenefit = (index, value) => {
    const newBenefits = [...(formData.benefits || [])];
    newBenefits[index] = value;
    onChange('benefits', newBenefits);
  };

  const removeBenefit = (index) => {
    onChange('benefits', formData.benefits.filter((_, i) => i !== index));
  };

  // Handle Key Features
  const addKeyFeature = () => {
    const newKeyFeatures = [...(formData.key_features || [])];
    newKeyFeatures.push({
      title: '',
      description: '',
      icon: '',
      is_highlighted: false
    });
    onChange('key_features', newKeyFeatures);
    setExpandedFeature(newKeyFeatures.length - 1);
  };

  const updateKeyFeature = (index, field, value) => {
    const newKeyFeatures = [...(formData.key_features || [])];
    newKeyFeatures[index] = { ...newKeyFeatures[index], [field]: value };
    onChange('key_features', newKeyFeatures);
  };

  const removeKeyFeature = (index) => {
    onChange('key_features', formData.key_features.filter((_, i) => i !== index));
    if (expandedFeature === index) {
      setExpandedFeature(null);
    }
  };

  const featureIcons = ['✓', '★', '⚡', '🎯', '🚀', '💡', '🛡️', '📊'];

  return (
    <div className="space-y-6">
      {/* Key Features */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Key Features
          </label>
          <Button
            variant="outline"
            size="xs"
            onClick={addKeyFeature}
            iconName="Plus"
          >
            Add Key Feature
          </Button>
        </div>
        
        <div className="space-y-3">
          {(formData.key_features || []).map((feature, index) => (
            <div
              key={index}
              className={cn(
                "border rounded-lg",
                expandedFeature === index ? 'ring-2 ring-accent' : ''
              )}
            >
              <div
                className="p-3 cursor-pointer"
                onClick={() => setExpandedFeature(expandedFeature === index ? null : index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {feature.icon && (
                      <span className="text-2xl">{feature.icon}</span>
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {feature.title || 'Untitled Feature'}
                      </h4>
                      {feature.description && !expandedFeature && (
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {feature.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {feature.is_highlighted && (
                      <Icon name="Star" size={16} className="text-yellow-500" />
                    )}
                    <Icon
                      name={expandedFeature === index ? 'ChevronUp' : 'ChevronDown'}
                      size={16}
                    />
                  </div>
                </div>
              </div>
              
              {expandedFeature === index && (
                <div className="p-3 border-t space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Title</label>
                    <Input
                      type="text"
                      value={feature.title || ''}
                      onChange={(e) => updateKeyFeature(index, 'title', e.target.value)}
                      placeholder="Feature title"
                      size="sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Description</label>
                    <textarea
                      value={feature.description || ''}
                      onChange={(e) => updateKeyFeature(index, 'description', e.target.value)}
                      placeholder="Feature description"
                      rows={2}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Icon</label>
                    <div className="flex items-center space-x-2">
                      <div className="flex gap-1">
                        {featureIcons.map((icon) => (
                          <button
                            key={icon}
                            type="button"
                            onClick={() => updateKeyFeature(index, 'icon', icon)}
                            className={cn(
                              "w-8 h-8 rounded border flex items-center justify-center",
                              feature.icon === icon
                                ? "border-accent bg-accent/10"
                                : "border-gray-200"
                            )}
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                      <Input
                        type="text"
                        value={feature.icon || ''}
                        onChange={(e) => updateKeyFeature(index, 'icon', e.target.value)}
                        placeholder="Custom"
                        size="sm"
                        className="w-24"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={feature.is_highlighted || false}
                        onChange={(e) => updateKeyFeature(index, 'is_highlighted', e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Highlight this feature</span>
                    </label>
                    
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => removeKeyFeature(index)}
                      className="text-red-500"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Standard Features */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Standard Features
          </label>
          <Button
            variant="outline"
            size="xs"
            onClick={addFeature}
            iconName="Plus"
          >
            Add Feature
          </Button>
        </div>
        
        <DragDropContext onDragEnd={(result) => {
          if (!result.destination) return;
          reorderFeatures(result.source.index, result.destination.index);
        }}>
          <Droppable droppableId="features">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                {(formData.features || []).map((feature, index) => (
                  <Draggable key={index} draggableId={`feature-${index}`} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          "flex items-center space-x-2 p-2 bg-gray-50 rounded",
                          snapshot.isDragging ? 'shadow-lg' : ''
                        )}
                      >
                        <div {...provided.dragHandleProps}>
                          <Icon name="GripVertical" size={16} className="text-gray-400" />
                        </div>
                        <Input
                          type="text"
                          value={feature.title || ''}
                          onChange={(e) => updateFeature(index, 'title', e.target.value)}
                          placeholder="Feature title"
                          size="sm"
                          className="flex-1"
                        />
                        <Input
                          type="text"
                          value={feature.description || ''}
                          onChange={(e) => updateFeature(index, 'description', e.target.value)}
                          placeholder="Short description"
                          size="sm"
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => removeFeature(index)}
                          className="text-red-500"
                        >
                          <Icon name="X" size={16} />
                        </Button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Benefits */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Key Benefits
          </label>
          <Button
            variant="outline"
            size="xs"
            onClick={addBenefit}
            iconName="Plus"
          >
            Add Benefit
          </Button>
        </div>
        
        <div className="space-y-2">
          {(formData.benefits || []).map((benefit, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-green-500" />
              <Input
                type="text"
                value={benefit}
                onChange={(e) => updateBenefit(index, e.target.value)}
                placeholder="Enter benefit"
                size="sm"
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="xs"
                onClick={() => removeBenefit(index)}
                className="text-red-500"
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesTab;