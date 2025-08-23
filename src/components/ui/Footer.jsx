import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';
import Logo from './Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    explore: [
      { name: 'Capabilities', path: '/capability-universe' },
      { name: 'Work', path: '/work-showcase-theater' },
      { name: 'Innovation', path: '/innovation-laboratory' },
      { name: 'About', path: '/about-process-studio' }
    ],
    connect: [
      { name: 'Start Consultation', path: '/contact-consultation-portal' },
      { name: 'hello@rule27.com', href: 'mailto:hello@rule27.com', external: true },
      { name: '+1 (555) RULE-27', href: 'tel:+1-555-785-3277', external: true }
    ],
    legal: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Cookies', path: '/cookies' }
    ]
  };

  const socialLinks = [
    { name: 'LinkedIn', icon: 'Linkedin', href: 'https://linkedin.com/company/rule27' },
    { name: 'Twitter', icon: 'Twitter', href: 'https://twitter.com/rule27digital' },
    { name: 'Instagram', icon: 'Instagram', href: 'https://instagram.com/rule27' },
    { name: 'Github', icon: 'Github', href: 'https://github.com/rule27' }
  ];

  return (
    <footer className="bg-primary text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <Logo 
                variant="horizontal"
                colorScheme="white"
                linkTo={false}
                showTagline={true}
              />
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              The creative partner that breaks conventional boundaries and makes 
              other agencies look ordinary. Where creative audacity meets technical precision.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 hover:scale-110"
                  aria-label={`Visit Rule27 on ${social.name}`}
                >
                  <Icon name={social.icon} size={20} className="text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-lg">Explore</h4>
            <ul className="space-y-2 text-gray-300">
              {footerLinks.explore.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="hover:text-accent transition-colors duration-300 inline-flex items-center group"
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

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 text-lg">Connect</h4>
            <ul className="space-y-2 text-gray-300">
              {footerLinks.connect.map((link) => (
                <li key={link.path || link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      className="hover:text-accent transition-colors duration-300 inline-flex items-center group"
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
                      className="hover:text-accent transition-colors duration-300 inline-flex items-center group"
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

        {/* Newsletter Section */}
        <div className="border-t border-white/10 py-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-bold mb-2">Stay at the Forefront</h3>
              <p className="text-gray-300">
                Get exclusive insights, industry trends, and Rule27 innovations delivered monthly.
              </p>
            </div>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-accent transition-colors duration-300"
              />
              <button className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2">
                <span>Subscribe</span>
                <Icon name="ArrowRight" size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm mb-4 md:mb-0">
            © {currentYear} Rule27 Digital Powerhouse. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <div className="flex space-x-6 text-sm text-gray-300">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="hover:text-accent transition-colors duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            {/* Status Indicator */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;