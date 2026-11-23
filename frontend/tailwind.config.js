/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        swiggy: {
          orange: '#fc8019',
          orangeDark: '#e46d0a',
          orangeLight: '#fff2e5',
          black: '#282c3f',
          gray: '#686b78',
          grayLight: '#93959f',
          border: '#e9e9eb',
          bg: '#f1f1f6',
          green: '#3d9b6d',
          greenLight: '#eefaf2',
        },
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          500: '#fc8019',
          600: '#e46d0a',
          700: '#c2410c',
        }
      }
    },
  },
  plugins: [],
}
