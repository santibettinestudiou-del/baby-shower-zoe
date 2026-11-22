/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      colors: {
        cream: '#FFFDF9',
        blush: {
          light: '#FFF0F3',
          DEFAULT: '#FADADD',
          rose: '#F4ACB7',
          deep: '#E07A8C'
        },
        honey: {
          light: '#FFF8D6',
          DEFAULT: '#FFF3B0',
          gold: '#F6BD60',
          amber: '#D99B26'
        },
        cocoa: {
          light: '#8A6A5C',
          DEFAULT: '#5C4033',
          dark: '#3E2A21'
        },
        sage: '#D8E2DC'
      },
      fontFamily: {
        serif: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Quicksand"', 'system-ui', 'sans-serif'],
        script: ['"Dancing Script"', 'cursive']
      },
      boxShadow: {
        storybook: '0 18px 40px -12px rgba(92, 64, 51, 0.12)',
        honey: '0 10px 25px -5px rgba(246, 189, 96, 0.35)',
        wax: '0 10px 20px rgba(181, 88, 106, 0.45), inset 0 2px 4px rgba(255, 255, 255, 0.6)'
      }
    }
  },
  plugins: []
};
