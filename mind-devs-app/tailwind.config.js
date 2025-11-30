/** @type {import('tailwindcss').Config} */
export default {
    // ESTA LÍNEA ES LA QUE HACE LA MAGIA:
    darkMode: 'class',

    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                mind: {
                    primary: '#3b82f6',
                    cyan: '#06b6d4',
                    green: '#86efac',
                    red: '#ef4444',
                    disabledGray: '#9ca3af',
                    disabledMauve: '#b9838f',
                    dark: '#1f2937',
                }
            },
            boxShadow: {
                'hard': '8px 8px 0px 0px rgba(0, 0, 0, 0.8)',
            }
        },
    },
    plugins: [],
}
