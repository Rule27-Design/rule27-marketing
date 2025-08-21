import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppIcon from '../../../components/AppIcon';

const OriginStory = () => {
  const [activeTimeline, setActiveTimeline] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);

  const milestones = [
    {
      year: '2016',
      title: 'The Spark',
      description: 'Founded by rebels who believed design agencies were playing it too safe. We asked: "What if creativity had no ceiling?"',
      icon: 'Zap',
      color: 'from-accent to-red-400'
    },
    {
      year: '2018',
      title: 'The 27th Rule',
      description: 'Discovered our philosophy: while others follow 26 design principles, we write the 27th rule that breaks them all.',
      icon: 'Compass',
      color: 'from-accent to-orange-400'
    },
    {
      year: '2020',
      title: 'Digital Disruption',
      description: 'Pivoted to become the digital powerhouse during global transformation. Made other agencies look ordinary.',
      icon: 'Rocket',
      color: 'from-accent to-pink-400'
    },
    {
      year: '2023',
      title: 'Innovation Laboratory',
      description: 'Launched our R&D division, pushing boundaries between creativity and technology like never before.',
      icon: 'Flask',
      color: 'from-accent to-purple-400'
    },
    {
      year: '2025',
      title: 'Future Redefined',
      description: 'Today we stand as the creative partner that makes impossible possible, ordinary extraordinary.',
      icon: 'Crown',
      color: 'from-accent to-blue-400'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry?.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (sectionRef?.current) {
      observer?.observe(sectionRef?.current);
    }

    return () => observer?.disconnect();
  }, []);

  return (
    <section id="origin-story" ref={sectionRef} className="py-24 bg-gradient-to-br from-surface to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center space-x-2 bg-accent/10 px-4 py-2 rounded-full mb-6">
            <AppIcon name="BookOpen" size={16} className="text-accent" />
            <span className="text-accent font-semibold text-sm">Our Origin Story</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Born from <span className="text-accent">Rebellious Innovation</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Every revolution starts with a simple question: "What if we did things differently?" 
            Here's how Rule27 evolved from a rebellious idea to a digital powerhouse.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-accent to-gray-300 hidden md:block"></div>

          {/* Milestone Cards */}
          <div className="space-y-16 md:space-y-24">
            {milestones?.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`flex flex-col md:flex-row items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
                onMouseEnter={() => setActiveTimeline(index)}
              >
                {/* Content Card */}
                <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                  <div className="bg-white rounded-2xl p-8 shadow-brand-elevation hover:shadow-brand-elevation-lg transition-all duration-500 group cursor-pointer">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${milestone?.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <AppIcon name={milestone?.icon} size={24} className="text-white" />
                      </div>
                      <div className="text-2xl font-bold text-accent">{milestone?.year}</div>
                    </div>
                    <h3 className="text-2xl font-bold text-primary mb-3 group-hover:text-accent transition-colors duration-300">
                      {milestone?.title}
                    </h3>
                    <p className="text-text-secondary leading-relaxed group-hover:text-primary transition-colors duration-300">
                      {milestone?.description}
                    </p>
                  </div>
                </div>

                {/* Timeline Node */}
                <div className="hidden md:flex w-6 h-6 bg-accent rounded-full border-4 border-white shadow-brand-md z-10 relative">
                  <div className={`absolute inset-0 bg-accent rounded-full animate-ping ${activeTimeline === index ? 'opacity-75' : 'opacity-0'}`}></div>
                </div>

                {/* Spacer */}
                <div className="flex-1"></div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Philosophy Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1 }}
          className="mt-24 text-center"
        >
          <div className="bg-gradient-to-r from-accent to-primary rounded-2xl p-12 text-white max-w-4xl mx-auto">
            <AppIcon name="Quote" size={48} className="mx-auto mb-6 opacity-70" />
            <h3 className="text-3xl font-bold mb-6">The 27th Rule Philosophy</h3>
            <p className="text-xl leading-relaxed opacity-90">
              "While the industry follows 26 established design principles, we believe in writing the 27th rule - 
              the one that breaks conventions, challenges norms, and creates extraordinary from ordinary. 
              This is our rebellion. This is our innovation."
            </p>
            <div className="mt-8 flex justify-center">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="font-bold text-lg">27</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold">Rule27 Founders</div>
                  <div className="text-sm opacity-70">Digital Rebels</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OriginStory;