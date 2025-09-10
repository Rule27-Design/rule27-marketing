// src/pages/admin/services/editor-tabs/PricingTab.jsx
import React from 'react';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AdminIcon';
import { Checkbox } from '../../../../components/ui/Checkbox';
import { usePricingCalculation } from '../hooks/usePricingCalculation';

const PricingTab = ({ formData, errors, onChange }) => {
  const { calculateMonthlyPrice, formatPrice } = usePricingCalculation();

  // Handle pricing tiers
  const addPricingTier = () => {
    const newTiers = [...(formData.pricing_tiers || [])];
    newTiers.push({
      name: '',
      description: '',
      price: 0,
      billing_period: 'one-time',
      features: [],
      highlighted: false,
      button_text: 'Get Started',
      max_usage: null
    });
    onChange('pricing_tiers', newTiers);
  };

  const updatePricingTier = (index, field, value) => {
    const newTiers = [...(formData.pricing_tiers || [])];
    newTiers[index] = { ...newTiers[index], [field]: value };
    onChange('pricing_tiers', newTiers);
  };

  const removePricingTier = (index) => {
    onChange('pricing_tiers', formData.pricing_tiers.filter((_, i) => i !== index));
  };

  // Handle tier features
  const addTierFeature = (tierIndex) => {
    const newTiers = [...formData.pricing_tiers];
    if (!newTiers[tierIndex].features) {
      newTiers[tierIndex].features = [];
    }
    newTiers[tierIndex].features.push('');
    onChange('pricing_tiers', newTiers);
  };

  const updateTierFeature = (tierIndex, featureIndex, value) => {
    const newTiers = [...formData.pricing_tiers];
    newTiers[tierIndex].features[featureIndex] = value;
    onChange('pricing_tiers', newTiers);
  };

  const removeTierFeature = (tierIndex, featureIndex) => {
    const newTiers = [...formData.pricing_tiers];
    newTiers[tierIndex].features.splice(featureIndex, 1);
    onChange('pricing_tiers', newTiers);
  };

  return (
    <div className="space-y-6">
      {/* Pricing Model */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pricing Model
        </label>
        <Select
          value={formData.pricing_model || 'tiered'}
          onChange={(value) => onChange('pricing_model', value)}
          options={[
            { value: 'tiered', label: 'Tiered Pricing' },
            { value: 'fixed', label: 'Fixed Price' },
            { value: 'custom', label: 'Custom Quote' },
            { value: 'subscription', label: 'Subscription' },
            { value: 'usage', label: 'Usage-Based' }
          ]}
        />
      </div>

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
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      )}

      {/* Pricing Tiers */}
      {formData.pricing_model !== 'custom' && (
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
          
          <div className="space-y-4">
            {(formData.pricing_tiers || []).map((tier, tierIndex) => (
              <div key={tierIndex} className="p-4 bg-gray-50 rounded-lg border">
                {/* Tier Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Input
                      type="text"
                      value={tier.name || ''}
                      onChange={(e) => updatePricingTier(tierIndex, 'name', e.target.value)}
                      placeholder="Tier name (e.g., Basic)"
                      size="sm"
                    />
                    
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={tier.price || 0}
                        onChange={(e) => updatePricingTier(tierIndex, 'price', parseFloat(e.target.value))}
                        placeholder="Price"
                        size="sm"
                        min="0"
                        step="0.01"
                      />
                      <span className="text-sm text-gray-500">$</span>
                    </div>
                    
                    <Select
                      value={tier.billing_period || 'one-time'}
                      onChange={(value) => updatePricingTier(tierIndex, 'billing_period', value)}
                      options={[
                        { value: 'one-time', label: 'One-time' },
                        { value: 'monthly', label: 'Monthly' },
                        { value: 'quarterly', label: 'Quarterly' },
                        { value: 'yearly', label: 'Yearly' },
                        { value: 'per-project', label: 'Per Project' },
                        { value: 'hourly', label: 'Hourly' }
                      ]}
                      size="sm"
                    />
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => removePricingTier(tierIndex)}
                    className="text-red-500 ml-2"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
                
                {/* Tier Description */}
                <div className="mb-3">
                  <Input
                    type="text"
                    value={tier.description || ''}
                    onChange={(e) => updatePricingTier(tierIndex, 'description', e.target.value)}
                    placeholder="Brief description of this tier"
                    size="sm"
                  />
                </div>
                
                {/* Tier Options */}
                <div className="flex items-center space-x-4 mb-3">
                  <label className="flex items-center space-x-2">
                    <Checkbox
                      checked={tier.highlighted || false}
                      onChange={(checked) => updatePricingTier(tierIndex, 'highlighted', checked)}
                    />
                    <span className="text-sm">Highlight as recommended</span>
                  </label>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Button text:</span>
                    <Input
                      type="text"
                      value={tier.button_text || 'Get Started'}
                      onChange={(e) => updatePricingTier(tierIndex, 'button_text', e.target.value)}
                      size="sm"
                      className="w-32"
                    />
                  </div>
                </div>
                
                {/* Tier Features */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs text-gray-600">Features</label>
                    <button
                      onClick={() => addTierFeature(tierIndex)}
                      className="text-xs text-accent hover:text-accent/80"
                    >
                      + Add Feature
                    </button>
                  </div>
                  
                  <div className="space-y-1">
                    {(tier.features || []).map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <Icon name="Check" size={14} className="text-green-500" />
                        <Input
                          type="text"
                          value={feature}
                          onChange={(e) => updateTierFeature(tierIndex, featureIndex, e.target.value)}
                          placeholder="Feature included in this tier"
                          size="xs"
                        />
                        <button
                          onClick={() => removeTierFeature(tierIndex, featureIndex)}
                          className="text-red-500 hover:text-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Pricing Preview */}
                {tier.price > 0 && (
                  <div className="mt-3 p-3 bg-white rounded border">
                    <div className="text-xs text-gray-500 mb-1">Preview:</div>
                    <div className="text-2xl font-bold">
                      {formatPrice(tier.price)}
                      {tier.billing_period !== 'one-time' && (
                        <span className="text-sm font-normal text-gray-500">
                          /{tier.billing_period}
                        </span>
                      )}
                    </div>
                    {tier.billing_period === 'yearly' && (
                      <div className="text-xs text-gray-500">
                        ({formatPrice(calculateMonthlyPrice(tier.price, 'yearly'))}/month)
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {errors.pricing_tiers && (
            <p className="text-xs text-red-500 mt-1">{errors.pricing_tiers}</p>
          )}
        </div>
      )}

      {/* Starting Price Summary */}
      {formData.pricing_tiers?.length > 0 && (
        <div className="border-t pt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Icon name="Info" size={16} className="text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Starting at {formatPrice(Math.min(...formData.pricing_tiers.map(t => t.price)))}
                </p>
                <p className="text-xs text-blue-700">
                  This will be displayed as the starting price for this service
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingTab;