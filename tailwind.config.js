/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./cmd/web/**/*.html",
    "./cmd/web/**/*.templ",
    "./svelte/src/**/*.svelte",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
