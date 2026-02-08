/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Logo color palette - exact colors from design
        'logo-red': '#FE4A2C',        // Red/orange
        'logo-yellow': '#FFC32E',     // Yellow/orange
        'logo-blue': '#00C4FF',       // Cyan/blue
        'dark-bg': '#000000',          // Pure black
        'dark-surface': '#000000',    // Pure black
      },
      fontFamily: {
        'bungee': ['Bungee', 'sans-serif'],
      },
      backgroundImage: {
        'logo-gradient': 'linear-gradient(135deg, #FE4A2C 0%, #FFC32E 50%, #00C4FF 100%)',
        'logo-gradient-full': 'linear-gradient(135deg, #FE4A2C, #FFC32E, #00C4FF)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow-red': 'glow-red 2s ease-in-out infinite alternate',
        'glow-yellow': 'glow-yellow 2s ease-in-out infinite alternate',
        'glow-blue': 'glow-blue 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow-red': {
          '0%': { boxShadow: '0 0 5px #FE4A2C, 0 0 10px #FE4A2C, 0 0 15px #FE4A2C' },
          '100%': { boxShadow: '0 0 10px #FE4A2C, 0 0 20px #FE4A2C, 0 0 30px #FE4A2C' },
        },
        'glow-yellow': {
          '0%': { boxShadow: '0 0 5px #FFC32E, 0 0 10px #FFC32E, 0 0 15px #FFC32E' },
          '100%': { boxShadow: '0 0 10px #FFC32E, 0 0 20px #FFC32E, 0 0 30px #FFC32E' },
        },
        'glow-blue': {
          '0%': { boxShadow: '0 0 5px #00C4FF, 0 0 10px #00C4FF, 0 0 15px #00C4FF' },
          '100%': { boxShadow: '0 0 10px #00C4FF, 0 0 20px #00C4FF, 0 0 30px #00C4FF' },
        },
      },
    },
  },
  plugins: [],
}
