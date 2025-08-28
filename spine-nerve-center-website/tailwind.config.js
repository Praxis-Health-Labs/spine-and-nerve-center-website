/** @type {import('tailwindcss').Config} */
module.exports = {
  // UPDATE THIS SECTION
  content: [
    './src/**/*.{html,js}',
  ],
  theme: {
    // YOUR EXCELLENT THEME EXTENSIONS ARE PERFECT
    extend: {
      colors: {
        'primary': {
          50: '#e6f1f7',
          100: '#cce3ef',
          200: '#99c7df',
          300: '#66aacf',
          400: '#338ebf',
          500: '#074163',
          600: '#063a59',
          700: '#05324f',
          800: '#042b45',
          900: '#03233b',
        },
        'secondary': {
          50: '#e8f7fb',
          100: '#d1eff7',
          200: '#a3dfef',
          300: '#75cfe7',
          400: '#44B4D6',
          500: '#3ca0c2',
          600: '#348cae',
          700: '#2c789a',
          800: '#246486',
          900: '#1c5072',
        },
        'accent': '#2EA043',
        'text-dark': '#1A2E3B',
        'text-light': '#64748b',
        'border-light': '#e2e8f0',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'heading': ['Poppins', 'system-ui', 'sans-serif'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },
  },
  // We will add a plugin in the next section
  plugins: [
    require('@tailwindcss/forms'),
  ],
}