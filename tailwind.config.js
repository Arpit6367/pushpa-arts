/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        admin: {
          bg: "#fbfbfd",
          accent: "#0071e3",
          gold: "#bf9140",
          primary: "#1d1d1f",
          secondary: "#86868b",
          border: "rgba(0, 0, 0, 0.08)",
        },
        luxury: {
          gold: "#B8860B",
          goldLight: "#D4AF37",
          bg: "#FCFAF8",
          dark: "#1F1F1F",
        }
      },
      fontFamily: {
        heading: ["Cormorant Garamond", "serif"],
        body: ["Montserrat", "sans-serif"],
      },
      borderRadius: {
        'admin': '12px',
      }
    },
  },
  plugins: [],
};
