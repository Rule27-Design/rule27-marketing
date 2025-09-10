// src/pages/admin/services/editor-tabs/PricingTab.jsx
import React, { useState } from 'react';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AdminIcon';
import { Checkbox } from '../../../../components/ui/Checkbox';
import { cn } from '../../../../utils';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const PricingTab = ({ formData, errors, onChange }) => {
  const [expandedTier, setExpandedTier] = useState(null);

  const pricingModels = [
    { value: 'fixed', label: 'Fixed Price' },
    { value: 'tiered', label: 'Tiered Pricing' },
    { value: 'subscription', label: 'Subscription' },
    { value: 'custom', label: 'Custom Quote' }
  ];

  const billingPeriods = [
    { value: 'one-time', label: 'One Time' },
    { value: 'hourly', label: 'Per Hour' },
    { value: 'monthly', label: 'Per Month' },
    { value: 'quarterly', label: 'Per Quarter' },
    { value: 'yearly', label: 'Per Year' },
    { value: 'project', label: 'Per Project' }
  ];

  // Handle Pricing Tiers
  const addPricingTier = () => {
    const newTiers = [...(formData.pricing_tiers || [])];
    newTiers.push({
      name: '',
      price: 0,
      billing_period: 'monthly',
      description: '',
      features: [],
      is_popular: false,
      is_featured: false,
      max_users: null,
      setup_fee: null
    });
    onChange('pricing_tiers', newTiers);
    setExpandedTier(newTiers.length - 1);
  };

  const updatePricingTier = (index, field, value) => {
    const newTiers = [...(formData.pricing_tiers || [])];
    newTiers[index] = { ...newTiers[index], [field]: value };
    onChange('pricing_tiers', newTiers);
  };

  const removePricingTier = (index) => {
    onChange('pricing_tiers', formData.pricing_tiers.filter((_, i) => i !== index));
    if (expandedTier === index) {
      setExpandedTier(null);
    }
  };

  const reorderPricingTiers = (startIndex, endIndex) => {
    const result = Array.from(formData.pricing_tiers || []);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    onChange('pricing_tiers', result);
  };

  // Handle tier features
  const addTierFeature = (tierIndex, feature) => {
    if (!feature.trim()) return;
    
    const newTiers = [...(formData.pricing_tiers || [])];
    const currentFeatures = newTiers[tierIndex].features || [];
    newTiers[tierIndex].features = [...currentFeatures, feature];
    onChange('pricing_tiers', newTiers);
  };

  const removeTierFeature = (tierIndex, featureIndex) => {
    const newTiers = [...(formData.pricing_tiers || [])];
    newTiers[tierIndex].features = newTiers[tierIndex].features.filter((_, i) => i !== featureIndex);
    onChange('pricing_tiers', newTiers);
  };

  return (
    <div className="space-y-6">
      {/* Pricing Model */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pricing Model *
        </label>
        <Select
          value={formData.pricing_model || 'tiered'}
          onChange={(value) => onChange('pricing_model', value)}
          options={pricingModels}
        />
      </div>

      {/* Starting Price (for display) */}
      {formData.pricing_model !== 'custom' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Starting Price
            </label>
            <Input
              type="number"
              value={formData.starting_price || ''}
              onChange={(e) => onChange('starting_price', parseFloat(e.target.value))}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pricing Unit
            </label>
            <Input
              type="text"
              value={formData.pricing_unit || ''}
              onChange={(e) => onChange('pricing_unit', e.target.value)}
              placeholder="e.g., per user, per month"
            />
          </div>
        </div>
      )}

      {/* Pricing Tiers */}
      {formData.pricing_model === 'tiered' && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">
              Pricing Tiers
            </label>
            <Button
              variant="outline"
              size="xs"
              onClick={addPricingTier}
              iconName="Plus"
            >
              Add Tier
            </Button>
          </div>
          
          <DragDropContext onDragEnd={(result) => {
            if (!result.destination) return;
            reorderPricingTiers(result.source.index, result.destination.index);
          }}>
            <Droppable droppableId="pricing-tiers">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                  {(formData.pricing_tiers || []).map((tier, index) => (
                    <Draggable key={index} draggableId={`tier-${index}`} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={cn(
                            "border rounded-lg bg-white",
                            snapshot.isDragging ? 'shadow-lg' : '',
                            expandedTier === index ? 'ring-2 ring-accent' : '',
                            tier.is_popular ? 'border-accent' : ''
                          )}
                        >
                          <div
                            className="p-4 cursor-pointer"
                            onClick={() => setExpandedTier(expandedTier === index ? null : index)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div {...provided.dragHandleProps}>
                                  <Icon name="GripVertical" size={16} className="text-gray-400" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    {tier.name || 'Untitled Tier'}
                                  </h4>
                                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <span>${tier.price || 0}</span>
                                    <span>/</span>
                                    <span>{tier.billing_period}</span>
                                    {tier.is_popular && (
                                      <span className="px-2 py-0.5 bg-accent text-white text-xs rounded-full">
                                        Popular
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <Icon
                                name={expandedTier === index ? 'ChevronUp' : 'ChevronDown'}
                                size={16}
                              />
                            </div>
                          </div>
                          
                          {expandedTier === index && (
                            <div className="px-4 pb-4 border-t space-y-3">
                              <div className="grid grid-cols-2 gap-3 mt-3">
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">Tier Name</label>
                                  <Input
                                    type="text"
                                    value={tier.name || ''}
                                    onChange={(e) => updatePricingTier(index, 'name', e.target.value)}
                                    placeholder="e.g., Starter"
                                    size="sm"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">Price</label>
                                  <Input
                                    type="number"
                                    value={tier.price || ''}
                                    onChange={(e) => updatePricingTier(index, 'price', parseFloat(e.target.value))}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    size="sm"
                                  />
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">Billing Period</label>
                                  <Select
                                    value={tier.billing_period || 'monthly'}
                                    onChange={(value) => updatePricingTier(index, 'billing_period', value)}
                                    options={billingPeriods}
                                    size="sm"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">Setup Fee</label>
                                  <Input
                                    type="number"
                                    value={tier.setup_fee || ''}
                                    onChange={(e) => updatePricingTier(index, 'setup_fee', parseFloat(e.target.value))}
                                    placeholder="Optional"
                                    min="0"
                                    step="0.01"
                                    size="sm"
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Description</label>
                                <textarea
                                  value={tier.description || ''}
                                  onChange={(e) => updatePricingTier(index, 'description', e.target.value)}
                                  placeholder="Brief description of this tier"
                                  rows={2}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Features</label>
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Input
                                      type="text"
                                      placeholder="Add feature..."
                                      size="sm"
                                      onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          addTierFeature(index, e.target.value);
                                          e.target.value = '';
                                        }
                                      }}
                                    />
                                  </div>
                                  
                                  {tier.features?.length > 0 && (
                                    <ul className="space-y-1">
                                      {tier.features.map((feature, fIdx) => (
                                        <li key={fIdx} className="flex items-center justify-between text-sm">
                                          <span className="flex items-center">
                                            <Icon name="Check" size={14} className="text-green-500 mr-2" />
                                            {feature}
                                          </span>
                                          <button
                                            onClick={() => removeTierFeature(index, fIdx)}
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
                              
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Max Users</label>
                                <Input
                                  type="number"
                                  value={tier.max_users || ''}
                                  onChange={(e) => updatePricingTier(index, 'max_users', parseInt(e.target.value))}
                                  placeholder="Unlimited"
                                  min="1"
                                  size="sm"
                                />
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="space-x-4">
                                  <label className="inline-flex items-center">
                                    <Checkbox
                                      checked={tier.is_popular || false}
                                      onChange={(checked) => updatePricingTier(index, 'is_popular', checked)}
                                    />
                                    <span className="ml-2 text-sm">Popular</span>
                                  </label>
                                  
                                  <label className="inline-flex items-center">
                                    <Checkbox
                                      checked={tier.is_featured || false}
                                      onChange={(checked) => updatePricingTier(index, 'is_featured', checked)}
                                    />
                                    <span className="ml-2 text-sm">Featured</span>
                                  </label>
                                </div>
                                
                                <Button
                                  variant="ghost"
                                  size="xs"
                                  onClick={() => removePricingTier(index)}
                                  className="text-red-500"
                                >
                                  Remove Tier
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
          
          {(!formData.pricing_tiers || formData.pricing_tiers.length === 0) && (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <Icon name="DollarSign" size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">No pricing tiers added yet</p>
              <Button
                variant="outline"
                size="sm"
                onClick={addPricingTier}
                className="mt-2"
              >
                Add First Tier
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Custom Pricing Note */}
      {formData.pricing_model === 'custom' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Pricing Note
          </label>
          <textarea
            value={formData.custom_pricing_note || ''}
            onChange={(e) => onChange('custom_pricing_note', e.target.value)}
            placeholder="Explain how custom pricing works for this service..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      )}

      {/* Payment Terms */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Terms
        </label>
        <textarea
          value={formData.payment_terms || ''}
          onChange={(e) => onChange('payment_terms', e.target.value)}
          placeholder="e.g., 50% upfront, 50% on completion"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
    </div>
  );
};

export default PricingTab;