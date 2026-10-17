/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sakura: {
          50: '#fff0f3',
          100: '#ffe3e8',
          200: '#fecdd6',
          300: '#fea3b4',
          400: '#fd6b88',
          500: '#f43f68',
          600: '#e11d4d',
          700: '#be123e',
          800: '#9f1237',
          900: '#841433',
        },
        berry: {
          900: '#1e1423',
          800: '#2a1a33',
          700: '#3d2549',
          600: '#553466',
        }
      },
      boxShadow: {
        'kawaii': '0 8px 30px rgba(244, 63, 104, 0.15)',
        'kawaii-lg': '0 12px 40px rgba(244, 63, 104, 0.25)',
        'glow-pink': '0 0 20px rgba(254, 163, 180, 0.6)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
  },
  plugins: [],
}
