/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Roboto", "Apple Color Emoji", "Helvetica Neue", sans-serif;',
      },
      colors: {
        DEFAULT: "var(--tg-theme-text-color)",
        primary: "var(--tg-theme-text-color)",
        hint: "var(--tg-theme-hint-color)",
        link: "var(--tgui--link_color)",
        accent: "var(--tgui--accent_text_color)",
        subtitle: "var(--tg-theme-subtitle-text-color)",
      },
      backgroundColor: {
        primary: "#1C1C1D",
        secondary: "#060606",
        button: "var(--tg-theme-button-color)",
        buttonBezeled: "var(--tgui--secondary_fill)",
        divider: "var(--tgui--divider)",
        skeleton: "var(--tgui--skeleton)",
        wallpaper: "var(--tg-theme-link-color)",
      },
      borderColor: {
        primary: "var(--tgui--divider)",
      },
      /* colors: {
        DEFAULT: "#f5f5f5",
        primary: "#f5f5f5",
        hint: "#708499",
        link: "#6ab3f3",
        linkPurple: "#cd5afa",
        accent: "#6ab2f2",
        subtitle: "#708499",
      },
      backgroundColor: {
        primary: "#17212b",
        secondary: "#232e3c",
        button: "#5288c1",
        buttonBezeled: "rgba(41, 144, 255, .15)",
        divider: "hsla(0, 0%, 100%, .05)",
        skeleton: "hsla(0, 0%, 100%, .03)",
        purple: "#b947e6",
      },
      borderColor: {
        primary: "hsla(0, 0%, 100%, .05)",
        accent: "#6ab3f3",
      }, */
    },
  },
  plugins: [],
}
