/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--color-border)', // gray-200
        input: 'var(--color-input)', // white
        ring: 'var(--color-ring)', // red-600
        background: 'var(--color-background)', // white
        foreground: 'var(--color-foreground)', // black
        primary: {
          DEFAULT: 'var(--color-primary)', // black
          foreground: 'var(--color-primary-foreground)', // white
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', // gray-900
          foreground: 'var(--color-secondary-foreground)', // white
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', // red-500
          foreground: 'var(--color-destructive-foreground)', // white
        },
        muted: {
          DEFAULT: 'var(--color-muted)', // gray-50
          foreground: 'var(--color-muted-foreground)', // gray-500
        },
        accent: {
          DEFAULT: 'var(--color-accent)', // red-600
          foreground: 'var(--color-accent-foreground)', // white
        },
        popover: {
          DEFAULT: 'var(--color-popover)', // white
          foreground: 'var(--color-popover-foreground)', // black
        },
        card: {
          DEFAULT: 'var(--color-card)', // white
          foreground: 'var(--color-card-foreground)', // black
        },
        success: {
          DEFAULT: 'var(--color-success)', // emerald-500
          foreground: 'var(--color-success-foreground)', // white
        },
        warning: {
          DEFAULT: 'var(--color-warning)', // amber-500
          foreground: 'var(--color-warning-foreground)', // black
        },
        error: {
          DEFAULT: 'var(--color-error)', // red-500
          foreground: 'var(--color-error-foreground)', // white
        },
        // Brand-specific colors
        surface: 'var(--color-surface)', // gray-50
        'conversion-accent': 'var(--color-conversion-accent)', // red-400
        'text-primary': 'var(--color-text-primary)', // black
        'text-secondary': 'var(--color-text-secondary)', // gray-500
      },
      fontFamily: {
        // Base font - Helvetica with comprehensive fallbacks
        sans: [
          'Helvetica Neue',
          'Helvetica',
          'Arial',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif'
        ],
        // Header font - Steelfish
        heading: [
          'Steelfish',
          'Impact',
          'Haettenschweiler',
          'Franklin Gothic Bold',
          'Arial Black',
          'sans-serif'
        ],
        // Keep mono for code blocks
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
        // Legacy Inter - keep for specific components if needed during transition
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'brand-xs': ['0.75rem', { lineHeight: '1rem' }], // 12px
        'brand-sm': ['0.875rem', { lineHeight: '1.25rem' }], // 14px
        'brand-base': ['1rem', { lineHeight: '1.5rem' }], // 16px
        'brand-lg': ['1.125rem', { lineHeight: '1.75rem' }], // 18px
        'brand-xl': ['1.25rem', { lineHeight: '1.75rem' }], // 20px
        'brand-2xl': ['1.5rem', { lineHeight: '2rem' }], // 24px
        'brand-3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        'brand-4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
        'brand-5xl': ['3rem', { lineHeight: '1' }], // 48px
        'brand-6xl': ['3.75rem', { lineHeight: '1' }], // 60px
        // Adjusted sizes for Steelfish headers
        'heading-xs': ['1rem', { lineHeight: '0.9' }], // 16px
        'heading-sm': ['1.25rem', { lineHeight: '0.9' }], // 20px
        'heading-base': ['1.5rem', { lineHeight: '0.9' }], // 24px
        'heading-lg': ['2rem', { lineHeight: '0.9' }], // 32px
        'heading-xl': ['2.5rem', { lineHeight: '0.9' }], // 40px
        'heading-2xl': ['3rem', { lineHeight: '0.9' }], // 48px
        'heading-3xl': ['3.5rem', { lineHeight: '0.9' }], // 56px
        'heading-4xl': ['4rem', { lineHeight: '0.9' }], // 64px
        'heading-5xl': ['5rem', { lineHeight: '0.9' }], // 80px
        'heading-6xl': ['6rem', { lineHeight: '0.9' }], // 96px
      },
      fontWeight: {
        'brand-normal': '400',
        'brand-medium': '500',
        'brand-semibold': '600',
        'brand-bold': '700',
      },
      letterSpacing: {
        'heading-tight': '-0.02em',
        'heading-normal': '0.02em',
        'heading-wide': '0.08em',
        'heading-wider': '0.12em',
      },
      spacing: {
        'brand-xs': '0.5rem', // 8px
        'brand-sm': '0.75rem', // 12px
        'brand-md': '1rem', // 16px
        'brand-lg': '1.5rem', // 24px
        'brand-xl': '2rem', // 32px
        'brand-2xl': '3rem', // 48px
        'brand-3xl': '4rem', // 64px
        'brand-4xl': '6rem', // 96px
      },
      borderRadius: {
        'brand-sm': '0.25rem', // 4px
        'brand-md': '0.375rem', // 6px
        'brand-lg': '0.5rem', // 8px
        'brand-xl': '0.75rem', // 12px
      },
      boxShadow: {
        'brand-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'brand-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'brand-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'brand-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'brand-elevation': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'brand-elevation-lg': '0 10px 25px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'kinetic-reveal': 'kinetic-reveal 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'gradient-shift': 'gradient-shift 2s ease-in-out infinite alternate',
        'brand-bounce': 'brand-bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'slide-in-right': 'slide-in-right 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-in-up': 'fade-in-up 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        'kinetic-reveal': {
          'from': {
            transform: 'translateY(30px)',
            opacity: '0'
          },
          'to': {
            transform: 'translateY(0)',
            opacity: '1'
          }
        },
        'gradient-shift': {
          '0%': { 'background-position': '0% 50%' },
          '100%': { 'background-position': '100% 50%' }
        },
        'brand-bounce': {
          '0%': { transform: 'scale(0.95)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' }
        },
        'slide-in-right': {
          'from': { transform: 'translateX(100%)' },
          'to': { transform: 'translateX(0)' }
        },
        'fade-in-up': {
          'from': {
            transform: 'translateY(20px)',
            opacity: '0'
          },
          'to': {
            transform: 'translateY(0)',
            opacity: '1'
          }
        }
      },
      transitionTimingFunction: {
        'brand-smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'brand-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      gridTemplateColumns: {
        'asymmetric': '1fr 2fr 1.5fr',
        'brand-layout': 'repeat(12, minmax(0, 1fr))',
      },
      zIndex: {
        'brand-header': '40',
        'brand-sidebar': '30',
        'brand-modal': '50',
        'brand-tooltip': '60',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
}