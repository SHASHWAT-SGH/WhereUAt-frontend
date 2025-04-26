/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e0e7ff",
          100: "#c7d2fe",
          200: "#a5b4fc",
          300: "#818cf8",
          400: "#6366f1",
          500: "#4f46e5",
          600: "#4338ca",
          700: "#3730a3",
          800: "#312e81",
          900: "#1e1b4b",
        },
      },
    },
  },
  plugins: [],
};
