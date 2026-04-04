/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e0f7ff',
          100: '#b3ecff',
          200: '#80dfff',
          300: '#4dd2ff',
          400: '#26c8ff',
          500: '#00beff',
          600: '#00a8e6',
          700: '#008ec0',
          800: '#007399',
          900: '#005266',
        },
        dark: {
          50: '#e8e8f0',
          100: '#c4c4d8',
          200: '#9d9dbf',
          300: '#7676a5',
          400: '#585892',
          500: '#3b3b7f',
          600: '#2e2e6b',
          700: '#202054',
          800: '#13133d',
          900: '#080826',
          950: '#04041a',
        },
        accent: '#ff6b35',
        success: '#00d68f',
        warning: '#ffb347',
        danger: '#ff4757',
      },
      fontFamily: {
        display: ['"Exo 2"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #04041a 0%, #13133d 40%, #202054 70%, #2e2e6b 100%)',
        'card-gradient': 'linear-gradient(145deg, rgba(32,32,84,0.8), rgba(8,8,38,0.9))',
      },
    },
  },
  plugins: [],
}