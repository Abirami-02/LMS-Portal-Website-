/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#132238',
        navy: '#173b63',
        teal: '#0f9f9a',
        cream: '#f6f8f6',
        amber: '#f5b942',
      },
      boxShadow: {
        soft: '0 20px 60px rgba(19, 34, 56, 0.10)',
      },
    },
  },
  plugins: [],
}
