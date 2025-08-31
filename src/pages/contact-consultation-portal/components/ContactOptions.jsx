import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ContactOptions = () => {
  const contactMethods = [
    {
      icon: 'Mail',
      title: 'Email Us',
      value: 'hello@rule27.com',
      description: 'For general inquiries',
      action: 'mailto:hello@rule27.com',
      color: 'text-blue-600'
    },
    {
      icon: 'Phone',
      title: 'Call Us',
      value: '+1 (555) RULE-27',
      description: 'Mon-Fri, 9am-6pm PST',
      action: 'tel:+15557853277',
      color: 'text-green-600'
    },
    {
      icon: 'MapPin',
      title: 'Visit Us',
      value: 'Scottsdale, AZ',
      description: 'By appointment only',
      action: '#',
      color: 'text-purple-600'
    }
  ];

  const socialLinks = [
    { icon: 'Linkedin', url: 'https://www.linkedin.com/company/rule27design', label: 'LinkedIn' },
    { icon: 'Facebook', url: 'https://www.facebook.com/Rule27Design/', label: 'Facebook' },
    { icon: 'Instagram', url: 'https://www.instagram.com/rule27design', label: 'Instagram' },
    { icon: 'Github', url: 'https://github.com/rule27', label: 'GitHub' }
  ];

  return (
    <div id="contact-options" className="space-y-4 sm:space-y-6">
      {/* Quick Contact - Mobile Optimized */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-brand-md"
      >
        <h3 className="text-base sm:text-lg font-bold text-primary mb-3 sm:mb-4 flex items-center">
          <Icon name="Phone" size={18} className="text-accent mr-2 sm:w-5 sm:h-5" />
          Quick Contact
        </h3>

        <div className="space-y-2 sm:space-y-3">
          {contactMethods.map((method, index) => (
            <motion.a
              key={method.title}
              href={method.action}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3 p-2.5 sm:p-3 rounded-lg hover:bg-surface transition-colors duration-300 group"
            >
              <div className={`w-9 h-9 sm:w-10 sm:h-10 bg-surface rounded-lg flex items-center justify-center ${method.color} group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                <Icon name={method.icon} size={18} className="sm:w-5 sm:h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-primary text-xs sm:text-sm">{method.title}</div>
                <div className="text-accent text-xs sm:text-sm font-medium truncate">{method.value}</div>
                <div className="text-text-secondary text-xs">{method.description}</div>
              </div>
              <Icon name="ExternalLink" size={14} className="text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0 sm:w-4 sm:h-4" />
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Social Links - Mobile Optimized */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-accent to-primary rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white"
      >
        <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Connect on Social</h3>
        <div className="flex space-x-2 sm:space-x-3">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors duration-300"
              aria-label={social.label}
            >
              <Icon name={social.icon} size={18} className="sm:w-5 sm:h-5" />
            </a>
          ))}
        </div>
      </motion.div>

      {/* Office Hours - Mobile Optimized with overflow containment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="bg-surface rounded-xl sm:rounded-2xl p-4 sm:p-6 relative overflow-hidden"
      >
        <h3 className="text-base sm:text-lg font-bold text-primary mb-3 sm:mb-4 flex items-center">
          <Icon name="Clock" size={18} className="text-accent mr-2 sm:w-5 sm:h-5" />
          Office Hours
        </h3>
        <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between">
            <span className="text-text-secondary">Monday - Friday</span>
            <span className="font-semibold text-primary">9:00 AM - 6:00 PM PST</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Saturday</span>
            <span className="font-semibold text-primary">10:00 AM - 4:00 PM PST</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Sunday</span>
            <span className="font-semibold text-text-secondary">Closed</span>
          </div>
        </div>
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border">
          <div className="flex items-center space-x-2 text-xs sm:text-sm">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-success font-medium">Currently Open</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactOptions;