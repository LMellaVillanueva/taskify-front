/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  "darkMode": "class",
  theme: {
    extend: {
      keyframes: {
        slideFromRight: {
          'from': { transform: 'translateX(100%)', opacity: 0 },
          'to': { transform: 'translateX(0)', opacity: 1 },
        },
        outFromRight: {
          'from': { opacity: 1 },
          'to': { opacity: 0 },
        },
      },
      animation: {
        slideFromRight: 'slideFromRight 0.5s ease',
        outFromRight: 'outFromRight 1s ease',
      }
    },
  },
  plugins: [
    require('tailwindcss-animated')
  ],
}