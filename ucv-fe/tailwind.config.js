import { fontFamily } from "tailwindcss/defaultTheme"

/** @type {import('tailwindcss').Config} */
export default {
  // ... other config
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
      },
      colors: {
        navy: {
          DEFAULT: '#002664',
        }
      },
      // ... other theme extensions
    },
  },
  // ... rest of config
} 