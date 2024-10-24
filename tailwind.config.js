/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  "darkMode": "class",
  theme: {
    extend: {},
    fontFamily: {
      'serif': ["Play", 'sans-serif'],
      'titles': ["Changa", 'sans-serif'],
      'text': ["Mohave", 'sans-serif'],
      'buttons': ["Chakra Petch", 'sans-serif'],
    }
  },
  plugins: [
    require('tailwindcss-animated')
  ],
}