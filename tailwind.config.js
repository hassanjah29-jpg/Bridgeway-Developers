/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef2f7',
          100: '#d3ddea',
          200: '#a7bbd5',
          300: '#7398bf',
          400: '#4a6f9e',
          500: '#2f4d75',
          600: '#1f3a5c',
          700: '#152a44',
          800: '#0d1c2e',
          900: '#0a1622',
          950: '#060e17',
        },
        gold: {
          50: '#fbf7ed',
          100: '#f5ebd0',
          200: '#ead49d',
          300: '#dfb968',
          400: '#d4a23f',
          500: '#c6892b',
          600: '#a86a22',
          700: '#874e1f',
          800: '#6f3f20',
          900: '#5e351f',
        },
        charcoal: {
          DEFAULT: '#1a1d23',
          light: '#2a2e36',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 20px 60px -15px rgba(10, 22, 34, 0.25)',
        'gold-glow': '0 10px 40px -10px rgba(198, 137, 43, 0.45)',
        card: '0 8px 30px -8px rgba(13, 28, 46, 0.18)',
      },
      backgroundImage: {
        'navy-gradient': 'linear-gradient(135deg, #0a1622 0%, #152a44 50%, #1f3a5c 100%)',
        'gold-gradient': 'linear-gradient(135deg, #d4a23f 0%, #c6892b 100%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slow-zoom': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.12)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease-out forwards',
        'fade-in': 'fade-in 1s ease-out forwards',
        'slow-zoom': 'slow-zoom 18s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
