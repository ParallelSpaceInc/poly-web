const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'MaruBuri': ['MaruBuri-Regular']
      },
      colors: {
        "google-blue": "#4285F4",
        "header-gray": "#444444",
      },
      transitionProperty: {
        ...defaultTheme,
        width: "width",
        height: "height",
      },
    },
  },
  plugins: [],
};
