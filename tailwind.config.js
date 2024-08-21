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
      'serif': ["Play", 'sans-serif']
    }
  },
  plugins: [
    require('tailwindcss-animated')
  ],
}