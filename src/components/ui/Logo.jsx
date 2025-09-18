import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Logo Component for Rule27 Design - SVG priority with PNG fallback
const Logo = ({ 
  variant = 'horizontal', // 'full', 'icon', 'text', 'horizontal'
  colorScheme = 'default', // 'default', 'white', 'black'
  linkTo = '/',
  className = '',
  showTagline = true,
  size = 'default' // 'small', 'default', 'large'
}) => {
  const [imageError, setImageError] = useState(false);
  
  // Size configurations
  const sizeConfig = {
    small: {
      height: 'h-8',
      iconSize: 'w-8 h-8',
      text: 'text-base',
      tagline: 'text-[10px]',
      number: 'text-sm'
    },
    default: {
      height: 'h-10',
      iconSize: 'w-10 h-10',
      text: 'text-xl',
      tagline: 'text-xs',
      number: 'text-lg'
    },
    large: {
      height: 'h-14',
      iconSize: 'w-14 h-14',
      text: 'text-3xl',
      tagline: 'text-sm',
      number: 'text-2xl'
    } 
  };

  const currentSize = sizeConfig[size];

  // Get logo source - SVG first, PNG fallback
  const getLogoSrc = () => {
    const basePath = '/assets/Logo';
    const format = imageError ? 'png' : 'svg'; // Use SVG by default, PNG if SVG fails
    
    // For full logo with text
    if (variant === 'full' || variant === 'horizontal') {
      switch(colorScheme) {
        case 'white':
          return `${basePath}/rule27-white.${format}`;
        case 'black':
          return `${basePath}/rule27-black.${format}`;
        default:
          return `${basePath}/rule27-color.${format}`;
      }
    }
    
    // For icon only (the circular 27)
    switch(colorScheme) {
      case 'white':
        return `${basePath}/rule27-icon-white.${format}`;
      case 'black':
        return `${basePath}/rule27-icon-black.${format}`;
      default:
        return `${basePath}/rule27-icon-color.${format}`;
    }
  };

  // CSS Fallback version
  const CSSFallbackLogo = () => (
    <div className="flex items-center space-x-3 group">
      <div className={`${currentSize.iconSize} bg-[#E53E3E] rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:scale-110`}>
        <span className={`${currentSize.number} text-white font-bold`}></span>
      </div>
      {variant !== 'icon' && (
        <div className="flex flex-col leading-none">
          <span className={`${currentSize.text} font-bold text-black tracking-tight`}>
            RULE27
          </span>
          {showTagline && (
            <span className={`${currentSize.tagline} text-gray-600 font-medium tracking-[0.2em] uppercase mt-0.5`}>
              DESIGN
            </span>
          )}
        </div>
      )}
    </div>
  );

  // Icon-only variant
  const IconLogo = () => (
    <img 
      src={getLogoSrc()}
      alt="Rule27 Icon"
      className={`${currentSize.iconSize} object-contain transition-transform duration-300 hover:scale-105`}
      onError={(e) => {
        if (!imageError) {
          console.log(`SVG failed, trying PNG: ${getLogoSrc()}`);
          setImageError(true);
        } else {
          // Both SVG and PNG failed, hide image and show CSS fallback
          e.target.style.display = 'none';
        }
      }}
    />
  );

  // Text-only variant
  const TextLogo = () => (
    <div className="flex flex-col leading-none">
      <span className={`${currentSize.text} font-bold text-black tracking-tight`}>
        RULE27
      </span>
      {showTagline && (
        <>
          <div className="h-[2px] bg-current my-1 w-full"></div>
          <span className={`${currentSize.tagline} text-gray-600 font-medium tracking-[0.3em] uppercase`}>
            DESIGN
          </span>
        </>
      )}
    </div>
  );

  // Horizontal layout (icon + text side by side)
  const HorizontalLogo = () => (
    <div className="flex items-center space-x-3 group">
      <img 
        src={getLogoSrc()}
        alt="Rule27 Icon"
        className={`${currentSize.iconSize} object-contain transition-transform duration-300 group-hover:scale-105`}
        onError={(e) => {
          if (!imageError) {
            setImageError(true);
          } else {
            e.target.style.display = 'none';
          }
        }}
      />
      <div className="flex flex-col leading-none">
        <span className={`${currentSize.text} font-bold text-black tracking-tight group-hover:text-[#E53E3E] transition-colors`}>
          RULE27
        </span>
        {showTagline && (
          <span className={`${currentSize.tagline} text-gray-600 font-medium tracking-[0.2em] uppercase mt-0.5`}>
            DESIGN
          </span>
        )}
      </div>
    </div>
  );

  // Full logo variant
  const FullLogo = () => (
    <img 
      src={getLogoSrc()}
      alt="Rule27 Design Logo"
      className={`${currentSize.height} w-auto transition-transform duration-300 hover:scale-105`}
      onError={(e) => {
        if (!imageError) {
          console.log(`SVG failed for full logo, trying PNG`);
          setImageError(true);
        } else {
          // Both failed, replace with CSS fallback
          e.target.style.display = 'none';
        }
      }}
    />
  );

  // Determine which logo to render
  const renderLogo = () => {
    // If both image formats failed, show CSS fallback
    if (imageError && variant !== 'text') {
      const imgElement = document.querySelector(`img[src="${getLogoSrc()}"]`);
      if (imgElement && imgElement.style.display === 'none') {
        return <CSSFallbackLogo />;
      }
    }

    switch(variant) {
      case 'icon':
        return <IconLogo />;
      case 'text':
        return <TextLogo />;
      case 'horizontal':
        return <HorizontalLogo />;
      case 'full':
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
        aria-label="Rule27 Design - Home"
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

// Export variants for easy use
export const LogoIcon = (props) => <Logo {...props} variant="icon" />;
export const LogoText = (props) => <Logo {...props} variant="text" />;
export const LogoFull = (props) => <Logo {...props} variant="full" />;
export const LogoHorizontal = (props) => <Logo {...props} variant="horizontal" />;

export default Logo;