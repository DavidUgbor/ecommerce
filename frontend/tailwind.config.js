/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3D1A00',
          50: '#FFF8F0',
          100: '#FFE8D0',
          200: '#FFD0A0',
          300: '#FFB870',
          400: '#E8943A',
          500: '#C9860A',
          600: '#A06800',
          700: '#784F00',
          800: '#503600',
          900: '#3D1A00',
          950: '#2A0D00',
        },
        accent: {
          DEFAULT: '#C9860A',
          light: '#E8A92A',
          dark: '#A06800',
        },
        cream: {
          DEFAULT: '#FFF8F0',
          50: '#FFFDFB',
          100: '#FFF8F0',
          200: '#FFEEDD',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 4px 24px rgba(61, 26, 0, 0.12)',
        'luxury-lg': '0 8px 40px rgba(61, 26, 0, 0.16)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
