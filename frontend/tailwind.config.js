/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Light theme (primary)
        page:   '#FAF9F7',   // warm off-white page background
        canvas: '#F2EBE0',   // warm cream section background
        ink: {
          DEFAULT: '#1A150E', // primary text
          muted:   '#7A6652', // secondary text
          faint:   '#B0A090', // placeholder / disabled
        },
        sand: {
          DEFAULT: '#E8DDD0', // borders
          light:   '#F0EAE2', // very light borders
        },
        // Accent — cognac amber
        accent: {
          DEFAULT: '#C47B2A',
          light:   '#D9952F',
          dark:    '#A06020',
        },
        // Dark theme (cart drawer, footer)
        dark: {
          DEFAULT: '#0C0806',
          50:  '#1A1209',
          100: '#221810',
          200: '#2E2014',
          300: '#3A2818',
          400: '#4A3220',
        },
        // Legacy — kept for CartDrawer & pages not yet migrated
        cream: {
          DEFAULT: '#F5EDD6',
          muted:   '#A08060',
        },
        primary: {
          DEFAULT: '#3D1A00',
          900: '#3D1A00',
          800: '#503600',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card':      '0 1px 4px rgba(0,0,0,0.08)',
        'card-hover':'0 4px 16px rgba(0,0,0,0.12)',
        'luxury':    '0 4px 24px rgba(0,0,0,0.4)',
        'luxury-lg': '0 8px 40px rgba(0,0,0,0.5)',
        'glow':      '0 0 20px rgba(196,123,42,0.25)',
      },
      animation: {
        'fade-in':        'fadeIn 0.3s ease-in-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-up':       'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn:       { '0%': { opacity:'0' }, '100%': { opacity:'1' } },
        slideInRight: { '0%': { transform:'translateX(100%)' }, '100%': { transform:'translateX(0)' } },
        slideUp:      { '0%': { transform:'translateY(20px)', opacity:'0' }, '100%': { transform:'translateY(0)', opacity:'1' } },
      },
    },
  },
  plugins: [],
};
