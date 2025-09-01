import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Logo from '../../../components/ui/Logo';

const HeroSection = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const typeSpeed = 100;
  const deleteSpeed = 50;
  const pauseDuration = 2000;

  // Define words outside of component or use useMemo to prevent recreating
  const dynamicWords = React.useMemo(() => 
    ['Audacity', 'Innovation', 'Excellence', 'Precision', 'Vision', 'Impact'], 
  []);

  // Typewriter effect - fixed dependency array
  useEffect(() => {
    const word = dynamicWords[currentWordIndex];
    let timeout;

    if (!isDeleting) {
      // Typing
      if (currentText !== word) {
        timeout = setTimeout(() => {
          setCurrentText(prev => word.slice(0, prev.length + 1));
        }, typeSpeed);
      } else {
        // Pause before deleting
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      // Deleting
      if (currentText !== '') {
        timeout = setTimeout(() => {
          setCurrentText(prev => prev.slice(0, -1));
        }, deleteSpeed);
      } else {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % dynamicWords.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, dynamicWords]);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Parallax scroll effect
  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const heroElement = document.querySelector('.hero-background');
      const floatingElements = document.querySelectorAll('.floating-element');
      
      if (heroElement) {
        heroElement.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
      
      floatingElements.forEach((el, index) => {
        const speed = 0.2 + (index * 0.1);
        el.style.transform = `translateY(${scrolled * speed}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mouse move effect for floating elements and cursor glow
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Get hero section bounds
      const heroSection = e.currentTarget;
      const rect = heroSection.getBoundingClientRect();
      
      // Calculate relative position within hero section
      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;
      
      // Update mouse position for glow effect (relative to hero)
      setMousePosition({ x: relativeX, y: relativeY });
      
      // Floating elements calculation
      const mouseX = e.clientX / window.innerWidth - 0.5;
      const mouseY = e.clientY / window.innerHeight - 0.5;
      
      const floatingElements = document.querySelectorAll('.floating-interactive');
      floatingElements.forEach((el, index) => {
        const speed = 20 + (index * 10);
        el.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px)`;
      });
    };

    // Add event listener only to hero section
    const heroElement = document.querySelector('.hero-section');
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      
      // Hide glow when mouse leaves hero
      heroElement.addEventListener('mouseleave', () => {
        setMousePosition({ x: -1000, y: -1000 }); // Move glow off-screen
      });
    }

    return () => {
      if (heroElement) {
        heroElement.removeEventListener('mousemove', handleMouseMove);
        heroElement.removeEventListener('mouseleave', () => {});
      }
    };
  }, []);

  return (
    <section className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Mouse Follower Glow - Only within hero section */}
      <div 
        className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(229, 62, 62, 0.15), transparent 40%)`,
        }}
      />
      
      {/* Animated Background with Gradient Mesh */}
      <div className="hero-background absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
          {/* Gradient Mesh */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-accent/20 to-transparent blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-accent/10 to-transparent blur-3xl"></div>
          </div>
        </div>
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[linear-gradient(to_right,#4f4f4f_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>
      </div>

      {/* Floating Elements with Parallax */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="floating-element floating-interactive absolute top-20 left-10 w-4 h-4 bg-accent rounded-full animate-pulse"></div>
        <div className="floating-element floating-interactive absolute top-40 right-20 w-3 h-3 bg-white/30 rounded-full animate-pulse delay-700"></div>
        <div className="floating-element floating-interactive absolute bottom-32 left-1/3 w-2 h-2 bg-accent/60 rounded-full animate-pulse delay-1000"></div>
        <div className="floating-element absolute top-1/2 right-1/4 w-6 h-6 bg-gradient-to-br from-accent to-transparent rounded-full blur-xl animate-bounce delay-500"></div>
        <div className="floating-element absolute bottom-20 right-10 w-5 h-5 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-lg animate-bounce delay-300"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo Integration with Hover Effect */}
        <div className={`mb-8 flex justify-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <div className="group">
            <Logo 
              variant="icon"
              colorScheme="white"
              linkTo={false}
              className="transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
            />
            <div className="absolute -inset-4 bg-gradient-to-r from-accent to-white rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"></div>
          </div>
        </div>

        {/* Main Headline with Typewriter Effect - Using Steelfish */}
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading-regular text-white mb-6 uppercase tracking-wider">
            <span className="block mb-2">The 27th Rule:</span>
            <span className="block text-center md:text-left">
              <span className="block md:inline">Where Creative{' '}</span>
              <span className="relative inline-block min-w-[200px] md:min-w-[320px] text-center md:text-left">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-red-400 to-accent bg-300% animate-gradient font-heading-regular uppercase">
                  {currentText}
                </span>
                <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} text-accent transition-opacity duration-100`}>
                  |
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-accent to-transparent transform origin-left animate-pulse"></div>
              </span>
            </span>
            <span className="block mt-2">Meets Technical Precision</span>
          </h1>
        </div>

        {/* Subheading with Stagger Animation - Using Helvetica */}
        <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-sans">
            We don't just follow design trends, we create them. We don't just solve problems, we reimagine possibilities. 
            <span className="text-accent font-semibold bg-gradient-to-r from-accent to-red-400 bg-clip-text text-transparent"> Break conventional boundaries</span> and discover the creative partner 
            that makes other agencies look ordinary.
          </p>
        </div>

        {/* Interactive Stats Bar - Using Steelfish for numbers */}
        <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex justify-center space-x-8 mb-12 text-white/80">
            <div className="group cursor-pointer">
              <div className="text-4xl font-heading-regular text-accent group-hover:scale-110 transition-transform duration-300 uppercase">150+</div>
              <div className="text-sm font-sans">Projects</div>
            </div>
            <div className="group cursor-pointer">
              <div className="text-4xl font-heading-regular text-accent group-hover:scale-110 transition-transform duration-300 uppercase">98%</div>
              <div className="text-sm font-sans">Satisfaction</div>
            </div>
            <div className="group cursor-pointer">
              <div className="text-4xl font-heading-regular text-accent group-hover:scale-110 transition-transform duration-300 uppercase">500%</div>
              <div className="text-sm font-sans">Avg Growth</div>
            </div>
          </div>
        </div>

        {/* CTA Buttons with Enhanced Hover Effects - Using Steelfish for impact */}
        <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link to="/contact">
              <Button
                variant="default"
                size="lg"
                className="bg-gradient-to-r from-accent to-red-500 hover:from-red-500 hover:to-accent text-white px-8 py-4 text-lg font-heading-regular uppercase tracking-wider transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-accent/50"
                iconName="ArrowRight"
                iconPosition="right"
              >
                Start Your Transformation
              </Button>
            </Link>
            <Link to="/capabilities">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white/50 text-white hover:bg-white hover:text-black backdrop-blur-sm px-8 py-4 text-lg font-heading-regular uppercase tracking-wider transform hover:scale-105 transition-all duration-300"
                iconName="Compass"
                iconPosition="left"
              >
                Explore Our Universe
              </Button>
            </Link>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex flex-col items-center text-gray-400 group cursor-pointer">
            <span className="text-sm mb-2 tracking-wide group-hover:text-accent transition-colors duration-300 font-sans">
              Discover More
            </span>
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="animate-bounce">
                <Icon name="ChevronDown" size={24} className="text-accent" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent opacity-5"></div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient {
          animation: gradient 6s ease infinite;
        }
        
        .bg-300\% {
          background-size: 300% 300%;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-from), var(--tw-gradient-to));
        }
      `}</style>
    </section>
  );
};

export default HeroSection;