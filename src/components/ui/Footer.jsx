import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';
import Logo from './Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    explore: [
      { name: 'Capabilities', path: '/capabilities' },
      { name: 'Case Studies', path: '/case-studies' },
      { name: 'Articles', path: '/articles' },
      { name: 'Innovation', path: '/innovation' },
      { name: 'About', path: '/about' }
    ],
    connect: [
      { name: 'Start Consultation', path: '/contact' },
      { name: 'hello@rule27design.com', href: 'mailto:hello@rule27design.com', external: true },
      { name: '+1 (555) RULE-27', href: 'tel:+15557853277', external: true }
    ],
    legal: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Cookies', path: '/cookies' }
    ]
  };

  const socialLinks = [
    { name: 'LinkedIn', icon: 'Linkedin', href: 'https://www.linkedin.com/company/rule27design' },
    { name: 'Facebook', icon: 'Facebook', href: 'https://www.facebook.com/Rule27Design/' },
    { name: 'Instagram', icon: 'Instagram', href: 'https://www.instagram.com/rule27design' },
    { name: 'Github', icon: 'Github', href: 'https://github.com/rule27' }
  ];

  return (
    <footer className="bg-primary text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2 text-center md:text-left">
            <div className="mb-6 flex justify-center md:justify-start">
              {/* Try white PNG first, fallback to color with filter */}
              <img 
                src="/assets/Logo/rule27-white-red.png"
                alt="Rule27 Design"
                className="h-12 w-auto"
                onError={(e) => {
                  // If white PNG fails, use color PNG with filter
                  e.target.src = '/assets/Logo/rule27-color.png';
                  e.target.style.filter = 'brightness(0) invert(1)';
                  e.target.style.WebkitFilter = 'brightness(0) invert(1)';
                }}
              />
            </div>
            <p className="text-gray-300 mb-6 max-w-md mx-auto md:mx-0 font-body">
              The creative partner that breaks conventional boundaries and makes 
              other agencies look ordinary. Where creative audacity meets technical precision.
            </p>
            <div className="flex space-x-4 justify-center md:justify-start mb-8 md:mb-0">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 hover:scale-110"
                  aria-label={`Visit Rule27 Design on ${social.name}`}
                >
                  <Icon name={social.icon} size={20} className="text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links - Using Steelfish for headers */}
          <div className="text-center md:text-left">
            <h4 className="font-heading-regular mb-4 text-lg tracking-wider uppercase">Explore</h4>
            <ul className="space-y-2 text-gray-300">
              {footerLinks.explore.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="hover:text-accent transition-colors duration-300 inline-flex items-center justify-center md:justify-start group font-body"
                  >
                    <span>{link.name}</span>
                    <Icon 
                      name="ArrowUpRight" 
                      size={12} 
                      className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact - Using Steelfish for header */}
          <div className="text-center md:text-left">
            <h4 className="font-heading-regular mb-4 text-lg tracking-wider uppercase">Connect</h4>
            <ul className="space-y-2 text-gray-300">
              {footerLinks.connect.map((link) => (
                <li key={link.path || link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      className="hover:text-accent transition-colors duration-300 inline-flex items-center justify-center md:justify-start group font-body"
                    >
                      <span>{link.name}</span>
                      <Icon 
                        name="ExternalLink" 
                        size={12} 
                        className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                    </a>
                  ) : (
                    <Link
                      to={link.path}
                      className="hover:text-accent transition-colors duration-300 inline-flex items-center justify-center md:justify-start group font-body"
                    >
                      <span>{link.name}</span>
                      <Icon 
                        name="ArrowUpRight" 
                        size={12} 
                        className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm mb-4 md:mb-0 text-center md:text-left font-heading-regular">
            © <span className="font-heading-regular tracking-wider">{currentYear}</span> Rule27 Design - Digital Powerhouse. All rights reserved.
          </p>
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="flex space-x-6 text-sm text-gray-300">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="hover:text-accent transition-colors duration-300 font-heading-regular"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            {/* Status Indicator */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400 font-heading-regular">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;