/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      fontFamily: {
    
        body: ['NanumSquare', 'sans-serif'],
    
      },
    
    },
    
    screens: {
    
      sm: '480px',
    
      md: '768px',
    
      lg: '976px',
    
      xl: '1440px',
    
    },
  },
  plugins: [],
};
