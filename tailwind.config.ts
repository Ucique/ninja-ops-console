import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0b0f14",
          light: "#f6f7fb"
        },
        accent: {
          DEFAULT: "#5b8cff",
          soft: "#d9e4ff"
        }
      }
    }
  },
  plugins: []
};

export default config;
