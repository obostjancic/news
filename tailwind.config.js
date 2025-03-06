/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        newspaper: ["Georgia", "Times New Roman", "serif"],
      },
      colors: {
        newsprint: {
          background: "#f4f4f4",
          text: "#333333",
          headline: "#000000",
        },
      },
    },
  },
  plugins: [],
};
