import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const HeroSection = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const dynamicWords = ['Audacity', 'Innovation', 'Excellence', 'Precision'];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % dynamicWords?.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const heroElement = document.querySelector('.hero-background');
      if (heroElement) {
        heroElement.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Animated Background */}
      <div className="hero-background absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
      </div>
      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-accent rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-white/30 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-accent/60 rounded-full animate-bounce delay-1000"></div>
      </div>
      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo Integration */}
        <div className="mb-8 flex justify-center">
          <div className="relative group">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center group-hover:bg-accent transition-all duration-500 transform group-hover:scale-110">
              <span className="text-black font-bold text-2xl group-hover:text-white transition-colors duration-300">27</span>
            </div>
            <div className="absolute -inset-2 bg-gradient-to-r from-accent to-white rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-sm"></div>
          </div>
        </div>

        {/* Main Headline with Kinetic Typography */}
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="block mb-2">The 27th Rule:</span>
            <span className="block">
              Where Creative{' '}
              <span className="relative inline-block">
                <span className="text-accent transition-all duration-500 transform">
                  {dynamicWords?.[currentWordIndex]}
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-accent transform scale-x-0 animate-pulse"></div>
              </span>
            </span>
            <span className="block mt-2">Meets Technical Precision</span>
          </h1>
        </div>

        {/* Subheading */}
        <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            We don't just follow design trends—we create them. We don't just solve problems—we reimagine possibilities. 
            <span className="text-accent font-semibold"> Break conventional boundaries</span> and discover the creative partner 
            that makes other agencies look ordinary.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link to="/contact-consultation-portal">
              <Button
                variant="default"
                size="lg"
                className="bg-accent hover:bg-accent/90 text-white px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-300 brand-shadow-lg"
                iconName="ArrowRight"
                iconPosition="right"
              >
                Start Your Transformation
              </Button>
            </Link>
            <Link to="/capability-universe">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-300"
                iconName="Compass"
                iconPosition="left"
              >
                Explore Our Universe
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex flex-col items-center text-gray-400">
            <span className="text-sm mb-2 tracking-wide">Discover More</span>
            <div className="animate-bounce">
              <Icon name="ChevronDown" size={24} className="text-accent" />
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default HeroSection;