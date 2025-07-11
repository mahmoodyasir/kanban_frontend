/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  important: "#root",
  theme: {
    extend: {
      fontFamily: {
        alegreya: ['Alegreya', 'serif'],
      },
    },
  },
  plugins: [],
}

