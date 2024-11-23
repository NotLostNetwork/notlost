/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Roboto", "Apple Color Emoji", "Helvetica Neue", sans-serif;',
      },
      colors: {
        DEFAULT: 'var(--tg-theme-text-color)',
        primary: 'var(--tg-theme-text-color)',
        hint: 'var(--tg-theme-hint-color)',
        link: 'var(--tg-theme-link-color)',
        accent: 'var(--tg-theme-accent-text-color)',
        subtitle: 'var(--tg-theme-subtitle-text-color)',
      },
      backgroundColor: {
        primary: 'var(--tg-theme-bg-color)',
        secondary: 'var(--tg-theme-secondary-bg-color)',
        button: 'var(--tg-theme-button-color)',
        buttonBezeled: 'var(--tgui--secondary_fill)',
        divider: 'var(--tgui--divider)',
        skeleton: 'var(--tgui--skeleton)',
      },
      borderColor: {
        primary: 'var(--tgui--divider)',
      },
    },
  },
  plugins: [],
}
