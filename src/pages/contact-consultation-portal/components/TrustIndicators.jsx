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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Section Header - Mobile Optimized */}
          <motion.div variants={itemVariants} className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3 sm:mb-4">
              Why Industry Leaders Choose <span className="text-accent">Rule27 Design</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-3xl mx-auto px-4">
              Don't just take our word for it. See the numbers, read the reviews, and discover why we're the partner of choice for ambitious brands.
            </p>
          </motion.div>

          {/* Stats Grid - Mobile 2x2 Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12 lg:mb-16">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-brand-md hover:shadow-brand-elevation transition-all duration-300 group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                  <Icon name={stat.icon} size={20} className="text-accent group-hover:text-white sm:w-6 sm:h-6" />
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-1 sm:mb-2">{stat.value}</div>
                <div className="text-xs sm:text-sm text-text-secondary">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Testimonials - Mobile Scroll */}
          <motion.div variants={itemVariants} className="mb-8 sm:mb-12 lg:mb-16">
            <h3 className="text-xl sm:text-2xl font-bold text-primary text-center mb-6 sm:mb-8">
              Client Success Stories
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.author}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-brand-md hover:shadow-brand-elevation transition-all duration-300"
                >
                  {/* Rating Stars */}
                  <div className="flex space-x-1 mb-3 sm:mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Icon key={i} name="Star" size={14} className="text-yellow-500 fill-current sm:w-4 sm:h-4" />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-text-secondary mb-4 sm:mb-6 italic text-sm sm:text-base">
                    "{testimonial.quote}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-primary text-xs sm:text-sm">{testimonial.author}</div>
                      <div className="text-text-secondary text-xs">{testimonial.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Certifications - Mobile Grid */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-brand-md">
            <h3 className="text-lg sm:text-xl font-bold text-primary text-center mb-4 sm:mb-6">
              Certified Excellence
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {certifications.map((cert) => (
                <motion.div
                  key={cert.name}
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center space-y-2"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-surface rounded-xl flex items-center justify-center">
                    <Icon name={cert.icon} size={24} className="text-accent sm:w-7 sm:h-7 md:w-8 md:h-8" />
                  </div>
                  <span className="text-xs sm:text-sm text-text-secondary font-medium text-center">{cert.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Trust Badge - Mobile Responsive */}
          <motion.div
            variants={itemVariants}
            className="mt-8 sm:mt-12 text-center px-4"
          >
            <div className="inline-flex items-center space-x-3 sm:space-x-4 bg-accent/5 border border-accent/20 rounded-full px-4 sm:px-6 md:px-8 py-3 sm:py-4">
              <Icon name="Shield" size={20} className="text-accent flex-shrink-0 sm:w-6 sm:h-6" />
              <div className="text-left">
                <div className="font-bold text-primary text-sm sm:text-base">100% Satisfaction Guarantee</div>
                <div className="text-xs sm:text-sm text-text-secondary">We deliver results or your money back</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustIndicators;