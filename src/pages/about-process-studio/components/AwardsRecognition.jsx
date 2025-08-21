import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppIcon from '../../../components/AppIcon';

const AwardsRecognition = () => {
  const [activeCategory, setActiveCategory] = useState('awards');
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);

  const recognitionData = {
    awards: [
      {
        id: 1,
        title: 'Digital Agency of the Year',
        organization: 'Web Excellence Awards',
        year: '2024',
        category: 'Industry Leadership',
        description: 'Recognized for revolutionary approach to digital experiences and client results.',
        icon: 'Award',
        color: 'from-yellow-400 to-orange-500'
      },
      {
        id: 2,
        title: 'Innovation in UX Design',
        organization: 'UX Design Institute',
        year: '2024',
        category: 'Design Excellence',
        description: 'Honored for pushing boundaries in user experience and interface innovation.',
        icon: 'Palette',
        color: 'from-purple-500 to-pink-500'
      },
      {
        id: 3,
        title: 'Best Creative Campaign',
        organization: 'Creative Marketing Awards',
        year: '2023',
        category: 'Creative Excellence',
        description: 'Awarded for the "Break Your Rules" campaign that redefined industry standards.',
        icon: 'Lightbulb',
        color: 'from-blue-500 to-cyan-500'
      },
      {
        id: 4,
        title: 'Tech Innovation Leader',
        organization: 'Digital Innovation Summit',
        year: '2023',
        category: 'Technology',
        description: 'Recognized for integrating cutting-edge AI and emerging technologies.',
        icon: 'Cpu',
        color: 'from-green-500 to-teal-500'
      }
    ],
    certifications: [
      {
        id: 1,
        title: 'Google Premier Partner',
        organization: 'Google',
        year: 'Current',
        category: 'Digital Marketing',
        description: 'Elite status for exceptional performance and client success.',
        icon: 'Shield',
        color: 'from-red-500 to-pink-500'
      },
      {
        id: 2,
        title: 'AWS Solution Partner',
        organization: 'Amazon Web Services',
        year: 'Current',
        category: 'Cloud Technology',
        description: 'Certified for enterprise-level cloud architecture and implementation.',
        icon: 'Cloud',
        color: 'from-orange-500 to-red-500'
      },
      {
        id: 3,
        title: 'Adobe Solution Partner',
        organization: 'Adobe',
        year: 'Current',
        category: 'Creative Technology',
        description: 'Recognized expertise in Adobe Creative Cloud enterprise solutions.',
        icon: 'Image',
        color: 'from-purple-600 to-blue-600'
      },
      {
        id: 4,
        title: 'ISO 27001 Certified',
        organization: 'International Standards',
        year: '2023',
        category: 'Security',
        description: 'Information security management system certification.',
        icon: 'Lock',
        color: 'from-gray-700 to-gray-900'
      }
    ],
    media: [
      {
        id: 1,
        title: 'Forbes: "The Agency Breaking Every Rule"',
        organization: 'Forbes Magazine',
        year: '2024',
        category: 'Industry Feature',
        description: 'Featured story on how Rule27 is disrupting the traditional agency model.',
        icon: 'FileText',
        color: 'from-indigo-500 to-purple-600'
      },
      {
        id: 2,
        title: 'TechCrunch: Innovation Spotlight',
        organization: 'TechCrunch',
        year: '2024',
        category: 'Tech Coverage',
        description: 'Highlighted for AI-powered design tools and automated optimization.',
        icon: 'Newspaper',
        color: 'from-green-600 to-blue-600'
      },
      {
        id: 3,
        title: 'Design Week: Future of Agencies',
        organization: 'Design Week',
        year: '2023',
        category: 'Design Industry',
        description: 'Expert commentary on the evolution of creative agencies.',
        icon: 'Edit3',
        color: 'from-teal-500 to-green-500'
      },
      {
        id: 4,
        title: 'Adweek: Digital Transformation',
        organization: 'Adweek',
        year: '2023',
        category: 'Marketing Industry',
        description: 'Case study on helping Fortune 500 companies transform digitally.',
        icon: 'Monitor',
        color: 'from-orange-600 to-red-600'
      }
    ]
  };

  const categories = [
    { id: 'awards', label: 'Awards', icon: 'Award', count: recognitionData?.awards?.length },
    { id: 'certifications', label: 'Certifications', icon: 'Shield', count: recognitionData?.certifications?.length },
    { id: 'media', label: 'Media Mentions', icon: 'Newspaper', count: recognitionData?.media?.length }
  ];

  const activeData = recognitionData?.[activeCategory] || [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry?.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (sectionRef?.current) {
      observer?.observe(sectionRef?.current);
    }

    return () => observer?.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-br from-surface via-white to-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-accent/10 px-4 py-2 rounded-full mb-6">
            <AppIcon name="Trophy" size={16} className="text-accent" />
            <span className="text-accent font-semibold text-sm">Recognition</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Industry <span className="text-accent">Recognition</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Our commitment to excellence doesn't go unnoticed. Here's how the industry, 
            our peers, and leading publications recognize Rule27's impact.
          </p>
        </motion.div>

        {/* Category Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {categories?.map((category) => (
            <button
              key={category?.id}
              onClick={() => setActiveCategory(category?.id)}
              className={`flex items-center space-x-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-500 ${
                activeCategory === category?.id
                  ? 'bg-gradient-to-r from-accent to-primary text-white shadow-brand-elevation transform scale-105'
                  : 'bg-white text-text-secondary hover:bg-accent/5 hover:text-accent shadow-brand-md'
              }`}
            >
              <AppIcon name={category?.icon} size={20} />
              <span>{category?.label}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                activeCategory === category?.id 
                  ? 'bg-white/20 text-white' :'bg-accent/10 text-accent'
              }`}>
                {category?.count}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Recognition Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
        >
          {activeData?.map((item, index) => (
            <motion.div
              key={item?.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-brand-md hover:shadow-brand-elevation-lg transition-all duration-500 group-hover:-translate-y-2">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${item?.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <AppIcon name={item?.icon} size={32} className="text-white" />
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-semibold">
                      {item?.year}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors duration-300">
                    {item?.title}
                  </h3>
                  <p className="text-accent font-semibold mb-2">{item?.organization}</p>
                  <span className="inline-block px-3 py-1 bg-surface text-text-secondary rounded-full text-sm">
                    {item?.category}
                  </span>
                </div>

                <p className="text-text-secondary leading-relaxed group-hover:text-primary transition-colors duration-300">
                  {item?.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="bg-gradient-to-r from-accent to-primary rounded-3xl p-12 text-white text-center"
        >
          <h3 className="text-3xl font-bold mb-8">Recognition by the Numbers</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '15+', label: 'Industry Awards', icon: 'Award' },
              { number: '8+', label: 'Certifications', icon: 'Shield' },
              { number: '25+', label: 'Media Features', icon: 'Newspaper' },
              { number: '3', label: 'Years Running', icon: 'TrendingUp' }
            ]?.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:bg-white/30 transition-colors duration-300">
                  <AppIcon name={stat?.icon} size={32} className="text-white" />
                </div>
                <div className="text-4xl font-bold mb-2">{stat?.number}</div>
                <div className="text-white/80">{stat?.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-12 max-w-3xl mx-auto">
            <p className="text-xl opacity-90">
              "Recognition isn't just about collecting trophies—it's proof that our rebellious approach 
              to creativity and innovation is making a real impact in the industry."
            </p>
            <div className="flex items-center justify-center space-x-3 mt-6">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="font-bold text-lg">27</span>
              </div>
              <div className="text-left">
                <div className="font-semibold">Rule27 Leadership Team</div>
                <div className="text-sm opacity-70">Digital Powerhouse</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AwardsRecognition;