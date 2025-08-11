module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'mu-primary': 'var(--mu-primary)',
        'mu-on-primary': 'var(--mu-on-primary)'
      }
    }
  },
  plugins: []
}
