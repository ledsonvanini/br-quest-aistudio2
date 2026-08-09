/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brasil: {
          green: '#009b3a',
          yellow: '#fedf00',
          blue: '#002776',
          darkBlue: '#00133a',
          lightGreen: '#00c84c',
          warmWhite: '#faf8f5',
          sand: '#f4ede2',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
