/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-ring': {
          '0%': {
            transform: 'scale(0.95)',
            boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.7)',
          },
          '70%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0 10px rgba(59, 130, 246, 0)',
          },
          '100%': {
            transform: 'scale(0.95)',
            boxShadow: '0 0 0 0 rgba(59, 130, 246, 0)',
          },
        },
      },
    },
  },
  plugins: [],
}