// src/pages/admin/services/editor-tabs/FAQTab.jsx
import React, { useState } from 'react';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AdminIcon';
import TiptapContentEditor from '../../../../components/ui/TiptapContentEditor';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { cn } from '../../../../utils';

const FAQTab = ({ formData, errors, onChange }) => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  // Handle FAQs
  const addFAQ = () => {
    const newFAQs = [...(formData.faqs || [])];
    newFAQs.push({
      question: '',
      answer: '',
      category: 'general',
      is_featured: false
    });
    onChange('faqs', newFAQs);
    setExpandedFAQ(newFAQs.length - 1);
  };

  const updateFAQ = (index, field, value) => {
    const newFAQs = [...(formData.faqs || [])];
    newFAQs[index] = { ...newFAQs[index], [field]: value };
    onChange('faqs', newFAQs);
  };

  const removeFAQ = (index) => {
    onChange('faqs', formData.faqs.filter((_, i) => i !== index));
    if (expandedFAQ === index) {
      setExpandedFAQ(null);
    }
  };

  const reorderFAQs = (startIndex, endIndex) => {
    const result = Array.from(formData.faqs || []);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    onChange('faqs', result);
  };

  const toggleExpand = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const faqCategories = [
    { value: 'general', label: 'General' },
    { value: 'pricing', label: 'Pricing' },
    { value: 'process', label: 'Process' },
    { value: 'technical', label: 'Technical' },
    { value: 'support', label: 'Support' }
  ];

  // Group FAQs by category
  const groupedFAQs = (formData.faqs || []).reduce((acc, faq, index) => {
    const category = faq.category || 'general';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push({ ...faq, originalIndex: index });
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* FAQ Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-700">
            Frequently Asked Questions
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Add common questions and answers about this service
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={addFAQ}
          iconName="Plus"
        >
          Add FAQ
        </Button>
      </div>

      {/* FAQs List */}
      <DragDropContext onDragEnd={(result) => {
        if (!result.destination) return;
        reorderFAQs(result.source.index, result.destination.index);
      }}>
        <Droppable droppableId="faqs">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
              {(formData.faqs || []).map((faq, index) => (
                <Draggable key={index} draggableId={`faq-${index}`} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={cn(
                        "bg-white border rounded-lg",
                        snapshot.isDragging ? 'shadow-lg opacity-90' : '',
                        expandedFAQ === index ? 'ring-2 ring-accent' : ''
                      )}
                    >
                      {/* FAQ Header */}
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div {...provided.dragHandleProps} className="cursor-move mt-1">
                              <Icon name="GripVertical" size={16} className="text-gray-400" />
                            </div>
                            
                            <div className="flex-1">
                              {expandedFAQ === index ? (
                                <Input
                                  type="text"
                                  value={faq.question || ''}
                                  onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                                  placeholder="Enter question..."
                                  className="font-medium"
                                />
                              ) : (
                                <button
                                  onClick={() => toggleExpand(index)}
                                  className="text-left w-full"
                                >
                                  <p className="font-medium text-text-primary">
                                    {faq.question || 'Untitled Question'}
                                  </p>
                                  {faq.answer && (
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                      {typeof faq.answer === 'object' 
                                        ? faq.answer.text?.substring(0, 100) + '...'
                                        : faq.answer.substring(0, 100) + '...'}
                                    </p>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-2">
                            {faq.is_featured && (
                              <Icon name="Star" size={16} className="text-yellow-500" />
                            )}
                            <span className={cn(
                              "text-xs px-2 py-1 rounded-full",
                              "bg-gray-100 text-gray-600"
                            )}>
                              {faqCategories.find(c => c.value === faq.category)?.label || 'General'}
                            </span>
                            <button
                              onClick={() => toggleExpand(index)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Icon 
                                name={expandedFAQ === index ? 'ChevronUp' : 'ChevronDown'} 
                                size={20} 
                              />
                            </button>
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => removeFAQ(index)}
                              className="text-red-500"
                            >
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {/* FAQ Content (Expanded) */}
                      {expandedFAQ === index && (
                        <div className="px-4 pb-4 space-y-3 border-t">
                          <div className="mt-3">
                            <label className="block text-xs text-gray-600 mb-1">
                              Answer
                            </label>
                            <TiptapContentEditor
                              content={faq.answer}
                              onChange={(content) => updateFAQ(index, 'answer', content)}
                              placeholder="Enter the answer..."
                              minHeight="150px"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">
                                Category
                              </label>
                              <select
                                value={faq.category || 'general'}
                                onChange={(e) => updateFAQ(index, 'category', e.target.value)}
                                className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                              >
                                {faqCategories.map(cat => (
                                  <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            
                            <div className="flex items-end">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={faq.is_featured || false}
                                  onChange={(e) => updateFAQ(index, 'is_featured', e.target.checked)}
                                  className="rounded"
                                />
                                <span className="text-sm">Featured FAQ</span>
                              </label>
                            </div>
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
      
      {errors.faqs && (
        <p className="text-xs text-red-500">{errors.faqs}</p>
      )}
      
      {/* Empty State */}
      {(!formData.faqs || formData.faqs.length === 0) && (
        <div className={cn(
          "text-center py-8 border-2 border-dashed rounded-lg",
          "border-gray-300"
        )}>
          <Icon name="HelpCircle" size={32} className="mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">No FAQs added yet</p>
          <Button
            variant="outline"
            size="sm"
            onClick={addFAQ}
            className="mt-2"
          >
            Add First FAQ
          </Button>
        </div>
      )}

      {/* FAQ Categories Summary */}
      {formData.faqs?.length > 0 && (
        <div className="border-t pt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">FAQ Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {faqCategories.map(category => {
              const count = groupedFAQs[category.value]?.length || 0;
              const featured = groupedFAQs[category.value]?.filter(f => f.is_featured).length || 0;
              
              return (
                <div key={category.value} className={cn(
                  "text-center p-3 rounded-lg",
                  "bg-gray-50"
                )}>
                  <div className="text-2xl font-bold text-gray-900">{count}</div>
                  <div className="text-xs text-gray-500">{category.label}</div>
                  {featured > 0 && (
                    <div className="text-xs text-yellow-600 mt-1">
                      {featured} featured
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQTab;