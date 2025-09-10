// src/pages/admin/services/editor-tabs/ProcessTab.jsx
import React from 'react';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AdminIcon';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const ProcessTab = ({ formData, errors, onChange }) => {
  // Handle process steps
  const addProcessStep = () => {
    const newSteps = [...(formData.process_steps || [])];
    newSteps.push({
      number: newSteps.length + 1,
      title: '',
      description: '',
      duration: '',
      icon: 'Circle',
      deliverables: []
    });
    onChange('process_steps', newSteps);
  };

  const updateProcessStep = (index, field, value) => {
    const newSteps = [...(formData.process_steps || [])];
    newSteps[index] = { ...newSteps[index], [field]: value };
    onChange('process_steps', newSteps);
  };

  const removeProcessStep = (index) => {
    const newSteps = formData.process_steps.filter((_, i) => i !== index);
    // Renumber steps
    newSteps.forEach((step, i) => {
      step.number = i + 1;
    });
    onChange('process_steps', newSteps);
  };

  const reorderProcessSteps = (startIndex, endIndex) => {
    const result = Array.from(formData.process_steps || []);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    // Renumber steps
    result.forEach((step, i) => {
      step.number = i + 1;
    });
    onChange('process_steps', result);
  };

  // Handle step deliverables
  const addDeliverable = (stepIndex) => {
    const newSteps = [...formData.process_steps];
    if (!newSteps[stepIndex].deliverables) {
      newSteps[stepIndex].deliverables = [];
    }
    newSteps[stepIndex].deliverables.push('');
    onChange('process_steps', newSteps);
  };

  const updateDeliverable = (stepIndex, deliverableIndex, value) => {
    const newSteps = [...formData.process_steps];
    newSteps[stepIndex].deliverables[deliverableIndex] = value;
    onChange('process_steps', newSteps);
  };

  const removeDeliverable = (stepIndex, deliverableIndex) => {
    const newSteps = [...formData.process_steps];
    newSteps[stepIndex].deliverables.splice(deliverableIndex, 1);
    onChange('process_steps', newSteps);
  };

  return (
    <div className="space-y-6">
      {/* Timeline */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Typical Timeline
        </label>
        <Input
          type="text"
          value={formData.timeline || ''}
          onChange={(e) => onChange('timeline', e.target.value)}
          placeholder="e.g., 4-6 weeks, 2-3 months"
        />
        <p className="text-xs text-gray-500 mt-1">
          Give clients an idea of how long this service typically takes
        </p>
      </div>

      {/* Process Steps */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Process Steps
          </label>
          <Button
            variant="outline"
            size="xs"
            onClick={addProcessStep}
            iconName="Plus"
          >
            Add Step
          </Button>
        </div>
        
        <DragDropContext onDragEnd={(result) => {
          if (!result.destination) return;
          reorderProcessSteps(result.source.index, result.destination.index);
        }}>
          <Droppable droppableId="process-steps">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {(formData.process_steps || []).map((step, stepIndex) => (
                  <Draggable 
                    key={stepIndex} 
                    draggableId={`step-${stepIndex}`} 
                    index={stepIndex}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`p-4 bg-gray-50 rounded-lg border ${
                          snapshot.isDragging ? 'shadow-lg opacity-90' : ''
                        }`}
                      >
                        {/* Step Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div {...provided.dragHandleProps} className="cursor-move">
                              <Icon name="GripVertical" size={20} className="text-gray-400" />
                            </div>
                            <div className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {step.number}
                            </div>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => removeProcessStep(stepIndex)}
                            className="text-red-500"
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                        
                        {/* Step Details */}
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input
                              type="text"
                              value={step.title || ''}
                              onChange={(e) => updateProcessStep(stepIndex, 'title', e.target.value)}
                              placeholder="Step title"
                              size="sm"
                            />
                            <div className="flex items-center space-x-2">
                              <Input
                                type="text"
                                value={step.icon || ''}
                                onChange={(e) => updateProcessStep(stepIndex, 'icon', e.target.value)}
                                placeholder="Icon"
                                size="sm"
                                className="w-24"
                              />
                              <Input
                                type="text"
                                value={step.duration || ''}
                                onChange={(e) => updateProcessStep(stepIndex, 'duration', e.target.value)}
                                placeholder="Duration (e.g., 1 week)"
                                size="sm"
                              />
                            </div>
                          </div>
                          
                          <textarea
                            value={step.description || ''}
                            onChange={(e) => updateProcessStep(stepIndex, 'description', e.target.value)}
                            placeholder="Describe what happens in this step..."
                            rows={2}
                            className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                          />
                          
                          {/* Step Deliverables */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-xs text-gray-600">Deliverables</label>
                              <button
                                onClick={() => addDeliverable(stepIndex)}
                                className="text-xs text-accent hover:text-accent/80"
                              >
                                + Add
                              </button>
                            </div>
                            
                            <div className="space-y-1">
                              {(step.deliverables || []).map((deliverable, delIndex) => (
                                <div key={delIndex} className="flex items-center space-x-2">
                                  <Icon name="CheckCircle" size={14} className="text-green-500" />
                                  <Input
                                    type="text"
                                    value={deliverable}
                                    onChange={(e) => updateDeliverable(stepIndex, delIndex, e.target.value)}
                                    placeholder="What's delivered in this step?"
                                    size="xs"
                                  />
                                  <button
                                    onClick={() => removeDeliverable(stepIndex, delIndex)}
                                    className="text-red-500 hover:text-red-600"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        
        {errors.process_steps && (
          <p className="text-xs text-red-500 mt-1">{errors.process_steps}</p>
        )}
      </div>

      {/* Process Summary */}
      {formData.process_steps?.length > 0 && (
        <div className="border-t pt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Process Summary</h3>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">
                  {formData.process_steps.length} Steps
                </p>
                <p className="text-xs text-blue-700">
                  Timeline: {formData.timeline || 'Not specified'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-blue-700">Total Deliverables:</p>
                <p className="text-lg font-bold text-blue-900">
                  {formData.process_steps.reduce((sum, step) => 
                    sum + (step.deliverables?.length || 0), 0
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessTab;