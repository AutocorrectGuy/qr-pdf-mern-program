module.exports = {
  content: ["./src/**/*.{js,jsx,css}"],
  theme: {
    extend: {
      fontFamily: {
        metrophobic: ["Metrophobic", "sans-serif"]
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1600px',
        '4xl': '1850px'
      }
    }
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
