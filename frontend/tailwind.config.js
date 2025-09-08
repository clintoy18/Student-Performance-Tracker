/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      }, fontSize: {
        'xs': ['11px', '16px'],     // Small labels
        'sm': ['13px', '18px'],     // Body text
        'base': ['14px', '20px'],   // Default
        'lg': ['16px', '22px'],     // Headers
        'xl': ['18px', '26px'],     // Page titles
        '2xl': ['20px', '28px'],    // Main headings
      },
      
      // Compact spacing
      spacing: {
        '18': '72px',     // Medium sections
        '22': '88px',     // Large sections
      },
      
      // Simple container sizes
      maxWidth: {
        'container': '1200px',
        'form': '400px',
        'card': '320px',
      },
      
      // Minimal border radius
      borderRadius: {
        'sm': '4px',
        'DEFAULT': '6px',
        'lg': '8px',
      }

    },
  },
  plugins: [],
}