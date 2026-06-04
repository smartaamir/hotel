/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "var(--gold)",
          light: "var(--gold-light)",
          glow: "var(--gold-glow)",
        },
        dark: {
          DEFAULT: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          tertiary: "var(--bg-tertiary)",
        }
      },
      fontFamily: {
        title: ["var(--font-title)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      }
    },
  },
  plugins: [],
}
