import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        saffron: {
          50: "#FDF7EB",
          100: "#F9EBCE",
          200: "#F2D89C",
          300: "#E6BE6A",
          400: "#D99E3E",
          500: "#C48A2A",
          600: "#A6731F",
          700: "#8A6118",
          800: "#6D4D13",
          900: "#523A0E",
        },
        ink: {
          0: "#FFFFFF",
          50: "#FAF7EF",
          100: "#F2EDE1",
          200: "#E5DCCA",
          300: "#D9D0B6",
          400: "#A89E86",
          500: "#78756F",
          600: "#5C554A",
          700: "#4C4536",
          800: "#25201A",
          900: "#100E08",
          950: "#08060A",
        },
        zone: {
          recovery: "#94A3B8",
          aerobic: "#3B82F6",
          tempo: "#10B981",
          threshold: "#F59E0B",
          vo2max: "#EF4444",
          rep: "#A855F7",
        },
        workout: {
          easy: "#94A3B8",
          long: "#3B82F6",
          tempo: "#10B981",
          interval: "#F59E0B",
          race: "#C48A2A",
          fartlek: "#8B5CF6",
          rest: "#D9D0B6",
          crosstrain: "#06B6D4",
          feel: "#EC4899",
        },
        readiness: {
          fresh: "#3F6B4A",
          normal: "#1F4A6B",
          tired: "#C48A2A",
          strained: "#7E2E2E",
        },
        paper: {
          base: "#EEE9DC",
          note: "#F4EFE3",
          dark: "#E1DBC9",
          edge: "#CEC5B1",
          "dark-base": "#1A1612",
          "dark-note": "#27211A",
        },
        // Semantic tokens bound to CSS variables for light/dark parity
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
        hand: ["var(--font-shantell)", "cursive"],
      },
      borderRadius: {
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
      },
      transitionTimingFunction: {
        "out-soft": "cubic-bezier(0, 0, 0.2, 1)",
        "in-out-soft": "cubic-bezier(0.4, 0, 0.2, 1)",
        emphasis: "cubic-bezier(0.2, 0, 0, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
