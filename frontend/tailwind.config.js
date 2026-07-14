export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        colors: {
          "bg-dark": "var(--color-bg-dark)",
          "bg-light": "var(--color-bg-light)",
          "text-primary": "var(--color-text)",
          "text-muted": "var(--color-text-muted)",
          "accent": "var(--color-accent)",
          "accent-hover": "var(--color-accent-hover)",
          "accent-secondary": "var(--color-accent-secondary)",
        },
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      spacing: {
        unit: "4px",
        "container-max": "1440px",
        gutter: "16px",
        margin: "32px",
      },
      fontFamily: {
        "body-md": ["Inter"],
        "headline-lg": ["Space Grotesk"],
        "label-sm": ["Space Grotesk"],
        "body-lg": ["Inter"],
        "headline-md": ["Space Grotesk"],
        "headline-xl": ["Space Grotesk"],
      },
      fontSize: {
        "body-md": ["16px", { lineHeight: "1.5", letterSpacing: "0em", fontWeight: "400" }],
        "headline-lg": ["40px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        "label-sm": ["12px", { lineHeight: "1", letterSpacing: "0.1em", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "1.6", letterSpacing: "0em", fontWeight: "400" }],
        "headline-md": ["24px", { lineHeight: "1.2", letterSpacing: "0em", fontWeight: "600" }],
        "headline-xl": ["64px", { lineHeight: "1.1", letterSpacing: "-0.05em", fontWeight: "700" }],
      },
    },
  },
  plugins: [require('tailwind-scrollbar')({ noCompatible: true })],
};