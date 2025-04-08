/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'kid-red': '#FF6B6B',
        'kid-teal': '#4ECDC4',
        'kid-yellow': '#FFD166',
        'kid-green': '#06D6A0',
        'kid-purple': '#9C89B8',
        'kid-pink': '#F7AEF8',
        'kid-bg': '#FAFFF5',
        'kid-text': '#413C58'
      },
      fontFamily: {
        'kid': ['KyoboHand', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      }
    },
  },
  plugins: [],
};
