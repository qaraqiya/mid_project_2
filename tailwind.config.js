/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./Users/aknurturakhan/Desktop/front/movies_app/movies_app.js.js",
    ],
    safelist: [
        "grid",
        "grid-cols-2",
        "sm:grid-cols-3",
        "lg:grid-cols-4",
        "xl:grid-cols-5",
        "gap-6",
        "p-6",
        "movie",
        "bg-white",
        "rounded-lg",
        "shadow-lg",
        "overflow-hidden",
        "text-lg",
        "font-semibold",
        "text-gray-600",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};
