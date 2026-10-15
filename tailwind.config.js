// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "media",
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [require("daisyui")],
    daisyui: {
        // The app is designed for DaisyUI's dark theme only. Listing just one theme makes it the
        // default for everyone (before, light-mode systems got "light") and drops 31 unused themes' CSS.
        themes: ["dark"],
        darkTheme: "dark",
    },
};
