/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0ea5e9', // Sky-500
          dark: '#0284c7',   // Sky-600
          light: '#38bdf8',  // Sky-400
        },
        accent: {
          DEFAULT: '#06b6d4', // Cyan-500
          dark: '#0891b2',    // Cyan-600
          light: '#22d3ee',   // Cyan-400
        },
        dark: {
          DEFAULT: '#f3f4f6', // Gray-100
          lighter: '#f9fafb', // Gray-50
          darker: '#e5e7eb',  // Gray-200
        },
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(14,165,233,0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(14,165,233,0.7), 0 0 50px rgba(14,165,233,0.3)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
