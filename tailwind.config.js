module.exports = {
  content: ['./views/**/*.ejs', './public/**/*.html'],
  theme: {
    extend: {},
  },
  safelist: [
    'bg-flash-error',
    'bg-flash-success',
    'bg-flash-warning',
    'bg-flash-info',
    'text-flash-error',
    'text-flash-success',
    'text-flash-warning',
    'text-flash-info',
  ],
  plugins: [],
};
