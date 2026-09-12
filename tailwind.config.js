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
          bg: "#08080A",
          dark: "#0B0B0E",
          card: "#121318",
          elevated: "#181922",
          border: "rgba(255, 255, 255, 0.08)",
          borderHover: "rgba(255, 255, 255, 0.18)",
          lime: "#CCFF00",
          limeBright: "#E0FF4D",
          limeMuted: "rgba(204, 255, 0, 0.15)",
          text: "#F4F4F2",
          muted: "#888B96",
          subtle: "#4B4E5A",
          red: "#FF334B",
          cyan: "#00F0FF",
        }
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        sans: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'lime-sm': '0 0 15px rgba(204, 255, 0, 0.12)',
        'lime-md': '0 0 25px rgba(204, 255, 0, 0.25)',
        'lime-lg': '0 0 45px rgba(204, 255, 0, 0.35)',
        'hud': 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 10px 30px rgba(0, 0, 0, 0.7)',
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
