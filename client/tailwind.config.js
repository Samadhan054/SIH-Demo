/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        risk: {
          low: '#10B981',      // Emerald Green
          moderate: '#F59E0B', // Amber
          high: '#F97316',     // Orange
          severe: '#EF4444',   // Red
        },
      },
    },
  },
  plugins: [],
};
