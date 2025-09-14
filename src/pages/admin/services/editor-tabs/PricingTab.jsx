// src/pages/admin/services/editor-tabs/PricingTab.jsx
import React from 'react';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AdminIcon';

const PricingTab = ({ formData, errors, onChange }) => {
  // Pricing tiers management
  const addPricingTier = () => {
    const newTier = {
      name: '',
      price: '',
      billing: 'Per month',
      features: [],
      highlighted: false,
      cta_text: 'Get Started'
    };
    onChange('pricing_tiers', [...(formData.pricing_tiers || []), newTier]);
  };

  const updatePricingTier = (index, field, value) => {
    const newTiers = [...(formData.pricing_tiers || [])];
    newTiers[index] = { ...newTiers[index], [field]: value };
    onChange('pricing_tiers', newTiers);
  };

  const removePricingTier = (index) => {
    const newTiers = [...(formData.pricing_tiers || [])];
    newTiers.splice(index, 1);
    onChange('pricing_tiers', newTiers);
  };

  // Tier features management
  const addTierFeature = (tierIndex) => {
    const newTiers = [...(formData.pricing_tiers || [])];
    newTiers[tierIndex].features = [...(newTiers[tierIndex].features || []), ''];
    onChange('pricing_tiers', newTiers);
  };

  const updateTierFeature = (tierIndex, featureIndex, value) => {
    const newTiers = [...(formData.pricing_tiers || [])];
    newTiers[tierIndex].features[featureIndex] = value;
    onChange('pricing_tiers', newTiers);
  };

  const removeTierFeature = (tierIndex, featureIndex) => {
    const newTiers = [...(formData.pricing_tiers || [])];
    newTiers[tierIndex].features.splice(featureIndex, 1);
    onChange('pricing_tiers', newTiers);
  };

  const moveTier = (fromIndex, toIndex) => {
    const newTiers = [...(formData.pricing_tiers || [])];
    const [movedItem] = newTiers.splice(fromIndex, 1);
    newTiers.splice(toIndex, 0, movedItem);
    onChange('pricing_tiers', newTiers);
  };

  return (
    <div className="space-y-6">
      {/* Pricing Tiers */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Pricing Tiers</h3>
            <p className="text-sm text-gray-500 mt-1">
              Define pricing options for this service
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={addPricingTier}
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Add Tier
          </Button>
        </div>

        {errors.pricing_tiers && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-600">{errors.pricing_tiers}</p>
          </div>
        )}

        {(formData.pricing_tiers || []).length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Icon name="DollarSign" size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600 mb-3">No pricing tiers defined</p>
            <Button
              variant="primary"
              size="sm"
              onClick={addPricingTier}
            >
              Add Your First Pricing Tier
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {formData.pricing_tiers.map((tier, tierIndex) => (
              <div 
                key={tierIndex} 
                className={`border rounded-lg p-4 ${
                  tier.highlighted ? 'border-accent bg-accent/5' : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Tier {tierIndex + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    {tierIndex > 0 && (
                      <button
                        type="button"
                        onClick={() => moveTier(tierIndex, tierIndex - 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Move left"
                      >
                        <Icon name="ChevronLeft" size={14} />
                      </button>
                    )}
                    {tierIndex < formData.pricing_tiers.length - 1 && (
                      <button
                        type="button"
                        onClick={() => moveTier(tierIndex, tierIndex + 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Move right"
                      >
                        <Icon name="ChevronRight" size={14} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removePricingTier(tierIndex)}
                      className="p-1 hover:bg-red-100 text-red-500 rounded"
                      title="Remove"
                    >
                      <Icon name="X" size={14} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Input
                    label="Tier Name"
                    value={tier.name}
                    onChange={(e) => updatePricingTier(tierIndex, 'name', e.target.value)}
                    placeholder="e.g., Basic, Pro, Enterprise"
                    required
                  />

                  <Input
                    label="Price"
                    value={tier.price}
                    onChange={(e) => updatePricingTier(tierIndex, 'price', e.target.value)}
                    placeholder="e.g., $99, Custom"
                  />

                  <Input
                    label="Billing Period"
                    value={tier.billing}
                    onChange={(e) => updatePricingTier(tierIndex, 'billing', e.target.value)}
                    placeholder="e.g., Per month, Per year"
                  />

                  <Input
                    label="CTA Button Text"
                    value={tier.cta_text || 'Get Started'}
                    onChange={(e) => updatePricingTier(tierIndex, 'cta_text', e.target.value)}
                    placeholder="e.g., Get Started, Contact Us"
                  />

                  <div>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tier.highlighted || false}
                        onChange={(e) => updatePricingTier(tierIndex, 'highlighted', e.target.checked)}
                        className="h-4 w-4 text-accent border-gray-300 rounded focus:ring-accent"
                      />
                      <span className="text-sm text-gray-700">Highlight as recommended</span>
                    </label>
                  </div>

                  {/* Tier Features */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Features
                    </label>
                    {(tier.features || []).map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex gap-1 mb-1">
                        <Input
                          value={feature}
                          onChange={(e) => updateTierFeature(tierIndex, featureIndex, e.target.value)}
                          placeholder="Feature"
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTierFeature(tierIndex, featureIndex)}
                        >
                          <Icon name="X" size={12} />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => addTierFeature(tierIndex)}
                      className="mt-1 w-full"
                    >
                      <Icon name="Plus" size={12} className="mr-1" />
                      Add Feature
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pricing Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Pricing Best Practices</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Use 3 tiers for optimal conversion (Basic, Pro, Enterprise)</li>
          <li>• Highlight your most popular tier to guide decisions</li>
          <li>• List 5-7 key features per tier for clarity</li>
          <li>• Use "Custom" or "Contact Us" for enterprise pricing</li>
          <li>• Include value propositions in feature descriptions</li>
        </ul>
      </div>
    </div>
  );
};

export default PricingTab;