module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#fffdf9',
          100: '#f8f1e7',
          200: '#f0e3d2',
          300: '#e4d2b0',
          400: '#d3b07a'
        },
        ink: {
          50: '#f5efe9',
          100: '#d7c8b9',
          200: '#bca78d',
          300: '#8f725d',
          400: '#4f433d',
          500: '#2d2826',
          600: '#1f1b1a',
          700: '#171312'
        },
        // Palette "midnight" : alias proche de `ink` utilisée par l'UI admin
        midnight: {
          50: '#f5efe9',
          100: '#d7c8b9',
          200: '#bca78d',
          300: '#8f725d',
          400: '#4f433d',
          500: '#2d2826',
          600: '#1f1b1a',
          700: '#171312',
          800: '#0b0b0b'
        },
        amber: {
          50: '#fff5e2',
          100: '#f6d9a7',
          200: '#e7b76a',
          300: '#d9902d',
          400: '#b76818'
        },
        forest: {
          50: '#edf2ee',
          100: '#cfe1d6',
          200: '#9ec0ad',
          300: '#5f8f76',
          400: '#274a3d'
        }
      },
      boxShadow: {
        editorial: '0 24px 60px rgba(42, 27, 18, 0.12)'
      }
    }
  },
  plugins: []
};
