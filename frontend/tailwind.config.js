/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          dark: '#0f172a',
          navy: '#1e293b',
          blue: '#1d4ed8',
          accent: '#3b82f6',
          border: '#334155',
          card: '#1e293b',
        },
        risk: {
          low: '#10b981',
          medium: '#f59e0b',
          high: '#f97316',
          critical: '#ef4444',
        }
      }
    },
  },
  plugins: [],
}
