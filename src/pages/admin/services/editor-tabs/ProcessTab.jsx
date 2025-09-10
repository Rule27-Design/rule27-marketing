// src/pages/admin/services/editor-tabs/ProcessTab.jsx
import React, { useState } from 'react';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AdminIcon';
import TiptapContentEditor from '../../../../components/ui/TiptapContentEditor';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { cn } from '../../../../utils';

const ProcessTab = ({ formData, errors, onChange }) => {
  const [expandedStep, setExpandedStep] = useState(null);

  // Handle Process Steps
  const addProcessStep = () => {
    const newSteps = [...(formData.process_steps || [])];
    newSteps.push({
      step_number: newSteps.length + 1,
      title: '',
      description: '',
      duration: '',
      deliverables: [],
      is_milestone: false
    });
    onChange('process_steps', newSteps);
    setExpandedStep(newSteps.length - 1);
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
      step.step_number = i + 1;
    });
    onChange('process_steps', newSteps);
    if (expandedStep === index) {
      setExpandedStep(null);
    }
  };

  const reorderProcessSteps = (startIndex, endIndex) => {
    const result = Array.from(formData.process_steps || []);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    // Renumber steps
    result.forEach((step, i) => {
      step.step_number = i + 1;
    });
    onChange('process_steps', result);
  };

  // Handle step deliverables
  const addStepDeliverable = (stepIndex, deliverable) => {
    if (!deliverable.trim()) return;
    
    const newSteps = [...(formData.process_steps || [])];
    const currentDeliverables = newSteps[stepIndex].deliverables || [];
    newSteps[stepIndex].deliverables = [...currentDeliverables, deliverable];
    onChange('process_steps', newSteps);
  };

  const removeStepDeliverable = (stepIndex, deliverableIndex) => {
    const newSteps = [...(formData.process_steps || [])];
    newSteps[stepIndex].deliverables = 
      newSteps[stepIndex].deliverables.filter((_, i) => i !== deliverableIndex);
    onChange('process_steps', newSteps);
  };

  // Handle global deliverables
  const addDeliverable = () => {
    const newDeliverables = [...(formData.deliverables || [])];
    newDeliverables.push({ title: '', description: '', type: 'document' });
    onChange('deliverables', newDeliverables);
  };

  const updateDeliverable = (index, field, value) => {
    const newDeliverables = [...(formData.deliverables || [])];
    newDeliverables[index] = { ...newDeliverables[index], [field]: value };
    onChange('deliverables', newDeliverables);
  };

  const removeDeliverable = (index) => {
    onChange('deliverables', formData.deliverables.filter((_, i) => i !== index));
  };

  const deliverableTypes = [
    { value: 'document', label: 'Document' },
    { value: 'code', label: 'Code/Software' },
    { value: 'design', label: 'Design Files' },
    { value: 'report', label: 'Report' },
    { value: 'presentation', label: 'Presentation' },
    { value: 'other', label: 'Other' }
  ];

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
      </div>

      {/* Process Steps */}
      <div>
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
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                {(formData.process_steps || []).map((step, index) => (
                  <Draggable key={index} draggableId={`step-${index}`} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          "border rounded-lg bg-white",
                          snapshot.isDragging ? 'shadow-lg' : '',
                          expandedStep === index ? 'ring-2 ring-accent' : '',
                          step.is_milestone ? 'border-l-4 border-l-accent' : ''
                        )}
                      >
                        <div
                          className="p-4 cursor-pointer"
                          onClick={() => setExpandedStep(expandedStep === index ? null : index)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div {...provided.dragHandleProps}>
                                <Icon name="GripVertical" size={16} className="text-gray-400" />
                              </div>
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white font-semibold text-sm">
                                {step.step_number}
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {step.title || 'Untitled Step'}
                                </h4>
                                {step.duration && (
                                  <span className="text-xs text-gray-500">
                                    Duration: {step.duration}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {step.is_milestone && (
                                <Icon name="Flag" size={16} className="text-accent" />
                              )}
                              <Icon
                                name={expandedStep === index ? 'ChevronUp' : 'ChevronDown'}
                                size={16}
                              />
                            </div>
                          </div>
                        </div>
                        
                        {expandedStep === index && (
                          <div className="px-4 pb-4 border-t space-y-3">
                            <div className="grid grid-cols-2 gap-3 mt-3">
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Step Title</label>
                                <Input
                                  type="text"
                                  value={step.title || ''}
                                  onChange={(e) => updateProcessStep(index, 'title', e.target.value)}
                                  placeholder="e.g., Discovery & Planning"
                                  size="sm"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Duration</label>
                                <Input
                                  type="text"
                                  value={step.duration || ''}
                                  onChange={(e) => updateProcessStep(index, 'duration', e.target.value)}
                                  placeholder="e.g., 1 week"
                                  size="sm"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Description</label>
                              <TiptapContentEditor
                                content={step.description}
                                onChange={(content) => updateProcessStep(index, 'description', content)}
                                placeholder="Describe what happens in this step..."
                                minHeight="100px"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Deliverables</label>
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Input
                                    type="text"
                                    placeholder="Add deliverable..."
                                    size="sm"
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addStepDeliverable(index, e.target.value);
                                        e.target.value = '';
                                      }
                                    }}
                                  />
                                </div>
                                
                                {step.deliverables?.length > 0 && (
                                  <ul className="space-y-1">
                                    {step.deliverables.map((deliverable, dIdx) => (
                                      <li key={dIdx} className="flex items-center justify-between text-sm bg-gray-50 px-2 py-1 rounded">
                                        <span>• {deliverable}</span>
                                        <button
                                          onClick={() => removeStepDeliverable(index, dIdx)}
                                          className="text-red-500 hover:text-red-600"
                                        >
                                          ×
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <label className="flex items-center space-x-2">
                                <Checkbox
                                  checked={step.is_milestone || false}
                                  onChange={(checked) => updateProcessStep(index, 'is_milestone', checked)}
                                />
                                <span className="text-sm">Mark as milestone</span>
                              </label>
                              
                              <Button
                                variant="ghost"
                                size="xs"
                                onClick={() => removeProcessStep(index)}
                                className="text-red-500"
                              >
                                Remove Step
                              </Button>
                            </div>
                          </div>
                        )}
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

      {/* Final Deliverables */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Final Deliverables
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
        
        <div className="space-y-3">
          {(formData.deliverables || []).map((deliverable, index) => (
            <div key={index} className={cn(
              "p-3 border rounded-lg",
              "bg-gray-50"
            )}>
              <div className="grid grid-cols-3 gap-3">
                <Input
                  type="text"
                  value={deliverable.title || ''}
                  onChange={(e) => updateDeliverable(index, 'title', e.target.value)}
                  placeholder="Deliverable title"
                  size="sm"
                />
                <Input
                  type="text"
                  value={deliverable.description || ''}
                  onChange={(e) => updateDeliverable(index, 'description', e.target.value)}
                  placeholder="Description"
                  size="sm"
                />
                <div className="flex items-center space-x-2">
                  <select
                    value={deliverable.type || 'document'}
                    onChange={(e) => updateDeliverable(index, 'type', e.target.value)}
                    className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    {deliverableTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => removeDeliverable(index)}
                    className="text-red-500"
                  >
                    <Icon name="X" size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProcessTab;