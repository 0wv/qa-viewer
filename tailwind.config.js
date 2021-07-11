const production = !process.env.ROLLUP_WATCH

module.exports = {
  purge: {
    content: [
      './src/**/*.svelte'
    ],
    enabled: production,
    safelist: [
      'bg-blue-50',
      'bg-blue-200',
      'bg-green-200',
      'bg-red-200',
      'bg-opacity-50',
      'text-green-600',
      'text-red-600'
    ]
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: []
}
