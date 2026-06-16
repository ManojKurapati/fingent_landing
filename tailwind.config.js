/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "rgba(255, 255, 255, 0.08)",
        input: "rgba(255, 255, 255, 0.08)",
        ring: "rgba(255, 255, 255, 0.15)",
        background: "#030508",
        foreground: "#f8fafc",
        primary: {
          DEFAULT: "#f8fafc",
          foreground: "#030508",
        },
        secondary: {
          DEFAULT: "rgba(255, 255, 255, 0.05)",
          foreground: "#94a3b8",
        },
        destructive: {
          DEFAULT: "#f43f5e",
          foreground: "#f8fafc",
        },
        muted: {
          DEFAULT: "rgba(255, 255, 255, 0.03)",
          foreground: "#64748b",
        },
        accent: {
          DEFAULT: "rgba(255, 255, 255, 0.05)",
          foreground: "#f8fafc",
        },
        popover: {
          DEFAULT: "#080c16",
          foreground: "#f8fafc",
        },
        card: {
          DEFAULT: "rgba(8, 12, 22, 0.45)",
          foreground: "#f8fafc",
        },
      },
      borderRadius: {
        lg: "20px",
        md: "12px",
        sm: "8px",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Instrument Serif", "Georgia", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
}
