import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0f",
        surface: {
          DEFAULT: "#13131f",
          hi: "#1a1a2e",
        },
        coral: {
          DEFAULT: "#ff4d6d",
          hover: "#ff3357",
          muted: "rgba(255,77,109,0.12)",
        },
        mist: "#8b8b9e",
        chalk: "#f0f0f5",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;