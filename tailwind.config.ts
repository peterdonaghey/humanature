import type {Config} from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    // Include ALL gradient classes - any color, any shade, any direction
    {pattern: /^(from|via|to)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900)$/},
    {pattern: /^bg-gradient-to-(t|tr|r|br|b|bl|l|tl)$/},
    {pattern: /^text-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900)$/}
  ],
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
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
