/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "rgb(var(--color-ivory) / <alpha-value>)",
        cream: "rgb(var(--color-cream) / <alpha-value>)",
        linen: "rgb(var(--color-linen) / <alpha-value>)",
        charcoal: "rgb(var(--color-charcoal) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        clay: "rgb(var(--color-clay) / <alpha-value>)",
        cocoa: "rgb(var(--color-cocoa) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)"
      },
      fontFamily: { display: ["Cormorant Garamond", "Georgia", "serif"], sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"] },
      boxShadow: { soft: "0 20px 60px rgba(58, 47, 40, 0.08)" }
    }
  },
  plugins: []
};
