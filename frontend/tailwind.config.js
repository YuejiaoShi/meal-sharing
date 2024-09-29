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
          background: "#0c4022",
          text: "#ffffff",
        },
        lightMode: {
          background: "#9bebc9",
          text: "#0c4022",
        },
      },
    },
  },
  plugins: [],
};
