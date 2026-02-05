import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#17120f",
          raised: "#211a16",
          soft: "#2b241f",
          light: "#f1e7dc"
        },
        ember: {
          950: "#120d0a",
          900: "#17120f",
          850: "#1f1814",
          800: "#26201b",
          700: "#332a24",
          600: "#4c4038"
        },
        aubergine: {
          900: "#22171f",
          800: "#2c1f2a",
          700: "#3a2736"
        },
        accent: {
          DEFAULT: "#b07a86",
          soft: "#d9b6bf"
        },
        brass: {
          DEFAULT: "#b08d57",
          soft: "#d3bb90"
        },
        wine: {
          DEFAULT: "#7a2e3a",
          soft: "#a65f69"
        },
        petrol: {
          DEFAULT: "#2f4f55",
          soft: "#5d7a80"
        },
        ash: {
          DEFAULT: "#5b5551",
          soft: "#8a827d"
        },
        sand: {
          100: "#f3eae0",
          200: "#e8ddd0",
          300: "#d4c5b5",
          400: "#b09f8f"
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(14, 10, 8, 0.35)",
        lift: "0 6px 18px rgba(14, 10, 8, 0.4)"
      }
    }
  },
  plugins: []
};

export default config;
