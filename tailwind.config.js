/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.{html,js}",
    "./assets/**/*.{html,js}",
    "./services/*.{html,js}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(253.83deg, #3F64B0 -44.61%, #0F3260 19.29%, #143768 43.8%, #002347 93.11%, #6B91F9 201.61%)",
      },
      colors: {
        orange: "#FBB610",
        blue: "#002347",
        "border-color": "#B0CFEF",
        page: "#E6F0FA",
        "custom-blue": "#BFCEE2",
      },
      borderWidth: {
        0.5: "0.5px",
      },
      backdropFilter: {
        61.5: "61.5px",
      },
    },
  },
  plugins: [require("tailwindcss-filters")],
};
