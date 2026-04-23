import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent-ui))",
          foreground: "hsl(var(--accent-ui-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Sora", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "DM Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 18px 60px rgba(15, 23, 42, 0.12)",
        audit: "0 24px 80px rgba(15, 23, 42, 0.12)",
      },
      backgroundImage: {
        "audit-grid":
          "radial-gradient(circle at top right, rgba(82, 109, 255, 0.18), transparent 28%), radial-gradient(circle at bottom left, rgba(14, 165, 233, 0.14), transparent 24%), linear-gradient(180deg, rgba(255,255,255,0.98), rgba(247,249,252,0.98))",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        float: "float 7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
