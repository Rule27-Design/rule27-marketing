import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const SocialProofSection = ({ 
  testimonials = [], 
  awards = [], 
  partnerships = [],
  stats = null 
}) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Use database testimonials or fall back to static
  const displayTestimonials = testimonials.length > 0 ? testimonials : getStaticTestimonials();
  const displayAwards = awards.length > 0 ? awards : getStaticAwards();
  const displayPartnerships = partnerships.length > 0 ? partnerships : getStaticPartnerships();
  const displayStats = stats || getStaticStats();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector('.social-proof-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible && displayTestimonials.length > 1) {
      const interval = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % displayTestimonials.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [isVisible, displayTestimonials.length]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={16}
        className={index < rating ? "text-yellow-400 fill-current" : "text-gray-300"}
      />
    ));
  };

  return (
    <section className="social-proof-section py-24 bg-gradient-to-b from-muted to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading-regular text-primary mb-6 uppercase tracking-wider">
            Trusted by Industry
            <span className="text-accent block mt-2 font-heading-regular uppercase">Leaders Worldwide</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto font-body">
            Don't just take our word for it. See what visionary leaders say about 
            their transformation journey with Rule27 Design.
          </p>
        </div>

        {/* Main Testimonial */}
        {displayTestimonials.length > 0 && (
          <div className="mb-16">
            <div className="bg-white rounded-2xl brand-shadow-lg p-8 md:p-12 max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8 items-center">
                {/* Client Info */}
                <div className="text-center md:text-left">
                  <div className="relative inline-block mb-4">
                    <Image
                      src={displayTestimonials[currentTestimonial].client_avatar || `https://ui-avatars.com/api/?name=${displayTestimonials[currentTestimonial].client_name}&background=E53E3E&color=fff`}
                      alt={displayTestimonials[currentTestimonial].client_name}
                      className="w-20 h-20 rounded-full object-cover mx-auto md:mx-0"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-accent rounded-full p-1">
                      <Icon name="Quote" size={16} className="text-white" />
                    </div>
                  </div>
                  <h4 className="font-heading-regular text-primary text-lg mb-1 uppercase tracking-wider">
                    {displayTestimonials[currentTestimonial].client_name}
                  </h4>
                  <p className="text-text-secondary text-sm mb-2 font-body">
                    {displayTestimonials[currentTestimonial].client_title}
                  </p>
                  <p className="text-accent font-body font-semibold text-sm mb-3">
                    {displayTestimonials[currentTestimonial].client_company}
                  </p>
                  <div className="flex justify-center md:justify-start space-x-1 mb-3">
                    {renderStars(displayTestimonials[currentTestimonial].rating || 5)}
                  </div>
                  {displayTestimonials[currentTestimonial].industry && (
                    <div className="text-xs text-text-secondary font-body">
                      {displayTestimonials[currentTestimonial].industry}
                    </div>
                  )}
                </div>

                {/* Testimonial Content */}
                <div className="md:col-span-2">
                  <blockquote className="text-lg md:text-xl text-primary leading-relaxed mb-6 italic font-body">
                    "{displayTestimonials[currentTestimonial].quote}"
                  </blockquote>
                  {displayTestimonials[currentTestimonial].project_value && (
                    <div className="bg-accent/5 rounded-lg p-4 border-l-4 border-accent">
                      <div className="text-sm text-text-secondary mb-1 font-body">Project Impact:</div>
                      <div className="font-heading-regular text-accent uppercase tracking-wider">
                        {displayTestimonials[currentTestimonial].project_value}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Testimonial Navigation */}
            {displayTestimonials.length > 1 && (
              <div className="flex justify-center mt-8 space-x-3">
                {displayTestimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? 'bg-accent scale-125' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Awards & Recognition */}
        {displayAwards.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-heading-regular text-primary text-center mb-8 uppercase tracking-wider">
              Industry Recognition & Awards
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayAwards.map((award, index) => (
                <div
                  key={award.id || index}
                  className="bg-white rounded-lg p-6 text-center brand-shadow hover:brand-shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="bg-accent/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name={award.icon || 'Award'} size={24} className="text-accent" />
                  </div>
                  <h4 className="font-heading-regular text-primary text-sm mb-2 uppercase tracking-wider">
                    {award.title}
                  </h4>
                  <p className="text-text-secondary text-xs font-body">
                    {award.organization}
                  </p>
                  {award.year && (
                    <p className="text-accent text-xs font-heading-regular mt-2 uppercase">
                      {award.year}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strategic Partnerships */}
        {displayPartnerships.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-heading-regular text-primary text-center mb-8 uppercase tracking-wider">
              Strategic Technology Partners
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {displayPartnerships.map((partner, index) => (
                <div
                  key={partner.id || index}
                  className="bg-white rounded-lg p-6 flex items-center justify-center brand-shadow hover:brand-shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <div className="text-center">
                    {partner.icon ? (
                      <Icon name={partner.icon} size={48} className="text-primary mx-auto mb-3" />
                    ) : (
                      <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-3 flex items-center justify-center">
                        <span className="font-heading-regular text-xl uppercase">
                          {partner.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <p className="text-xs text-text-secondary font-body font-medium">
                      {partner.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="text-4xl font-heading-regular text-accent mb-2 uppercase tracking-wider">
              {displayStats.satisfaction}
            </div>
            <div className="text-text-secondary font-body">Client Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-heading-regular text-accent mb-2 uppercase tracking-wider">
              {displayStats.projects}
            </div>
            <div className="text-text-secondary font-body">Projects Completed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-heading-regular text-accent mb-2 uppercase tracking-wider">
              {displayStats.growth}
            </div>
            <div className="text-text-secondary font-body">Average Growth</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-heading-regular text-accent mb-2 uppercase tracking-wider">
              {displayStats.awards}
            </div>
            <div className="text-text-secondary font-body">Industry Awards</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-primary rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-heading-regular mb-4 uppercase tracking-wider">
            Join the Success Stories
          </h3>
          <p className="text-xl mb-8 opacity-90 font-body">
            Ready to become our next transformation success story?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/case-studies">
              <button className="bg-white text-primary px-8 py-4 rounded-lg font-body font-semibold hover:bg-gray-100 transition-colors duration-300 flex items-center space-x-2">
                <Icon name="Eye" size={20} />
                <span className="font-heading-regular tracking-wider uppercase">View All Case Studies</span>
              </button>
            </Link>
            <Link to="/contact">
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-body font-semibold hover:bg-white hover:text-primary transition-all duration-300 flex items-center space-x-2">
                <Icon name="MessageCircle" size={20} />
                <span className="font-heading-regular tracking-wider uppercase">Start Your Journey</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

// Static data functions
function getStaticTestimonials() {
  return [
    {
      client_name: "Sarah Chen",
      client_title: "CEO & Founder",
      client_company: "TechFlow Solutions",
      client_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      quote: "Rule27 Design didn't just redesign our brand—they reimagined our entire market position. The 712% conversion rate increase speaks for itself.",
      rating: 5,
      industry: "SaaS Technology",
      project_value: "$2.5M Revenue Impact"
    }
  ];
}

function getStaticAwards() {
  return [
    {
      title: "Best Creative Agency 2024",
      organization: "Design Excellence Awards",
      icon: "Award",
      year: "2024"
    },
    {
      title: "Innovation in Digital Marketing",
      organization: "Marketing Leadership Council",
      icon: "Trophy",
      year: "2024"
    }
  ];
}

function getStaticPartnerships() {
  return [
    { name: "Adobe Creative Partner", icon: "Palette" },
    { name: "Google Premier Partner", icon: "Search" },
    { name: "Shopify Plus Partner", icon: "ShoppingBag" },
    { name: "HubSpot Solutions Partner", icon: "Users" }
  ];
}

function getStaticStats() {
  return {
    satisfaction: "98%",
    projects: "150+",
    growth: "500%",
    awards: "25+"
  };
}

export default SocialProofSection;