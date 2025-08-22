import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Logo Component with multiple display options
const Logo = ({ 
  variant = 'full', // 'full', 'icon', 'text'
  colorScheme = 'default', // 'default', 'white', 'black'
  linkTo = '/homepage-experience-hub',
  className = '',
  showTagline = true,
  size = 'default' // 'small', 'default', 'large'
}) => {
  const [imageError, setImageError] = useState(false);
  
  // Size configurations
  const sizeConfig = {
    small: {
      icon: 'w-8 h-8 text-sm',
      text: 'text-lg',
      tagline: 'text-xs'
    },
    default: {
      icon: 'w-10 h-10 text-lg',
      text: 'text-xl',
      tagline: 'text-xs'
    },
    large: {
      icon: 'w-14 h-14 text-2xl',
      text: 'text-2xl',
      tagline: 'text-sm'
    }
  };

  const currentSize = sizeConfig[size];

  // Color scheme configurations
  const colorConfig = {
    default: {
      icon: 'bg-primary text-white hover:bg-accent',
      text: 'text-primary hover:text-accent',
      tagline: 'text-text-secondary'
    },
    white: {
      icon: 'bg-white text-primary hover:bg-gray-100',
      text: 'text-white hover:text-gray-200',
      tagline: 'text-gray-300'
    },
    black: {
      icon: 'bg-black text-white hover:bg-gray-800',
      text: 'text-black hover:text-gray-700',
      tagline: 'text-gray-600'
    }
  };

  const currentColors = colorConfig[colorScheme];

  // Determine logo source based on color scheme
  const getLogoSrc = () => {
    const format = imageError ? 'png' : 'svg';
    const basePath = '/assets/logo';
    
    switch(colorScheme) {
      case 'white':
        return `${basePath}-white.${format}`;
      case 'black':
        return `${basePath}-black.${format}`;
      default:
        return `${basePath}-color.${format}`;
    }
  };

  // Icon-only variant
  const IconLogo = () => (
    <div className="relative group">
      <div className={`${currentSize.icon} ${currentColors.icon} rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:scale-110`}>
        <span className="font-bold">27</span>
      </div>
      <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
    </div>
  );

  // Text-only variant
  const TextLogo = () => (
    <div className="flex flex-col">
      <span className={`${currentSize.text} font-bold ${currentColors.text} transition-colors duration-300`}>
        Rule27
      </span>
      {showTagline && (
        <span className={`${currentSize.tagline} ${currentColors.tagline} font-medium tracking-wide`}>
          Digital Powerhouse
        </span>
      )}
    </div>
  );

  // Full logo variant (icon + text)
  const FullLogo = () => (
    <div className="flex items-center space-x-2 group">
      <IconLogo />
      <TextLogo />
    </div>
  );

  // SVG-based logo (primary implementation if SVG files exist)
  const SVGLogo = () => {
    if (imageError) {
      // Fallback to custom implementation
      switch(variant) {
        case 'icon':
          return <IconLogo />;
        case 'text':
          return <TextLogo />;
        default:
          return <FullLogo />;
      }
    }

    return (
      <img 
        src={getLogoSrc()}
        alt="Rule27 Logo"
        className={`h-${size === 'small' ? '8' : size === 'large' ? '14' : '10'} w-auto group-hover:scale-105 transition-transform duration-300`}
        onError={() => setImageError(true)}
        loading="eager" // Logo should load immediately
      />
    );
  };

  // Inline SVG variant (best for performance and customization)
  const InlineSVGLogo = () => (
    <svg 
      className={`${currentSize.icon} fill-current ${currentColors.text} transition-all duration-300 hover:scale-105`}
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="logo-title"
    >
      <title id="logo-title">Rule27 Digital Powerhouse</title>
      {/* Example SVG paths - replace with your actual logo */}
      <circle cx="50" cy="50" r="45" className="fill-primary" />
      <text 
        x="50" 
        y="50" 
        dominantBaseline="middle" 
        textAnchor="middle" 
        className="fill-white font-bold text-3xl"
      >
        27
      </text>
    </svg>
  );

  // Determine which logo to render
  const renderLogo = () => {
    // If you have SVG files, use SVGLogo, otherwise use the custom implementation
    if (process.env.REACT_APP_USE_SVG_FILES === 'true') {
      return <SVGLogo />;
    }

    // Custom implementation based on variant
    switch(variant) {
      case 'icon':
        return <IconLogo />;
      case 'text':
        return <TextLogo />;
      case 'svg':
        return <InlineSVGLogo />;
      default:
        return <FullLogo />;
    }
  };

  // Wrapper with optional link
  if (linkTo) {
    return (
      <Link 
        to={linkTo}
        className={`inline-flex items-center ${className}`}
        aria-label="Rule27 Digital Powerhouse - Home"
      >
        {renderLogo()}
      </Link>
    );
  }

  return (
    <div className={`inline-flex items-center ${className}`}>
      {renderLogo()}
    </div>
  );
};

// Export variants for specific use cases
export const LogoIcon = (props) => <Logo {...props} variant="icon" />;
export const LogoText = (props) => <Logo {...props} variant="text" />;
export const LogoFull = (props) => <Logo {...props} variant="full" />;

export default Logo;