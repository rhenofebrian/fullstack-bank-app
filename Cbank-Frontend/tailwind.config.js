/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./layouts/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#1D4ED8",
        secondary: "#3B82F6",
        dark: "#1E293B",
        light: "#F8FAFC",
        accent: "#93C5FD",
      },
      fontFamily: {
        inter: ["Horticulture", "sans-serif"],
        roboto: ["Cabinet Grotesk", "sans-serif"],
      },
    },
  },
  plugins: [],
};
