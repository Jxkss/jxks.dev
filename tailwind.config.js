/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse-slow': 'pulse-slow 8s infinite ease-in-out',
        'pulse-slow-delay': 'pulse-slow-delay 10s infinite ease-in-out',
        'pulse-slow-delay2': 'pulse-slow-delay2 12s infinite ease-in-out',
        'float': 'float-around 20s infinite ease-in-out',
      },
    },
  },
  plugins: [],
}