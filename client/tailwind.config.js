/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        byahero: {
          navy: "#042C53",
          blue: "#185FA5",
          gold: "#FAC775",
          green: "#1D9E75",
          light: "#E6F1FB",
          text: "#2C2C2A",
          muted: "#5F5E5A",
        },
      },
      boxShadow: {
        card: "0 8px 24px rgba(4, 44, 83, 0.10)",
      },
      keyframes: {
        "slide-up": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "slide-up": "slide-up 300ms cubic-bezier(0.32, 0.72, 0, 1)",
      },
    },
  },
  plugins: [],
};
