const plugin = require('tailwindcss/plugin');

module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      xs: '320px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      print: { raw: 'print' }, // => @media  print { ... }
    },
    spacing: {
      1: '0.5rem',
      2: '0.75rem',
      3: '1rem',
      4: '1.5rem',
      5: '2rem',
      6: '3rem',
      7: '4rem',
      8: '5rem',
      20: '30rem',
    },
    fontSize: {
      '2xs': '.625rem',
      xs: '.75rem',
      sm: '.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
    },
    extend: {
      // eslint-disable-next-line no-unused-vars
      typography: (theme) => ({
        DEFAULT: {
          css: {
            img: {
              'margin-top': '0',
              'margin-bottom': '0',
              display: 'inline',
            },
            Image: {
              'margin-top': '0',
              'margin-bottom': '0',
              display: 'inline',
            },
            hr: {
              'margin-top': '0.5rem',
              'margin-bottom': '1rem',
            },
          },
        },
      }),
    },
  },
  plugins: [
    // eslint-disable-next-line global-require
    require('@tailwindcss/typography'),
    plugin(({ addUtilities }) => {
      addUtilities({
        /* Hide scrollbar for Chrome, Safari and Opera */
        '.no-scrollbar::-webkit-scrollbar': {
          display: 'none',
        },
        /* Hide scrollbar for IE, Edge and Firefox */
        '.no-scrollbar': {
          '-ms-overflow-style': 'none' /* IE and Edge */,
          'scrollbar-width': 'none' /* Firefox */,
        },
      });
    }),
  ],
};
