// src/pages/contact-consultation-portal/components/ContactOptions.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ContactOptions = () => {
  const [hoveredMethod, setHoveredMethod] = useState(null);
  const [isBusinessHours, setIsBusinessHours] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const contactMethods = [
    {
      id: 'email',
      icon: 'Mail',
      title: 'Email Us',
      value: 'hello@rule27design.com',
      description: 'For general inquiries',
      action: 'mailto:hello@rule27design.com',
      color: 'from-blue-500 to-cyan-500',
      responseTime: '< 24 hours',
      available: true
    },
    {
      id: 'phone',
      icon: 'Phone',
      title: 'Call Us',
      value: '+1 (555) RULE-27',
      description: 'Mon-Fri, 9am-6pm PST',
      action: 'tel:+15557853277',
      color: 'from-green-500 to-emerald-500',
      responseTime: 'Immediate',
      available: isBusinessHours
    },
    {
      id: 'chat',
      icon: 'MessageCircle',
      title: 'Live Chat',
      value: 'Start a conversation',
      description: 'Quick questions',
      action: '#',
      color: 'from-purple-500 to-pink-500',
      responseTime: '< 5 minutes',
      available: true
    },
    {
      id: 'location',
      icon: 'MapPin',
      title: 'Visit Us',
      value: 'Scottsdale, AZ',
      description: 'By appointment only',
      action: '#',
      color: 'from-orange-500 to-red-500',
      responseTime: 'Schedule visit',
      available: true
    }
  ];

  const socialLinks = [
    { icon: 'Linkedin', url: 'https://www.linkedin.com/company/rule27design', label: 'LinkedIn' },
    { icon: 'Facebook', url: 'https://www.facebook.com/Rule27Design/', label: 'Facebook' },
    { icon: 'Instagram', url: 'https://www.instagram.com/rule27design', label: 'Instagram' },
    { icon: 'Github', url: 'https://github.com/rule27', label: 'GitHub' }
  ];

  const officeHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM PST', isOpen: true },
    { day: 'Saturday', hours: '10:00 AM - 4:00 PM PST', isOpen: true },
    { day: 'Sunday', hours: 'Closed', isOpen: false }
  ];

  // Check business hours
  useEffect(() => {
    const checkBusinessHours = () => {
      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours();
      
      if (day === 0) {
        setIsBusinessHours(false); // Sunday
      } else if (day === 6) {
        setIsBusinessHours(hour >= 10 && hour < 16); // Saturday
      } else {
        setIsBusinessHours(hour >= 9 && hour < 18); // Weekday
      }
    };

    checkBusinessHours();
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      checkBusinessHours();
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Quick Contact Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-brand-md hover:shadow-brand-elevation-lg transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-heading-regular text-primary flex items-center uppercase tracking-wider">
            <Icon name="Phone" size={18} className="text-accent mr-2 sm:w-5 sm:h-5" />
            Quick Contact
          </h3>
          <span className={`text-xs font-heading-regular uppercase tracking-wider ${
            isBusinessHours ? 'text-success' : 'text-warning'
          }`}>
            {isBusinessHours ? 'Available Now' : 'After Hours'}
          </span>
        </div>

        {/* Contact Methods List - Single Column */}
        <div className="grid grid-cols-1 gap-2 sm:gap-3">
          {contactMethods.map((method) => (
            <a
              key={method.id}
              href={method.action}
              className="group"
              onMouseEnter={() => setHoveredMethod(method.id)}
              onMouseLeave={() => setHoveredMethod(null)}
            >
              <div className={`flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg hover:bg-surface transition-all duration-300 ${
                hoveredMethod === method.id ? 'bg-surface' : ''
              }`}>
                {/* Icon */}
                <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${method.color} rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
                  <Icon name={method.icon} size={20} className="sm:w-6 sm:h-6" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="font-heading-regular text-primary text-sm sm:text-base uppercase tracking-wider">
                      {method.title}
                    </div>
                    {method.available && (
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    )}
                  </div>
                  <div className="text-accent text-sm sm:text-base font-heading-regular truncate uppercase tracking-wider">
                    {method.value}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-text-secondary text-xs sm:text-sm font-sans">{method.description}</div>
                    {hoveredMethod === method.id && (
                      <div className="text-xs sm:text-sm text-accent font-sans">
                        {method.responseTime}
                      </div>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                {hoveredMethod === method.id && (
                  <Icon name="ArrowRight" size={16} className="text-accent" />
                )}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Social Links Card */}
      <div className="bg-gradient-to-r from-accent to-accent rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
        <h3 className="text-base sm:text-lg font-heading-regular mb-3 sm:mb-4 uppercase tracking-wider">
          Connect on Social
        </h3>
        
        <div className="flex space-x-2 sm:space-x-3">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg flex items-center justify-center transition-all duration-300"
              aria-label={social.label}
            >
              <Icon name={social.icon} size={18} className="sm:w-5 sm:h-5" />
            </a>
          ))}
        </div>

        {/* Message */}
        <div className="mt-4 flex items-center space-x-2 text-xs sm:text-sm opacity-90">
          <Icon name="Heart" size={14} className="text-white" />
          <span className="font-sans">Join our community of innovators</span>
        </div>
      </div>

      {/* Office Hours Card */}
      <div className="bg-surface rounded-xl sm:rounded-2xl p-4 sm:p-6">
        {/* Header */}
        <h3 className="text-base sm:text-lg font-heading-regular text-primary mb-3 sm:mb-4 flex items-center uppercase tracking-wider">
          <Icon name="Clock" size={18} className="text-accent mr-2 sm:w-5 sm:h-5" />
          Office Hours
        </h3>

        {/* Hours list */}
        <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
          {officeHours.map((schedule) => (
            <div key={schedule.day} className="flex justify-between items-center">
              <span className="text-text-secondary font-sans">{schedule.day}</span>
              <span className={`font-heading-regular uppercase tracking-wider ${
                schedule.isOpen ? 'text-primary' : 'text-text-secondary'
              }`}>
                {schedule.hours}
              </span>
            </div>
          ))}
        </div>

        {/* Live status */}
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs sm:text-sm">
              <div className={`w-2 h-2 rounded-full ${
                isBusinessHours ? 'bg-success animate-pulse' : 'bg-warning'
              }`} />
              <span className={`font-heading-regular uppercase tracking-wider ${
                isBusinessHours ? 'text-success' : 'text-warning'
              }`}>
                {isBusinessHours ? 'Currently Open' : 'Currently Closed'}
              </span>
            </div>
            <span className="text-xs text-text-secondary font-sans">
              {currentTime.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                timeZone: 'America/Los_Angeles'
              })} PST
            </span>
          </div>
        </div>

        {/* CTA Button 
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full border-accent text-accent hover:bg-accent hover:text-white transition-all duration-300 font-heading-regular uppercase tracking-wider"
            iconName="Calendar"
            iconPosition="left"
          >
            Schedule a Call
          </Button>
        </div>*/}
      </div>
    </div>
  );
};

export default ContactOptions;