import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blush: "#ffdbe8",
        peach: "#ffe7d8",
        lavender: "#e9defd",
        cream: "#fffaf0",
        plum: "#6c4f75",
      },
      boxShadow: {
        soft: "0 10px 35px rgba(108, 79, 117, 0.12)",
      },
      borderRadius: {
        cute: "1.25rem",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
