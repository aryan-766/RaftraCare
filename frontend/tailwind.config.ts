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
        primary: {
          DEFAULT: "#2563EB",
          hover: "#1D4ED8",
          active: "#1E40AF",
          50: "#F5F8FF",
          100: "#EAF2FF",
          200: "#BFDBFE",
          500: "#2563EB",
          600: "#1D4ED8",
          700: "#1D40AF",
          800: "#173B73",
          900: "#0F264A",
        },
        deep: {
          DEFAULT: "#173B73",
          hover: "#122E5C",
        },
        soft: "#EAF2FF",
        tint: "#F5F8FF",
        background: {
          DEFAULT: "#F7F9FC",
          dark: "#0A0F1D",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          dark: "#111A2E",
          card: "#FFFFFF",
          cardDark: "#16223B",
        },
        foreground: {
          DEFAULT: "#172033",
          dark: "#F1F5F9",
          muted: "#667085",
          mutedDark: "#94A3B8",
        },
        border: {
          DEFAULT: "#E5EAF1",
          dark: "#1E2F52",
        },
        status: {
          success: "#15803D",
          warning: "#B7791F",
          danger: "#DC2626",
          info: "#2563EB",
        },
      },
      borderRadius: {
        card: "12px",
        btn: "8px",
        input: "8px",
        modal: "16px",
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
        card: "0 1px 3px 0 rgba(23, 59, 115, 0.06), 0 1px 2px -1px rgba(23, 59, 115, 0.04)",
        dropdown: "0 4px 12px 0 rgba(23, 59, 115, 0.12)",
        modal: "0 10px 25px -5px rgba(23, 59, 115, 0.15), 0 8px 10px -6px rgba(23, 59, 115, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
