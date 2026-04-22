/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        byahero: {
          navy: "#0A2463",
          yellow: "#FFD60A",
          blue: "#1E3A8A",
          sky: "#60A5FA",
          "sky-light": "#DBEAFE",
          text: "#0A2463",
          muted: "#64748B",
          accent: "#FFD60A",
        },
      },
      fontFamily: {
        sans: ["Nunito", "sans-serif"],
        brand: ["Baloo 2", "cursive"],
      },
      boxShadow: {
        card: "0 8px 32px rgba(10, 36, 99, 0.08)",
        glass: "0 8px 32px 0 rgba(10, 36, 99, 0.05)",
        yellow: "0 0 20px rgba(255, 214, 10, 0.4)",
      },
      keyframes: {
        "slide-up": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        drive: {
          "0%": { transform: "translateX(-20%)" },
          "100%": { transform: "translateX(120%)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "slide-up": "slide-up 400ms cubic-bezier(0.32, 0.72, 0, 1)",
        drive: "drive 3s infinite linear",
        "gradient-slow": "gradient-shift 10s ease infinite",
      },
    },
  },
  plugins: [],
};

