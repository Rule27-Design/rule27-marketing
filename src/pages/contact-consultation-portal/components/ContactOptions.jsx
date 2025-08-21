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
      action: 'tel:+15557853927',
      color: 'text-green-600'
    },
    {
      icon: 'MessageCircle',
      title: 'Live Chat',
      value: 'Available Now',
      description: 'Instant responses',
      action: '#',
      color: 'text-accent'
    },
    {
      icon: 'MapPin',
      title: 'Visit Us',
      value: 'Los Angeles, CA',
      description: 'By appointment only',
      action: '#',
      color: 'text-purple-600'
    }
  ];

  const socialLinks = [
    { icon: 'Linkedin', url: '#', label: 'LinkedIn' },
    { icon: 'Twitter', url: '#', label: 'Twitter' },
    { icon: 'Instagram', url: '#', label: 'Instagram' },
    { icon: 'Github', url: '#', label: 'GitHub' }
  ];

  return (
    <div id="contact-options" className="space-y-6">
      {/* Quick Contact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-2xl p-6 shadow-brand-md"
      >
        <h3 className="text-lg font-bold text-primary mb-4 flex items-center">
          <Icon name="Phone" size={20} className="text-accent mr-2" />
          Quick Contact
        </h3>

        <div className="space-y-3">
          {contactMethods.map((method, index) => (
            <motion.a
              key={method.title}
              href={method.action}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-surface transition-colors duration-300 group"
            >
              <div className={`w-10 h-10 bg-surface rounded-lg flex items-center justify-center ${method.color} group-hover:scale-110 transition-transform duration-300`}>
                <Icon name={method.icon} size={20} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-primary text-sm">{method.title}</div>
                <div className="text-accent text-sm font-medium">{method.value}</div>
                <div className="text-text-secondary text-xs">{method.description}</div>
              </div>
              <Icon name="ExternalLink" size={16} className="text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Social Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-accent to-primary rounded-2xl p-6 text-white"
      >
        <h3 className="text-lg font-bold mb-4">Connect on Social</h3>
        <div className="flex space-x-3">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.url}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors duration-300"
              aria-label={social.label}
            >
              <Icon name={social.icon} size={20} />
            </a>
          ))}
        </div>
      </motion.div>

      {/* Office Hours */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="bg-surface rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-primary mb-4 flex items-center">
          <Icon name="Clock" size={20} className="text-accent mr-2" />
          Office Hours
        </h3>
        <div className="space-y-2 text-sm">
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
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-success font-medium">Currently Open</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactOptions;