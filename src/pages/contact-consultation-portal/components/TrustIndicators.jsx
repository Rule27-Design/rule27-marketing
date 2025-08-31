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
    <section className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Industry Leaders Choose <span className="text-red-600">Rule27 Design</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. See the numbers, read the reviews, and discover why we're the partner of choice for ambitious brands.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl sm:rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                  <Icon name={stat.icon} size={24} className="text-red-600 group-hover:text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Testimonials */}
          <motion.div variants={itemVariants} className="mb-16">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8">
              Client Success Stories
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.author}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl sm:rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
                >
                  {/* Rating Stars */}
                  <div className="flex space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Icon key={i} name="Star" size={16} className="text-yellow-500 fill-current" />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-gray-600 mb-6 italic">
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
                      <div className="font-semibold text-gray-900 text-sm">{testimonial.author}</div>
                      <div className="text-gray-600 text-xs">{testimonial.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Certifications */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl p-8 shadow-md">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-6">
              Certified Excellence
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8">
              {certifications.map((cert) => (
                <motion.div
                  key={cert.name}
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center space-y-2"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Icon name={cert.icon} size={28} className="text-red-600" />
                  </div>
                  <span className="text-sm text-gray-600 font-medium text-center">{cert.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Trust Badge */}
          <motion.div
            variants={itemVariants}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center space-x-4 bg-red-50 border border-red-200 rounded-full px-6 py-4">
              <Icon name="Shield" size={24} className="text-red-600" />
              <div className="text-left">
                <div className="font-bold text-gray-900">100% Satisfaction Guarantee</div>
                <div className="text-sm text-gray-600">We deliver results or your money back</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustIndicators;