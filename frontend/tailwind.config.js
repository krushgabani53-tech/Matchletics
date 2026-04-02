/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'system-ui', 'sans-serif'],
            },
            colors: {
                brand: {
                    50: '#eefff4',
                    100: '#d7ffe7',
                    200: '#b2ffd1',
                    300: '#76ffad',
                    400: '#33f581',
                    500: '#09dc5e',
                    600: '#01b74a',
                    700: '#058f3d',
                    800: '#0a7034',
                    900: '#0a5c2d',
                    950: '#003416',
                },
                ocean: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                    950: '#172554',
                },
                dark: {
                    50: '#f6f6f9',
                    100: '#ececf2',
                    200: '#d5d5e2',
                    300: '#b1b1c7',
                    400: '#8686a8',
                    500: '#67678d',
                    600: '#525275',
                    700: '#44445f',
                    800: '#3b3b50',
                    900: '#1e1e2e',
                    950: '#0f0f1a',
                },
            },
            animation: {
                'fade-in': 'fadeIn 0.6s ease-out forwards',
                'slide-up': 'slideUp 0.6s ease-out forwards',
                'slide-down': 'slideDown 0.3s ease-out forwards',
                'scale-in': 'scaleIn 0.3s ease-out forwards',
                'float': 'float 6s ease-in-out infinite',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
                'gradient-x': 'gradientX 15s ease infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideDown: {
                    '0%': { opacity: '0', transform: 'translateY(-10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                pulseGlow: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(9, 220, 94, 0.1)' },
                    '50%': { boxShadow: '0 0 40px rgba(9, 220, 94, 0.3)' },
                },
                gradientX: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            },
        },
    },
    plugins: [],
}
