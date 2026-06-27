import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ============================================================
      // DESIGN SYSTEM COLORS - Luxury Island Vibe
      // ============================================================
      colors: {
        // Primary - Deep Navy (luxury, trust, depth)
        primary: {
          DEFAULT: '#0A2A4A',
          50: '#E8F4F8',
          100: '#D1E9F1',
          200: '#A3D3E3',
          300: '#75BDD5',
          400: '#47A7C7',
          500: '#1A91B9',
          600: '#0A2A4A',
          700: '#082338',
          800: '#051C26',
          900: '#031414',
        },
        // Accent - Teal/Tosca (fresh, tropical, alive)
        accent: {
          DEFAULT: '#1ABC9C',
          50: '#E6F9F6',
          100: '#C2F2EB',
          200: '#9EE6DF',
          300: '#7ADAD3',
          400: '#56CDC7',
          500: '#1ABC9C',
          600: '#15937D',
          700: '#106A5E',
          800: '#0A413F',
          900: '#051820',
        },
        // Gold - Premium highlights
        gold: {
          DEFAULT: '#F1C40F',
          50: '#FEFCE8',
          100: '#FEF9C3',
          200: '#FEF08A',
          300: '#FDE047',
          400: '#F1C40F',
          500: '#D4A80A',
          600: '#A98C07',
          700: '#7E7005',
          800: '#535402',
          900: '#283800',
        },
        // Text colors
        text: {
          primary: '#1A1A2E',
          secondary: '#4A5568',
          muted: '#718096',
        },
        // Background colors
        background: {
          DEFAULT: '#F8FBFF',
          light: '#FFFFFF',
          dark: '#0A2A4A',
        },
        // Legacy support (for existing components)
        navy: {
          DEFAULT: '#0A2A4A',
          50: '#E8F4F8',
          100: '#D1E9F1',
          200: '#A3D3E3',
          300: '#75BDD5',
          400: '#47A7C7',
          500: '#1A91B9',
          600: '#0A2A4A',
          700: '#082338',
          800: '#051C26',
          900: '#031414',
        },
        teal: {
          DEFAULT: '#1ABC9C',
          50: '#E6F9F6',
          100: '#C2F2EB',
          200: '#9EE6DF',
          300: '#7ADAD3',
          400: '#56CDC7',
          500: '#1ABC9C',
          600: '#15937D',
          700: '#106A5E',
          800: '#0A413F',
          900: '#051820',
        },
      },

      // ============================================================
      // TYPOGRAPHY - Playfair Display + Plus Jakarta Sans
      // ============================================================
      fontFamily: {
        // Display/Headings - Elegant, Island Luxury Feel
        display: ['Playfair Display', 'Georgia', 'serif'],
        // Body - Modern, Readable
        body: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        // Legacy support
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        heading: ['Playfair Display', 'Georgia', 'serif'],
      },

      // ============================================================
      // FONT SIZES - Luxury Scale
      // ============================================================
      fontSize: {
        'display-xs': ['0.75rem', { lineHeight: '1' }],
        'display-sm': ['0.875rem', { lineHeight: '1.2' }],
        'display-base': ['1rem', { lineHeight: '1.4' }],
        'display-lg': ['1.125rem', { lineHeight: '1.4' }],
        'display-xl': ['1.25rem', { lineHeight: '1.4' }],
        'display-2xl': ['1.5rem', { lineHeight: '1.3' }],
        'display-3xl': ['1.875rem', { lineHeight: '1.2' }],
        'display-4xl': ['2.25rem', { lineHeight: '1.2' }],
        'display-5xl': ['3rem', { lineHeight: '1.1' }],
        'display-6xl': ['3.75rem', { lineHeight: '1.05' }],
        'display-7xl': ['4.5rem', { lineHeight: '1' }],
        'display-8xl': ['6rem', { lineHeight: '1' }],
        'display-9xl': ['8rem', { lineHeight: '1' }],
      },

      // ============================================================
      // SPACING - Generous Whitespace
      // ============================================================
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
        '42': '10.5rem',
        '46': '11.5rem',
        '50': '12.5rem',
        '56': '14rem',
        '62': '15.5rem',
        '68': '17rem',
        '74': '18.5rem',
        '80': '20rem',
        '88': '22rem',
        '96': '24rem',
        '102': '25.5rem',
        '114': '28.5rem',
        '128': '32rem',
      },

      // ============================================================
      // BORDER RADIUS - Soft, Modern
      // ============================================================
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },

      // ============================================================
      // SHADOWS - Subtle, Premium
      // ============================================================
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(10, 42, 74, 0.08), 0 10px 20px -2px rgba(10, 42, 74, 0.04)',
        'medium': '0 10px 40px -10px rgba(10, 42, 74, 0.15)',
        'large': '0 25px 50px -12px rgba(10, 42, 74, 0.25)',
        'glow': '0 0 40px rgba(26, 188, 156, 0.3)',
        'gold-glow': '0 0 30px rgba(241, 196, 15, 0.3)',
      },

      // ============================================================
      // BACKDROP BLUR
      // ============================================================
      backdropBlur: {
        'xs': '2px',
      },

      // ============================================================
      // ANIMATION
      // ============================================================
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'slide-in': 'slideIn 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },

      // ============================================================
      // TRANSITION TIMING
      // ============================================================
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
    },
  },
  plugins: [],
}
export default config