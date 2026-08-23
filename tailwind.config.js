/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00355F',
          50: '#EFF7FF',
          100: '#D9ECFF',
          200: '#B8D9F7',
          300: '#8EBDF9',
          400: '#5D9ED8',
          500: '#2D6197',
          600: '#0F4C81',
          700: '#00355F',
          800: '#002B4D',
          900: '#001C37',
        },

        secondary: {
          DEFAULT: '#006492',
          50: '#EFF9FF',
          100: '#D6F0FF',
          200: '#B7E3FF',
          300: '#8CCDFF',
          400: '#58BCFD',
          500: '#299ED3',
          600: '#006492',
          700: '#004B6F',
          800: '#003A57',
          900: '#001E2F',
        },

        surface: {
          DEFAULT: '#F7FAFC',
          low: '#F1F4F6',
          container: '#EBEEF0',
          high: '#E5E9EB',
          highest: '#E0E3E5',
        },

        content: {
          DEFAULT: '#181C1E',
          muted: '#42474F',
          subtle: '#727780',
        },

        outline: {
          DEFAULT: '#727780',
          light: '#C2C7D1',
        },
      },

      boxShadow: {
        login: '0 4px 20px rgba(0, 53, 95, 0.15)',
        button: '0 2px 4px rgba(0, 53, 95, 0.20)',
      },
    },
  },
};
