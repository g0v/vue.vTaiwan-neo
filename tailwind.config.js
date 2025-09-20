/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        '3xl': '1920px',
      },
      colors: {
        // 主色調
        'black': '#000000',
        'white': '#FFFFFF',
        // 強調色
        'democratic-red': '#D82000',
        // 輔助色
        'jade-green': '#008888',
        'wheat-yellow': '#DB7700',
        // 灰階
        'gray': {
          100: '#F8F8F8',
          200: '#E0E0E0',
          400: '#A0A0A0',
          700: '#505050',
        }
      },
      fontFamily: {
        'serif': ['"Noto Serif TC"', 'serif'],
      },
    },
  },
  plugins: [],
}
