/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#FFD600",
        secondary: "#4361EE",
        background: "#F9FAFB",
        surface: "#FFFFFF",
        text: {
          primary: "#1A1A1A",
          secondary: "#6B7280",
          muted: "#9CA3AF",
        },
        success: "#4ECBA5",
        warning: "#F5A623",
        error: "#E8805A",
      },
    },
  },
  plugins: [],
};
