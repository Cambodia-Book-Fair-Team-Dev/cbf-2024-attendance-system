/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#7380ec",
        danger: "#ff7782",
        success: "#41f1b6",
        warning: "#ffbb55",
        white: "#fff",
        info: "#7d8da1",
        dark: "#363949",
        light: "rgba(132, 139, 200, 0.18)",
        "dark-variant": "#677483",
        background: "#f6f6f9",
      },
      borderRadius: {
        'card': "2rem",
        '1': "0.4rem",
        '2': "1.2rem",
      },
      boxShadow: {
        'card': "0 2rem 3rem rgba(132, 139, 200, 0.18)",
      },
      fontFamily: {
        cairo: ['"Cairo"', "sans-serif"],
        poppins: ['"Poppins"', "sans-serif"],
        kantumruy: ['"Kantumruy Pro"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
