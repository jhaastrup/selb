
const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
    // purge: {
    //     content: [
    //         "./pages/**/*.{js,ts,jsx,tsx}",
    //         "./components/**/*.{js,ts,jsx,tsx}",
    //         "./src/**/*.html",
    //         "./src/**/*.vue",
    //         "./src/**/*.jsx",
    //     ],
    //     options: {
    //         keyframes: true,
    //     },
    // },
    purge: false,
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            fontFamily: {
                sans: ["Larsseit", ...defaultTheme.fontFamily.sans],
            },
            colors: {
                teal: colors.teal,
                cyan: colors.cyan,
                rose: colors.rose,
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms"), require("@tailwindcss/line-clamp"), require("@tailwindcss/aspect-ratio")],
};
