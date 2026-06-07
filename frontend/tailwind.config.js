/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#0C0806',
          50:  '#1A1209',
          100: '#221810',
          200: '#2E2014',
          300: '#3A2818',
          400: '#4A3220',
        },
        accent: {
          DEFAULT: '#C9860A',
          light:   '#E8A92A',
          dark:    '#A06800',
        },
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
        'luxury':    '0 4px 24px rgba(0,0,0,0.4)',
        'luxury-lg': '0 8px 40px rgba(0,0,0,0.5)',
        'glow':      '0 0 20px rgba(201,134,10,0.3)',
      },
      animation: {
        'fade-in':       'fadeIn 0.3s ease-in-out',
        'slide-in-right':'slideInRight 0.3s ease-out',
        'slide-up':      'slideUp 0.3s ease-out',
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
