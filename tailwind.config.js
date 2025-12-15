/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure this includes all your .jsx files
  ],
  theme: {
    extend: {
      colors: {
        purple: {600: '#8B5CF6'},
      },
    },
  },
  plugins: [],
}
