// /** @type {import('tailwindcss').Config} */
const tailwindcss = require('tailwindcss');
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {},
  },
  plugins: [
    tailwindcss('./tailwind.js'),
    require('autoprefixer')
  ],
};