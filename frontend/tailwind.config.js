<<<<<<< HEAD
/** TransitOps enterprise palette — mirrors src/config/theme.js. */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#C62828", hover: "#B71C1C" },
        success: "#2E7D32",
        warning: "#ED6C02",
        danger: "#D32F2F",
        info: "#1976D2",
        bg: "#F6F7F9",
        border: "#E5E7EB",
        text: { DEFAULT: "#1F2937", muted: "#6B7280", subtle: "#9CA3AF" },
        table: { header: "#F9FAFB", rowHover: "#F5F5F5" },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(0,0,0,0.04), 0 1px 3px 0 rgba(0,0,0,0.05)",
      },
    },
  },
  plugins: [],
};
=======
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
