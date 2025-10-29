module.exports = {
  plugins: [
    // Use the new PostCSS wrapper plugin for Tailwind
    require('@tailwindcss/postcss')(),
    require('autoprefixer')(),
  ],
};
