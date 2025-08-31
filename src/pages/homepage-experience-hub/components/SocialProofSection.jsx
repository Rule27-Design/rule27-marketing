import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const SocialProofSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      title: "CEO & Founder",
      company: "TechFlow Solutions",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      quote: `Rule27 Design didn't just redesign our brand—they reimagined our entire market position. The 712% conversion rate increase speaks for itself, but what truly impressed me was their strategic thinking and flawless execution.`,
      rating: 5,
      companyLogo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80",
      industry: "SaaS Technology",
      projectValue: "$2.5M Revenue Impact"
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      title: "Chief Marketing Officer",
      company: "EcoVibe Marketplace",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      quote: `Working with Rule27 Design was like having a world-class creative team and strategic consultancy rolled into one. They transformed our sustainable marketplace from a startup idea into a $340K monthly revenue powerhouse.`,
      rating: 5,
      companyLogo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80",
      industry: "E-commerce",
      projectValue: "656% Revenue Growth"
    },
    {
      id: 3,
      name: "Dr. Amanda Foster",
      title: "Chief Executive Officer",
      company: "HealthHub Connect",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      quote: `Rule27 Design's approach to healthcare digital transformation was nothing short of revolutionary. They increased our patient satisfaction from 23% to 94% while creating a platform that our providers actually love using.`,
      rating: 5,
      companyLogo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80",
      industry: "Healthcare",
      projectValue: "309% Satisfaction Increase"
    }
  ];

  const awards = [
    {
      name: "Best Creative Agency 2024",
      organization: "Design Excellence Awards",
      icon: "Award"
    },
    {
      name: "Innovation in Digital Marketing",
      organization: "Marketing Leadership Council",
      icon: "Trophy"
    },
    {
      name: "Top Development Partner",
      organization: "Tech Innovation Awards",
      icon: "Star"
    },
    {
      name: "Client Satisfaction Excellence",
      organization: "Business Excellence Institute",
      icon: "Heart"
    }
  ];

  const partnerships = [
    {
      name: "Adobe Creative Partner",
      logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80"
    },
    {
      name: "Google Premier Partner",
      logo: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80"
    },
    {
      name: "Shopify Plus Partner",
      logo: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80"
    },
    {
      name: "HubSpot Solutions Partner",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector('.social-proof-section');
    if (element) observer?.observe(element);

    return () => observer?.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials?.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [isVisible, testimonials?.length]);

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
        <div className="mb-16">
          <div className="bg-white rounded-2xl brand-shadow-lg p-8 md:p-12 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              {/* Client Info */}
              <div className="text-center md:text-left">
                <div className="relative inline-block mb-4">
                  <Image
                    src={testimonials?.[currentTestimonial]?.avatar}
                    alt={testimonials?.[currentTestimonial]?.name}
                    className="w-20 h-20 rounded-full object-cover mx-auto md:mx-0"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-accent rounded-full p-1">
                    <Icon name="Quote" size={16} className="text-white" />
                  </div>
                </div>
                <h4 className="font-heading-regular text-primary text-lg mb-1 uppercase tracking-wider">
                  {testimonials?.[currentTestimonial]?.name}
                </h4>
                <p className="text-text-secondary text-sm mb-2 font-body">
                  {testimonials?.[currentTestimonial]?.title}
                </p>
                <p className="text-accent font-body font-semibold text-sm mb-3">
                  {testimonials?.[currentTestimonial]?.company}
                </p>
                <div className="flex justify-center md:justify-start space-x-1 mb-3">
                  {renderStars(testimonials?.[currentTestimonial]?.rating)}
                </div>
                <div className="text-xs text-text-secondary font-body">
                  {testimonials?.[currentTestimonial]?.industry}
                </div>
              </div>

              {/* Testimonial Content */}
              <div className="md:col-span-2">
                <blockquote className="text-lg md:text-xl text-primary leading-relaxed mb-6 italic font-body">
                  "{testimonials?.[currentTestimonial]?.quote}"
                </blockquote>
                <div className="bg-accent/5 rounded-lg p-4 border-l-4 border-accent">
                  <div className="text-sm text-text-secondary mb-1 font-body">Project Impact:</div>
                  <div className="font-heading-regular text-accent uppercase tracking-wider">
                    {testimonials?.[currentTestimonial]?.projectValue}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial Navigation */}
          <div className="flex justify-center mt-8 space-x-3">
            {testimonials?.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial
                    ? 'bg-accent scale-125' :'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Awards & Recognition */}
        <div className="mb-16">
          <h3 className="text-2xl font-heading-regular text-primary text-center mb-8 uppercase tracking-wider">
            Industry Recognition & Awards
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {awards?.map((award, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 text-center brand-shadow hover:brand-shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="bg-accent/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name={award?.icon} size={24} className="text-accent" />
                </div>
                <h4 className="font-heading-regular text-primary text-sm mb-2 uppercase tracking-wider">
                  {award?.name}
                </h4>
                <p className="text-text-secondary text-xs font-body">
                  {award?.organization}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Partnerships */}
        <div className="mb-16">
          <h3 className="text-2xl font-heading-regular text-primary text-center mb-8 uppercase tracking-wider">
            Strategic Technology Partners
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {partnerships?.map((partner, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 flex items-center justify-center brand-shadow hover:brand-shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-center">
                  <Image
                    src={partner?.logo}
                    alt={partner?.name}
                    className="w-16 h-16 object-contain mx-auto mb-3 grayscale hover:grayscale-0 transition-all duration-300"
                  />
                  <p className="text-xs text-text-secondary font-body font-medium">
                    {partner?.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="text-4xl font-heading-regular text-accent mb-2 uppercase tracking-wider">98%</div>
            <div className="text-text-secondary font-body">Client Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-heading-regular text-accent mb-2 uppercase tracking-wider">150+</div>
            <div className="text-text-secondary font-body">Projects Completed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-heading-regular text-accent mb-2 uppercase tracking-wider">500%</div>
            <div className="text-text-secondary font-body">Average Growth</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-heading-regular text-accent mb-2 uppercase tracking-wider">25+</div>
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
            <Link to="/work-showcase-theater">
              <button className="bg-white text-primary px-8 py-4 rounded-lg font-body font-semibold hover:bg-gray-100 transition-colors duration-300 flex items-center space-x-2">
                <Icon name="Eye" size={20} />
                <span className="font-heading-regular tracking-wider uppercase">View All Case Studies</span>
              </button>
            </Link>
            <Link to="/contact-consultation-portal">
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

export default SocialProofSection;