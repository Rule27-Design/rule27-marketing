// src/pages/contact-consultation-portal/components/TrustIndicators.jsx
import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TrustIndicators = () => {
  const stats = [
    { value: '150+', label: 'Projects Completed', icon: 'Briefcase' },
    { value: '98%', label: 'Client Satisfaction', icon: 'Heart' },
    { value: '24hr', label: 'Response Time', icon: 'Clock' },
    { value: '8+', label: 'Years Experience', icon: 'Award' }
  ];

  const testimonials = [
    {
      quote: "Rule27 Design didn't just meet our expectations—they shattered them. Our 400% growth speaks for itself.",
      author: 'Sarah Chen',
      role: 'CEO, TechFlow Solutions',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      rating: 5
    },
    {
      quote: "The most innovative and results-driven agency we've ever worked with. They're true game-changers.",
      author: 'Marcus Rodriguez',
      role: 'CMO, EcoVibe',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 5
    },
    {
      quote: "Their strategic approach and flawless execution transformed our entire business model.",
      author: 'Jennifer Walsh',
      role: 'Founder, PayStream',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      rating: 5
    }
  ];

  const certifications = [
    { name: 'Google Partner', icon: 'Shield' },
    { name: 'Adobe Certified', icon: 'Award' },
    { name: 'AWS Partner', icon: 'Cloud' },
    { name: 'ISO 27001', icon: 'Lock' }
  ];

  return (
    <section className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading-regular text-primary mb-4 uppercase tracking-wider">
            Why Industry Leaders Choose
            <span className="text-accent block mt-2 font-heading-regular uppercase">Rule27 Design</span>
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto font-sans">
            Don't just take our word for it. See the numbers, read the reviews, and discover why we're the partner of choice for ambitious brands.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white rounded-xl sm:rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name={stat.icon} size={24} className="text-accent" />
              </div>
              <div className="text-2xl sm:text-3xl font-heading-regular text-primary mb-2 uppercase tracking-wider">
                {stat.value}
              </div>
              <div className="text-sm text-text-secondary font-sans">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h3 className="text-2xl sm:text-3xl font-heading-regular text-primary text-center mb-8 uppercase tracking-wider">
            Client Success Stories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white rounded-xl sm:rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
              >
                {/* Rating Stars */}
                <div className="flex space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Icon key={i} name="Star" size={16} className="text-yellow-500 fill-current" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-text-secondary mb-6 italic font-sans">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center space-x-3">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-heading-regular text-primary text-sm uppercase tracking-wider">
                      {testimonial.author}
                    </div>
                    <div className="text-text-secondary text-xs font-sans">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-white rounded-2xl p-8 shadow-md">
          <h3 className="text-xl sm:text-2xl font-heading-regular text-primary text-center mb-6 uppercase tracking-wider">
            Certified Excellence
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8">
            {certifications.map((cert) => (
              <div
                key={cert.name}
                className="flex flex-col items-center space-y-2"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-accent hover:text-white transition-all duration-300">
                  <Icon name={cert.icon} size={28} className="text-accent hover:text-white" />
                </div>
                <span className="text-sm text-text-secondary font-sans font-medium text-center">
                  {cert.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-4 bg-accent/5 border border-accent/20 rounded-full px-6 py-4">
            <Icon name="Shield" size={24} className="text-accent" />
            <div className="text-left">
              <div className="font-heading-regular text-primary uppercase tracking-wider">
                100% Satisfaction Guarantee
              </div>
              <div className="text-sm text-text-secondary font-sans">
                We deliver results or your money back
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;