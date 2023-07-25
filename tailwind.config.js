/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", 'sans-serif', 'ui-sans-serif', 'system-ui'],
      },
      maxHeight: {
        '1/2': '50%',
        '3/4': '75%',
      }
    },
  },
  plugins: [],
};
