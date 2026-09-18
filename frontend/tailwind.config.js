/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-base': '#F9F8F6',
        'surface-card': '#FFFFFF',
        'surface-tint': '#F2EFE9',
        'charcoal': '#1A1A1A',
        'charcoal-soft': '#242526',
        'charcoal-muted': '#5A5D61',
        'raw-umber': '#8B5A2B',
        'raw-umber-light': '#B48A63',
        'raw-umber-subtle': '#F7F2EB',
        'cement': '#E2DFD8',
        'cement-dark': '#CBC6BD',
        'verified-green': '#2E7D32',
        'alert-stale': '#C62828',
      },
      fontFamily: {
        headline: ['"Space Grotesk"', 'Outfit', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      borderRadius: {
        'none': '0px',
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
        'full': '9999px',
      },
      borderWidth: {
        '1': '1px',
      },
      boxShadow: {
        'none': 'none',
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'card': '0 2px 8px -1px rgba(0, 0, 0, 0.06), 0 1px 3px -1px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 8px 24px -4px rgba(0, 0, 0, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'modal': '0 20px 50px -12px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
}
