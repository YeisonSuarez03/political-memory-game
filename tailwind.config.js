/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        bangers: ['Bangers', 'cursive'],
        oswald: ['Oswald', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
      },
      colors: {
        comic: {
          red:    '#D91E18',
          'red-dark': '#A31510',
          blue:   '#1A3A8F',
          'blue-dark': '#102569',
          yellow: '#F5C800',
          'yellow-dark': '#C9A100',
          black:  '#111111',
          cream:  '#FFF9E6',
          paper:  '#EDE8D0',
        },
      },
      boxShadow: {
        comic: '4px 4px 0px #111111',
        'comic-lg': '6px 6px 0px #111111',
        'comic-inset': 'inset 2px 2px 0px rgba(255,255,255,0.3)',
      },
      backgroundImage: {
        'halftone': "radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
