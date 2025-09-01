// Navigation configuration for consistent site-wide navigation
export const NAVIGATION_CONFIG = {
  primary: [
    {
      name: 'Home',
      path: '/',
      icon: 'Home',
      description: 'Return to homepage',
      keywords: ['home', 'main', 'start']
    },
    {
      name: 'Capabilities',
      path: '/capabilities',
      icon: 'Zap',
      description: 'Explore our services and expertise',
      keywords: ['services', 'skills', 'expertise', 'offerings']
    },
    {
      name: 'Work',
      path: '/work',
      icon: 'Eye',
      description: 'View our portfolio and case studies',
      keywords: ['portfolio', 'projects', 'case studies', 'examples']
    },
    {
      name: 'Innovation',
      path: '/innovation',
      icon: 'Lightbulb',
      description: 'Discover our latest innovations and insights',
      keywords: ['innovation', 'research', 'insights', 'future']
    },
    {
      name: 'About',
      path: '/about',
      icon: 'Users',
      description: 'Learn about our team and process',
      keywords: ['about', 'team', 'process', 'company']
    }
  ],
  secondary: [
    {
      name: 'Contact',
      path: '/contact',
      icon: 'MessageCircle',
      description: 'Get in touch for a consultation',
      keywords: ['contact', 'consultation', 'inquire', 'reach out']
    }
  ],
  cta: {
    primary: {
      text: 'Start Consultation',
      path: '/contact',
      icon: 'ArrowRight',
      ariaLabel: 'Start your consultation with Rule27 Design'
    },
    sticky: {
      text: 'Book Consultation',
      path: '/contact',
      icon: 'ArrowRight',
      showAfterScroll: 500, // pixels
      ariaLabel: 'Book a consultation with Rule27 Design'
    }
  },
  mobile: {
    breakpoint: 1024, // lg breakpoint
    animationDuration: 300,
    closeOnRouteChange: true,
    closeOnClickOutside: true,
    trapFocus: true
  }
};

// Social links configuration
export const SOCIAL_LINKS = {
  linkedin: {
    url: 'https://linkedin.com/company/rule27Design',
    icon: 'Linkedin',
    ariaLabel: 'Visit Rule27 Design on LinkedIn'
  },
  twitter: {
    url: 'https://twitter.com/rule27design',
    icon: 'Twitter',
    ariaLabel: 'Follow Rule27 Design on Twitter'
  },
  instagram: {
    url: 'https://instagram.com/rule27Design',
    icon: 'Instagram',
    ariaLabel: 'Follow Rule27 Design on Instagram'
  },
  github: {
    url: 'https://github.com/rule27Design',
    icon: 'Github',
    ariaLabel: 'View Rule27 Design on GitHub'
  }
};

// Contact information
export const CONTACT_INFO = {
  email: 'hello@rule27design.com',
  phone: '+1 (555) RULE-27',
  phoneDisplay: '+1 (555) 785-3277',
  address: {
    street: '10869 N Scottsdale Rd',
    city: 'Scottsdale',
    state: 'AZ',
    zip: '85254',
    country: 'USA'
  }
};

// Brand configuration
export const BRAND_CONFIG = {
  name: 'Rule27 Design',
  tagline: 'Design',
  description: 'Where Creative Excellence Meets Strategic Innovation',
  logo: {
    paths: {
      // Full logos with text
      color: '/assets/logo/rule27-color',
      black: '/assets/logo/rule27-black',
      white: '/assets/logo/rule27-white',
      // Icon only versions
      iconColor: '/assets/logo/rule27-icon-color',
      iconBlack: '/assets/logo/rule27-icon-black',
      iconWhite: '/assets/logo/rule27-icon-white'
    },
    formats: ['svg', 'png'], // Priority order
    defaultVariant: 'color'
  },
  colors: {
    primary: '#000000',
    accent: '#E53E3E', // Rule27 signature red
    text: {
      primary: '#000000',
      secondary: '#6B7280'
    }
  }
};

// Performance configuration
export const PERFORMANCE_CONFIG = {
  scrollThrottle: 100, // ms
  imageOptimization: {
    lazy: true,
    formats: ['webp', 'png', 'jpg'],
    sizes: {
      mobile: 640,
      tablet: 1024,
      desktop: 1920
    }
  },
  animation: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }
};

// Accessibility configuration
export const A11Y_CONFIG = {
  skipLinks: [
    { id: 'main-content', text: 'Skip to main content' },
    { id: 'main-navigation', text: 'Skip to navigation' },
    { id: 'footer', text: 'Skip to footer' }
  ],
  announcements: {
    menuOpen: 'Navigation menu opened',
    menuClose: 'Navigation menu closed',
    routeChange: 'Page navigation occurred'
  },
  focusVisible: true,
  reducedMotion: {
    respectPreference: true,
    fallbackDuration: 0
  }
};

// SEO configuration
export const SEO_CONFIG = {
  defaultMeta: {
    title: 'Rule27 Design Digital Powerhouse',
    titleTemplate: '%s | Rule27 Design',
    description: 'Rule27 Design is the apex creative and development partner for ambitious brands. We don\'t just follow design trends—we create them.',
    keywords: [
      'creative agency',
      'digital marketing',
      'web development',
      'brand design',
      'Rule27',
      'premium creative services'
    ],
    author: 'Rule27 Deisgn',
    viewport: 'width=device-width, initial-scale=1',
    themeColor: '#E53E3E'
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    site_name: 'Rule27 Design Digital Powerhouse',
    images: [
      {
        url: '/assets/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Rule27 Design Digital Powerhouse'
      }
    ]
  },
  twitter: {
    cardType: 'summary_large_image',
    handle: '@rule27digital',
    site: '@rule27digital'
  }
};

export default {
  navigation: NAVIGATION_CONFIG,
  social: SOCIAL_LINKS,
  contact: CONTACT_INFO,
  brand: BRAND_CONFIG,
  performance: PERFORMANCE_CONFIG,
  a11y: A11Y_CONFIG,
  seo: SEO_CONFIG
};