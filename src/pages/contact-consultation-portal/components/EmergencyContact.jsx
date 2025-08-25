import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmergencyContact = () => {
  const [showEmergencyForm, setShowEmergencyForm] = useState(false);
  const [urgencyLevel, setUrgencyLevel] = useState('');

  const urgencyOptions = [
    {
      level: 'critical',
      title: 'Critical - Launch Emergency',
      description: 'Website down, security breach, or launch-day issues',
      icon: 'AlertTriangle',
      color: 'text-red-600 bg-red-50',
      response: 'Immediate response within 15 minutes',
      contact: '+1 (555) RULE-911'
    },
    {
      level: 'urgent',
      title: 'Urgent - Business Impact',
      description: 'Major bugs, broken features, or campaign issues',
      icon: 'Clock',
      color: 'text-orange-600 bg-orange-50',
      response: 'Response within 1 hour',
      contact: '+1 (555) RULE-SOS'
    },
    {
      level: 'standard',
      title: 'Standard - Support Needed',
      description: 'Questions, minor issues, or general support',
      icon: 'MessageCircle',
      color: 'text-blue-600 bg-blue-50',
      response: 'Response within 4 hours',
      contact: 'support@rule27design.com'
    }
  ];

  const handleEmergencySubmit = () => {
    // Handle emergency submission
    console.log('Emergency request submitted:', urgencyLevel);
    // In production, this would trigger immediate notifications
  };

  return (
    <div className="space-y-6">
      {/* Emergency Hotline Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
            <Icon name="Phone" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold">24/7 Emergency Hotline</h3>
            <p className="text-white/80 text-sm">For critical issues only</p>
          </div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold mb-1">+1 (555) RULE-911</div>
              <div className="text-sm text-white/80">Direct line to on-call team</div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="bg-white text-red-600 hover:bg-white/90"
              iconName="Phone"
              iconPosition="left"
              onClick={() => window.location.href = 'tel:+15557853911'}
            >
              Call Now
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm text-white/80">
          <Icon name="Info" size={16} />
          <span>Average response time: &lt;15 minutes for critical issues</span>
        </div>
      </motion.div>

      {/* Urgency Assessment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-brand-md"
      >
        <h3 className="text-lg font-bold text-primary mb-4 flex items-center">
          <Icon name="AlertCircle" size={20} className="text-accent mr-2" />
          Assess Your Urgency Level
        </h3>

        {!showEmergencyForm ? (
          <div className="space-y-3">
            {urgencyOptions?.map((option, index) => (
              <motion.button
                key={option?.level}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  setUrgencyLevel(option?.level);
                  setShowEmergencyForm(true);
                }}
                className="w-full text-left p-4 rounded-lg border border-border hover:border-accent transition-all duration-300 group"
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${option?.color} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon name={option?.icon} size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-primary mb-1">{option?.title}</h4>
                    <p className="text-sm text-text-secondary mb-2">{option?.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-accent font-medium">{option?.response}</span>
                      <Icon name="ArrowRight" size={16} className="text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Icon name="AlertTriangle" size={20} className="text-accent" />
                <span className="font-semibold text-primary">
                  {urgencyOptions?.find(o => o?.level === urgencyLevel)?.title}
                </span>
              </div>
              <p className="text-sm text-text-secondary mb-3">
                Based on your selection, here's the best way to reach us:
              </p>
              <div className="bg-white rounded-lg p-3">
                <div className="font-semibold text-accent text-lg mb-1">
                  {urgencyOptions?.find(o => o?.level === urgencyLevel)?.contact}
                </div>
                <div className="text-sm text-text-secondary">
                  {urgencyOptions?.find(o => o?.level === urgencyLevel)?.response}
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="default"
                className="flex-1 bg-accent hover:bg-accent/90"
                iconName="Phone"
                iconPosition="left"
                onClick={handleEmergencySubmit}
              >
                Contact Support
              </Button>
              <Button
                variant="outline"
                className="border-accent text-accent hover:bg-accent hover:text-white"
                onClick={() => {
                  setShowEmergencyForm(false);
                  setUrgencyLevel('');
                }}
              >
                Back
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Support Availability */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="bg-surface rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-primary mb-4 flex items-center">
          <Icon name="Users" size={20} className="text-accent mr-2" />
          Support Team Status
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-primary">Technical Support</span>
            </div>
            <span className="text-sm text-green-600 font-medium">Available</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-primary">Account Management</span>
            </div>
            <span className="text-sm text-green-600 font-medium">Available</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm font-medium text-primary">Creative Team</span>
            </div>
            <span className="text-sm text-yellow-600 font-medium">Limited (2hr delay)</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-900">
              <strong>Pro Tip:</strong> For fastest response, use the emergency hotline for critical issues or schedule a callback for non-urgent matters.
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EmergencyContact;