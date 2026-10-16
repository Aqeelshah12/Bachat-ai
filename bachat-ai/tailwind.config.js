/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#16302B",
        sand: "#F2E8D5",
        paper: "#FAF6EE",
        marigold: "#E8A33D",
        rose: "#B5395C",
        charcoal: "#21201C",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Work Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
