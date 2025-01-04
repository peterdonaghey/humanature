import type {Config} from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        fadeIn: "fadeIn 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": {opacity: "0", transform: "translateY(-10px)"},
          "100%": {opacity: "1", transform: "translateY(0)"},
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
