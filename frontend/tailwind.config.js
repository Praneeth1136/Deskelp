/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#edf7ff',
          100: '#dceeff',
          500: '#1769aa',
          600: '#0d4f87',
          700: '#12355b',
          800: '#102f50',
          900: '#0f2742',
        },
      },
    },
  },
  plugins: [],
};

