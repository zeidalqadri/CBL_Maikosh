/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // alloui brand colors - theme-aware system
        'alloui-primary': {
          DEFAULT: '#031a39',
          light: '#031a39',     // Dark navy for light theme
          dark: '#4A90E2',      // Lighter blue for dark theme (better contrast)
        },
        'alloui-gold': {
          DEFAULT: '#d4b24c',
          light: '#d4b24c',     // Gold for light theme  
          dark: '#F4D03F',      // Brighter gold for dark theme (better contrast)
        },
        'alloui-court-blue': {
          DEFAULT: '#143b6e',
          light: '#143b6e',
          dark: '#5DADE2',      // Lighter blue for dark theme
        },
        
        // Basic colors - theme-aware variants
        'accent': {
          DEFAULT: '#d4b24c',
          light: '#d4b24c',
          dark: '#F4D03F',
        },
        'accent-hover': {
          DEFAULT: '#c5a04a',
          light: '#c5a04a',
          dark: '#E8C547',
        },
        'court-blue': {
          DEFAULT: '#031a39',
          light: '#031a39',
          dark: '#4A90E2',
        },
        'basketball-orange': {
          DEFAULT: '#FF7F00',
          light: '#FF7F00',
          dark: '#FF8C42',      // Slightly brighter for dark theme
        },
        'whistle-silver': {
          DEFAULT: '#E6E6E6',
          light: '#E6E6E6',
          dark: '#CCCCCC',      // Darker silver for dark theme
        },
        'coach-black': {
          DEFAULT: '#212121',
          light: '#212121',
          dark: '#E5E5E5',      // Light gray for dark theme (inverted)
        },
        'team-red': {
          DEFAULT: '#C8102E',
          light: '#C8102E',
          dark: '#FF6B6B',      // Lighter red for dark theme
        },
        'success-green': {
          DEFAULT: '#007A33',
          light: '#007A33',
          dark: '#4CAF50',      // Lighter green for dark theme
        },
        'neutral-gray': {
          DEFAULT: '#6E6E6E',
          light: '#6E6E6E',
          dark: '#B0B0B0',      // Lighter gray for dark theme
        },
        
        // Module-specific theme colors - optimized for both light and dark modes
        'm1-primary': {
          DEFAULT: '#0B3D91',    // Leadership Navy
          light: '#0B3D91',
          dark: '#6B9BD6',       // Lighter navy for dark mode
        },
        'm1-secondary': {
          DEFAULT: '#FFD700',    // Gold
          light: '#FFD700', 
          dark: '#F4D03F',       // Adjusted gold for dark mode
        },
        'm1-accent': {
          DEFAULT: '#B3E0FF',    // Light Blue
          light: '#B3E0FF',
          dark: '#85C1E9',       // Slightly darker for dark mode visibility
        },
        
        'm2-primary': {
          DEFAULT: '#000000',    // Referee Black
          light: '#000000',
          dark: '#E5E5E5',       // Light gray for dark mode
        },
        'm2-secondary': {
          DEFAULT: '#FFDD00',    // Whistle Yellow
          light: '#FFDD00',
          dark: '#F1C40F',       // Slightly adjusted yellow
        },
        'm2-accent': {
          DEFAULT: '#F0F0F0',    // Light Gray
          light: '#F0F0F0',
          dark: '#424242',       // Darker gray for dark mode
        },
        
        'm3-primary': {
          DEFAULT: '#C8102E',    // Regulation Red
          light: '#C8102E',
          dark: '#FF6B6B',       // Lighter red for dark mode
        },
        'm3-secondary': {
          DEFAULT: '#4A4A4A',    // Dark Gray
          light: '#4A4A4A',
          dark: '#B0B0B0',       // Light gray for dark mode
        },
        'm3-accent': {
          DEFAULT: '#FFD6DC',    // Light Red
          light: '#FFD6DC',
          dark: '#F1948A',       // Adjusted light red
        },
        
        'm4-primary': {
          DEFAULT: '#000000',    // Official Black
          light: '#000000',
          dark: '#E5E5E5',       // Light for dark mode
        },
        'm4-secondary': {
          DEFAULT: '#FFFFFF',    // Signal White
          light: '#FFFFFF',
          dark: '#2C2C2C',       // Dark gray for dark mode
        },
        'm4-accent': {
          DEFAULT: '#CCCCCC',    // Striped Gray
          light: '#CCCCCC',
          dark: '#757575',       // Medium gray for dark mode
        },
        
        'm5-primary': {
          DEFAULT: '#007A33',    // Court Green
          light: '#007A33',
          dark: '#4CAF50',       // Lighter green for dark mode
        },
        'm5-secondary': {
          DEFAULT: '#D2B48C',    // Wood Tan
          light: '#D2B48C',
          dark: '#A68B5B',       // Darker tan for dark mode
        },
        'm5-accent': {
          DEFAULT: '#FFFFFF',    // Line White
          light: '#FFFFFF',
          dark: '#2C2C2C',       // Dark for dark mode
        },
        
        'm6-primary': {
          DEFAULT: '#0066CC',    // Fundamentals Blue
          light: '#0066CC',
          dark: '#5DADE2',       // Lighter blue for dark mode
        },
        'm6-secondary': {
          DEFAULT: '#FF7F00',    // Orange
          light: '#FF7F00',
          dark: '#FF8C42',       // Slightly brighter orange
        },
        'm6-accent': {
          DEFAULT: '#CCE5FF',    // Light Blue
          light: '#CCE5FF',
          dark: '#85C1E9',       // Adjusted light blue
        },
        
        'm7-primary': {
          DEFAULT: '#6A0DAD',    // Control Purple
          light: '#6A0DAD',
          dark: '#AF7AC5',       // Lighter purple for dark mode
        },
        'm7-secondary': {
          DEFAULT: '#FF7F00',    // Orange
          light: '#FF7F00',
          dark: '#FF8C42',       // Consistent with m6
        },
        'm7-accent': {
          DEFAULT: '#E6D6FF',    // Light Purple
          light: '#E6D6FF',
          dark: '#BB8FCE',       // Adjusted light purple
        },
        
        'm8-primary': {
          DEFAULT: '#C8102E',    // Precision Red
          light: '#C8102E',
          dark: '#FF6B6B',       // Consistent with m3
        },
        'm8-secondary': {
          DEFAULT: '#FFFFFF',    // Net White
          light: '#FFFFFF',
          dark: '#2C2C2C',       // Consistent with m4
        },
        'm8-accent': {
          DEFAULT: '#FFD6DC',    // Light Red
          light: '#FFD6DC',
          dark: '#F1948A',       // Consistent with m3
        },
        
        'm9-primary': {
          DEFAULT: '#0C2340',    // Strategy Blue
          light: '#0C2340',
          dark: '#5499C7',       // Lighter strategy blue
        },
        'm9-secondary': {
          DEFAULT: '#C0C0C0',    // Silver
          light: '#C0C0C0',
          dark: '#909090',       // Darker silver for dark mode
        },
        'm9-accent': {
          DEFAULT: '#D6E4FF',    // Light Blue
          light: '#D6E4FF',
          dark: '#AED6F1',       // Adjusted light blue
        },
        
        'm10-primary': {
          DEFAULT: '#008080',    // Communication Teal
          light: '#008080',
          dark: '#48C9B0',       // Lighter teal for dark mode
        },
        'm10-secondary': {
          DEFAULT: '#808080',    // Gray
          light: '#808080',
          dark: '#A6A6A6',       // Lighter gray for dark mode
        },
        'm10-accent': {
          DEFAULT: '#CCF2F2',    // Light Teal
          light: '#CCF2F2',
          dark: '#7FB3D3',       // Adjusted light teal
        },
        
        'm11-primary': {
          DEFAULT: '#654321',    // Organization Brown
          light: '#654321',
          dark: '#B7950B',       // Lighter brown for dark mode
        },
        'm11-secondary': {
          DEFAULT: '#D2B48C',    // Tan
          light: '#D2B48C',
          dark: '#A68B5B',       // Consistent with m5
        },
        'm11-accent': {
          DEFAULT: '#F5E8D3',    // Light Tan
          light: '#F5E8D3',
          dark: '#D7DBDD',       // Neutral light for dark mode
        },
        
        'm12-primary': {
          DEFAULT: '#0066CC',    // Science Blue
          light: '#0066CC',
          dark: '#5DADE2',       // Consistent with m6
        },
        'm12-secondary': {
          DEFAULT: '#00A86B',    // Green
          light: '#00A86B',
          dark: '#58D68D',       // Lighter green for dark mode
        },
        'm12-accent': {
          DEFAULT: '#CCE5FF',    // Light Blue
          light: '#CCE5FF',
          dark: '#85C1E9',       // Consistent with m6
        }
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      fontSize: {
        // Fluid typography with clamp() for responsive scaling
        'hero': ['clamp(3rem, 8vw, 7rem)', { lineHeight: '0.85', letterSpacing: '-0.02em', fontWeight: '700' }],
        'hero-mobile': ['clamp(2.5rem, 10vw, 3.5rem)', { lineHeight: '0.9', letterSpacing: '-0.02em', fontWeight: '700' }], 
        'section': ['clamp(2rem, 5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.01em', fontWeight: '600' }],
        'large': ['clamp(1.5rem, 3vw, 2.5rem)', { lineHeight: '1.2', fontWeight: '500' }],
        'body-large': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'small': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'tiny': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.1em', fontWeight: '500' }],
        // Display sizes for special cases
        'display': ['clamp(4rem, 12vw, 8rem)', { lineHeight: '0.8', letterSpacing: '-0.025em', fontWeight: '800' }],
        'subtitle': ['clamp(1.25rem, 2.5vw, 1.5rem)', { lineHeight: '1.3', fontWeight: '500' }],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
        '4xl': '96px',
        // Direct spacing values
        'hero': '12rem',
        'section': '6rem',
        'spacing-large': '3rem',
        'spacing-medium': '1.5rem',
        'spacing-small': '1rem',
        // Mobile-optimized touch targets
        'touch': '44px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        'md': '0 4px 6px rgba(0,0,0,0.1)',
        'lg': '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
      },
      transitionDuration: {
        'fast': '200ms',
        'medium': '400ms', 
        'slow': '600ms',
        'extra-slow': '800ms',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '0.8' }
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}