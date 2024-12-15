/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",               // scan your index.html file
    "./src/components/CharadesApp.jsx",   // scan all JS/JSX/TS/TSX files in src folder
  ],
  theme: {
    extend: {},
  },
  plugins: []
}

