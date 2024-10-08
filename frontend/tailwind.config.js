/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      "mw-3xl": { max: "1739px" },
      "mw-2xl": { max: "1535px" },
      // => @media (max-width: 1535px) { ... }

      "mw-xl": { max: "1279px" },
      // => @media (max-width: 1279px) { ... }

      "mw-lg": { max: "1023px" },
      // => @media (max-width: 1023px) { ... }

      "mw-md": { max: "767px" },
      // => @media (max-width: 767px) { ... }

      "mw-sm": { max: "639px" },
      // => @media (max-width: 639px) { ... }
      "miw-2xl": { min: "1535px" },
      // => @media (min-width: 1535px) { ... }

      "miw-xl": { min: "1279px" },
      // => @media (min-width: 1279px) { ... }

      "miw-lg": { min: "1023px" },
      // => @media (min-width: 1023px) { ... }

      "miw-md": { min: "767px" },
      // => @media (min-width: 767px) { ... }

      "miw-sm": { min: "639px" },
      // => @media (min-width: 639px) { ... }
    },
    extend: {
      boxShadow: {
        custom: "0 4px 8px rgba(0, 0, 0, 0.2)",
      },
    },
  },
  plugins: [],
};
