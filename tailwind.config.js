/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        arena: {
          bg: "#0A0A0B",
          dark: "#0D0D0F",
          card: "#131316",
          elevated: "#18181C",
          border: "rgba(255, 255, 255, 0.08)",
          borderHover: "rgba(255, 255, 255, 0.16)",
          lime: "#CCFF00",
          limeBright: "#CCFF00",
          limeMuted: "rgba(204, 255, 0, 0.1)",
          text: "#EDEDEF",
          muted: "#8A8A93",
          subtle: "#5C5C66",
          red: "#F0455C",
          cyan: "#00F0FF",
        }
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'lime-sm': 'none',
        'lime-md': 'none',
        'lime-lg': 'none',
        'hud': '0 1px 0 rgba(255, 255, 255, 0.04) inset, 0 8px 24px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
