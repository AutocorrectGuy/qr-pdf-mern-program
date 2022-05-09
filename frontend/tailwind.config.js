module.exports = {
  content: ["./src/**/*.{js,jsx,css}"],
  theme: {
    extend: {
      fontFamily: {
        metrophobic: ["Metrophobic", "sans-serif"]
      },
      screens: {
        '3xl': '1600px',
        '4xl': '1850px'
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
