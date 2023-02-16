/** @type {import('tailwindcss').Config} */
// const tailwindcss = require('tailwindcss');

module.exports = {
  content: [
    './public/index.html',
    './src/**/*.{js,jsx,ts,tsx}', 
    './src/*.{js,jsx,ts,tsx}', 
    './src/components/**/*.{js, jsx, ts, tsx, html}',
    './src/**/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // tailwindcss('./tailwind.js'),
    // require('autoprefixer')
  ],
};