import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Logo from '../../../components/ui/Logo';

const CapabilityZones = () => {
  const [hoveredZone, setHoveredZone] = useState(null);
  const [visibleCards, setVisibleCards] = useState([]);
  const cardsRef = useRef([]);

  const capabilities = [
    {
      id: 'creative-studio',
      title: 'Creative Studio',
      subtitle: 'Visual Identity & Brand Design',
      description: 'Where bold ideas take visual form. We craft distinctive brand identities that command attention and drive emotional connection.',
      icon: 'Palette',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      features: [
        'Brand Identity Design',
        'Visual System Creation',
        'Creative Direction',
        'Art Direction'
      ],
      previewImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2064&q=80',
      stats: {
        projects: '150+',
        awards: '25+',
        satisfaction: '98%'
      }
    },
    {
      id: 'digital-marketing',
      title: 'Digital Marketing Command',
      subtitle: 'Performance-Driven Growth',
      description: 'Strategic campaigns that convert. We blend creative storytelling with data-driven optimization to maximize your ROI.',
      icon: 'Target',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      features: [
        'Performance Marketing',
        'Content Strategy',
        'Social Media Management',
        'SEO & Analytics'
      ],
      previewImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2015&q=80',
      stats: {
        campaigns: '200+',
        avgROI: '340%',
        reach: '50M+'
      }
    },
    {
      id: 'development-lab',
      title: 'Development Lab',
      subtitle: 'Technical Excellence & Innovation',
      description: 'Code that performs. We build scalable, secure, and lightning-fast digital experiences that exceed expectations.',
      icon: 'Code',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      features: [
        'Custom Web Development',
        'Mobile App Creation',
        'E-commerce Platforms',
        'API Integration'
      ],
      previewImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      stats: {
        applications: '120+',
        uptime: '99.9%',
        performance: '95+'
      }
    },
    {
      id: 'executive-advisory',
      title: 'Executive Advisory',
      subtitle: 'Strategic Leadership & Consulting',
      description: 'C-suite guidance when you need it most. Fractional executive services that provide strategic direction without the overhead.',
      icon: 'Users',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      features: [
        'Fractional CMO Services',
        'Strategic Planning',
        'Team Leadership',
        'Growth Consulting'
      ],
      previewImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      stats: {
        executives: '50+',
        companies: '80+',
        growth: '250%'
      }
    }
  ];

  // Intersection Observer for animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = cardsRef.current.indexOf(entry.target);
            if (index !== -1 && !visibleCards.includes(index)) {
              setVisibleCards(prev => [...prev, index]);
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, [visibleCards]);

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Logo */}
        <div className="text-center mb-20">
          <div className="flex justify-center mb-6">
            <div className="group">
              <Logo 
                variant="icon"
                colorScheme="default"
                linkTo={false}
                className="transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
              />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Four Universes of
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-red-400 block mt-2">
              Creative Excellence
            </span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Each zone represents a mastery domain where we've redefined what's possible. 
            Explore the capabilities that make Rule27 Design the creative partner of choice.
          </p>
        </div>

        {/* Capability Grid with Enhanced Animations */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {capabilities?.map((capability, index) => (
            <div
              key={capability?.id}
              ref={el => cardsRef.current[index] = el}
              className={`relative group cursor-pointer transition-all duration-700 ${
                hoveredZone === capability?.id ? 'scale-[1.02] z-10' : 'hover:scale-[1.01]'
              } ${
                visibleCards.includes(index) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{
                transitionDelay: `${index * 100}ms`
              }}
              onMouseEnter={() => setHoveredZone(capability?.id)}
              onMouseLeave={() => setHoveredZone(null)}
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden border border-gray-100 h-full transition-all duration-500">
                {/* Image Section with Parallax Effect */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={capability?.previewImage}
                    alt={capability?.title}
                    className={`w-full h-full object-cover transition-all duration-1000 ${
                      hoveredZone === capability?.id ? 'scale-110' : 'scale-100'
                    }`}
                  />
                  
                  {/* Dynamic Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${capability?.color} transition-opacity duration-500 ${
                    hoveredZone === capability?.id ? 'opacity-90' : 'opacity-80'
                  }`}></div>
                  
                  {/* Animated Icon */}
                  <div className="absolute top-6 left-6">
                    <div className={`w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-500 ${
                      hoveredZone === capability?.id ? 'scale-110 rotate-12' : ''
                    }`}>
                      <Icon name={capability?.icon} size={24} className="text-white" />
                    </div>
                  </div>

                  {/* Stats Overlay with Stagger Animation */}
                  <div className={`absolute bottom-4 right-4 transition-all duration-500 ${
                    hoveredZone === capability?.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}>
                    <div className="bg-white/20 backdrop-blur-md rounded-lg p-3 border border-white/30">
                      <div className="flex space-x-4 text-white text-sm">
                        {Object.entries(capability?.stats)?.map(([key, value], idx) => (
                          <div 
                            key={key} 
                            className="text-center"
                            style={{
                              animation: hoveredZone === capability?.id 
                                ? `fadeInUp 0.3s ease-out ${idx * 0.1}s both` 
                                : 'none'
                            }}
                          >
                            <div className="font-bold text-lg">{value}</div>
                            <div className="capitalize opacity-90 text-xs">{key}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Section with Progressive Enhancement */}
                <div className="p-8">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-primary mb-2 transition-colors duration-300 hover:text-accent">
                      {capability?.title}
                    </h3>
                    <p className={`text-sm font-semibold ${capability?.textColor} uppercase tracking-wide`}>
                      {capability?.subtitle}
                    </p>
                  </div>

                  <p className="text-text-secondary mb-6 leading-relaxed">
                    {capability?.description}
                  </p>

                  {/* Features with Hover Effects */}
                  <div className="mb-6">
                    <div className="grid grid-cols-2 gap-2">
                      {capability?.features?.map((feature, featureIndex) => (
                        <div 
                          key={featureIndex} 
                          className={`flex items-center space-x-2 transition-all duration-300 ${
                            hoveredZone === capability?.id 
                              ? 'translate-x-2' 
                              : ''
                          }`}
                          style={{
                            transitionDelay: `${featureIndex * 50}ms`
                          }}
                        >
                          <div className={`w-2 h-2 rounded-full ${capability?.bgColor} ${
                            hoveredZone === capability?.id ? 'scale-150' : ''
                          } transition-transform duration-300`}></div>
                          <span className="text-sm text-text-secondary">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Enhanced Hover Action */}
                  <div className={`transition-all duration-500 ${
                    hoveredZone === capability?.id 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-4 pointer-events-none'
                  }`}>
                    <div className="flex items-center space-x-2 text-accent font-semibold group">
                      <span className="bg-gradient-to-r from-accent to-red-400 bg-clip-text text-transparent">
                        Explore This Universe
                      </span>
                      <Icon 
                        name="ArrowRight" 
                        size={16} 
                        className="transform transition-transform duration-300 group-hover:translate-x-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section with Enhanced Design */}
        <div className="relative overflow-hidden text-center bg-gradient-to-r from-primary via-gray-900 to-accent rounded-2xl p-12 text-white">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:20px_20px] animate-shimmer"></div>
          </div>
          
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Experience All Four Universes?
            </h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Let's discuss how our integrated approach can transform your brand's trajectory.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/capability-universe">
                <button className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 shadow-xl">
                  <Icon name="Compass" size={20} />
                  <span>Explore All Capabilities</span>
                </button>
              </Link>
              <Link to="/contact-consultation-portal">
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
                  <Icon name="MessageCircle" size={20} />
                  <span>Start Consultation</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -100% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        .animate-shimmer {
          animation: shimmer 8s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default CapabilityZones;