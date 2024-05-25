
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    "./src/**/*.{html,js,tsx}", 
    "./node_modules/flowbite/**/*.js",
    'node_modules/flowbite-react/lib/esm/**/*.js',
    
  ],
  darkMode: 'className',
  theme: {    
    extend: {},
  },
  plugins: [],
};
