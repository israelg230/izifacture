import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#090a0f",
          900: "#111318",
          800: "#1a1e24",
          700: "#272c35",
          600: "#3d4450",
          500: "#5a6272",
          400: "#7c8597",
          300: "#a2acbe",
          200: "#cbd2df",
          100: "#e5e8ef",
          50: "#f4f6f9",
        },
        primary: {
          DEFAULT: "#111318",
          foreground: "#ffffff",
        },
        lavender: {
          50: "#f6f4ff",
          100: "#eeeaff",
          200: "#dcd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
        },
        brand: {
          purple: "#635bff",
          violet: "#7c5cfc",
          coral: "#ff6363",
          warm: "#fdf8f4",
        },
      },
      borderRadius: {
        "2.5xl": "1.25rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 2px 14px 0 rgba(0, 0, 0, 0.03)",
        card: "0 4px 24px -2px rgba(16, 24, 40, 0.04), 0 2px 6px -1px rgba(16, 24, 40, 0.02)",
        "card-hover": "0 20px 40px -10px rgba(124, 92, 252, 0.08), 0 1px 3px 0 rgba(0, 0, 0, 0.02)",
        pill: "0 6px 18px -4px rgba(17, 19, 24, 0.12)",
        glow: "0 0 30px -5px rgba(124, 92, 252, 0.25)",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "var(--font-inter)", "sans-serif"],
        display: ["var(--font-manrope)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
