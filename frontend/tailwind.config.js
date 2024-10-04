/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0c4022",
        darkMode: {
          bg: "#485d58",
          text: "#ffffff",
        },
        lightMode: {
          bg: "#9bebc9",
          text: "#0c4022",
        },
      },
    },
  },
  plugins: [],
};
