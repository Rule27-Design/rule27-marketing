// src/pages/admin/services/editor-tabs/FeaturesTab.jsx
import React from 'react';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AdminIcon';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const FeaturesTab = ({ formData, errors, onChange }) => {
  // Handle features list
  const addFeature = () => {
    onChange('features', [...(formData.features || []), '']);
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures[index] = value;
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

  // Handle benefits
  const addBenefit = () => {
    onChange('benefits', [...(formData.benefits || []), { title: '', description: '' }]);
  };

  const updateBenefit = (index, field, value) => {
    const newBenefits = [...(formData.benefits || [])];
    newBenefits[index] = { ...newBenefits[index], [field]: value };
    onChange('benefits', newBenefits);
  };

  const removeBenefit = (index) => {
    onChange('benefits', formData.benefits.filter((_, i) => i !== index));
  };

  // Handle key features
  const addKeyFeature = () => {
    onChange('key_features', [...(formData.key_features || []), 
      { title: '', description: '', icon: 'Star' }
    ]);
  };

  const updateKeyFeature = (index, field, value) => {
    const newKeyFeatures = [...(formData.key_features || [])];
    newKeyFeatures[index] = { ...newKeyFeatures[index], [field]: value };
    onChange('key_features', newKeyFeatures);
  };

  const removeKeyFeature = (index) => {
    onChange('key_features', formData.key_features.filter((_, i) => i !== index));
  };

  // Handle USPs
  const addUSP = () => {
    onChange('unique_selling_points', [...(formData.unique_selling_points || []), '']);
  };

  const updateUSP = (index, value) => {
    const newUSPs = [...(formData.unique_selling_points || [])];
    newUSPs[index] = value;
    onChange('unique_selling_points', newUSPs);
  };

  const removeUSP = (index) => {
    onChange('unique_selling_points', 
      formData.unique_selling_points.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      {/* Main Features */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Features
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
                        className={`flex items-center space-x-2 ${
                          snapshot.isDragging ? 'opacity-50' : ''
                        }`}
                      >
                        <div {...provided.dragHandleProps} className="cursor-move">
                          <Icon name="GripVertical" size={16} className="text-gray-400" />
                        </div>
                        <Input
                          type="text"
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                          placeholder="Feature description"
                          size="sm"
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
        
        {errors.features && (
          <p className="text-xs text-red-500 mt-1">{errors.features}</p>
        )}
      </div>

      {/* Key Features (with icons) */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Key Features (with icons)
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
          {(formData.key_features || []).map((keyFeature, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  type="text"
                  value={keyFeature.icon || ''}
                  onChange={(e) => updateKeyFeature(index, 'icon', e.target.value)}
                  placeholder="Icon name"
                  size="sm"
                />
                <Input
                  type="text"
                  value={keyFeature.title || ''}
                  onChange={(e) => updateKeyFeature(index, 'title', e.target.value)}
                  placeholder="Feature title"
                  size="sm"
                />
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    value={keyFeature.description || ''}
                    onChange={(e) => updateKeyFeature(index, 'description', e.target.value)}
                    placeholder="Short description"
                    size="sm"
                  />
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => removeKeyFeature(index)}
                    className="text-red-500"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
              
              {keyFeature.icon && (
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Preview:</span>
                  <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                    <Icon name={keyFeature.icon} size={16} />
                  </div>
                  <span className="text-sm font-medium">{keyFeature.title}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Benefits
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
        
        <div className="space-y-3">
          {(formData.benefits || []).map((benefit, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <Input
                  type="text"
                  value={benefit.title || ''}
                  onChange={(e) => updateBenefit(index, 'title', e.target.value)}
                  placeholder="Benefit title"
                  size="sm"
                />
                <div className="flex items-start space-x-2">
                  <textarea
                    value={benefit.description || ''}
                    onChange={(e) => updateBenefit(index, 'description', e.target.value)}
                    placeholder="Benefit description"
                    rows={2}
                    className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => removeBenefit(index)}
                    className="text-red-500 mt-1"
                  >
                    <Icon name="X" size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unique Selling Points */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Unique Selling Points
          </label>
          <Button
            variant="outline"
            size="xs"
            onClick={addUSP}
            iconName="Plus"
          >
            Add USP
          </Button>
        </div>
        
        <div className="space-y-2">
          {(formData.unique_selling_points || []).map((usp, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-green-500" />
              <Input
                type="text"
                value={usp}
                onChange={(e) => updateUSP(index, e.target.value)}
                placeholder="What makes this service unique?"
                size="sm"
              />
              <Button
                variant="ghost"
                size="xs"
                onClick={() => removeUSP(index)}
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