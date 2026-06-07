/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        royal: {
          50: "#EEF2FF", 100: "#DCE3FF", 200: "#B9C7FF", 300: "#8FA3FF",
          400: "#6478F5", 500: "#4154D6", 600: "#3140B0", 700: "#26328C",
          800: "#1D2769", 900: "#141B4A",
        },
        azure: {
          50: "#E8F2FF", 100: "#CFE4FF", 200: "#9FC8FF", 300: "#6BA8FF",
          400: "#3D8AF0", 500: "#1E6FE0", 600: "#135BBF", 700: "#0E4799",
          800: "#0A3673", 900: "#07254D",
        },
        turq: {
          50: "#E6FBF7", 100: "#C3F5EC", 200: "#8EEBDB", 300: "#54DCC6",
          400: "#25C6AE", 500: "#0FB39A", 600: "#0B907D", 700: "#0A7062",
          800: "#08534A", 900: "#063A34",
        },
        cyan: {
          50: "#E4FBFF", 100: "#BAF3FF", 200: "#82E9FF", 300: "#43D8F7",
          400: "#1AC2E6", 500: "#06A6CC", 600: "#0585A6", 700: "#066780",
          800: "#064E60", 900: "#053744",
        },
        teal: {
          50: "#E6F4F4", 100: "#C2E6E6", 200: "#8FD0D0", 300: "#54B5B5",
          400: "#1F9494", 500: "#005F5F", 600: "#004F4F", 700: "#003F3F",
          800: "#002F2F", 900: "#001F1F",
        },
        gun: {
          50: "#F1F3F5", 100: "#DDE1E6", 200: "#BBC2CB", 300: "#939DAA",
          400: "#6B7685", 500: "#4A5563", 600: "#39424E", 700: "#2B323B",
          800: "#1E232A", 900: "#13171C",
        },
        lg: {
          50: "#FAFBFC", 100: "#F2F4F6", 200: "#E7EAEE", 300: "#D6DBE1",
          400: "#C0C7CF", 500: "#A7B0BA",
        },
        gold: {
          50: "#FBF6E9", 100: "#F6EBC8", 200: "#EDD692", 300: "#E3C158",
          400: "#D6AC2E", 500: "#C29318", 600: "#9E7611", 700: "#7C5B0E",
          800: "#5C430C", 900: "#3F2E09",
        },
        beige: { 200: "#F0E7D3", 300: "#E8DDC7" },
        tan: { 400: "#D2B488", 500: "#C9A86A" },
        olive: { 500: "#7C7A3F", 600: "#5F5E30" },
        error: { 400: "#E66670", 500: "#D64550" },

        // Semantic tokens -> CSS variables
        bg: "var(--bg)",
        "bg-subtle": "var(--bg-subtle)",
        surface: "var(--surface)",
        "surface-raised": "var(--surface-raised)",
        border: "var(--border)",
        "border-strong": "var(--border-strong)",
        text: "var(--text)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        primary: "var(--primary)",
        "primary-hover": "var(--primary-hover)",
        "primary-fg": "var(--primary-fg)",
        accent: "var(--accent)",
        "accent-fg": "var(--accent-fg)",
        "brand-teal": "var(--brand-teal)",
        "brand-teal-fg": "var(--brand-teal-fg)",
        link: "var(--link)",
        success: "var(--success)",
        info: "var(--info)",
        warning: "var(--warning)",
        danger: "var(--error)",
        "focus-ring": "var(--focus-ring)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      fontSize: {
        display: ["2.25rem", { lineHeight: "2.6rem", fontWeight: "700", letterSpacing: "-0.01em" }],
        h1: ["1.75rem", { lineHeight: "2.1rem", fontWeight: "700", letterSpacing: "-0.01em" }],
        h2: ["1.375rem", { lineHeight: "1.7rem", fontWeight: "600", letterSpacing: "-0.01em" }],
        h3: ["1.125rem", { lineHeight: "1.5rem", fontWeight: "600" }],
        "body-lg": ["1.0625rem", { lineHeight: "1.7rem" }],
        body: ["0.9375rem", { lineHeight: "1.6rem" }],
        small: ["0.8125rem", { lineHeight: "1.45rem" }],
        caption: ["0.75rem", { lineHeight: "1.4rem", fontWeight: "500" }],
      },
      borderRadius: {
        sm: "6px", md: "10px", lg: "16px", xl: "24px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(19,23,28,0.06)",
        md: "0 4px 12px rgba(19,23,28,0.08)",
        lg: "0 12px 32px rgba(19,23,28,0.12)",
        glow: "0 0 0 3px rgba(31,148,148,0.35)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #4154D6 0%, #1E6FE0 50%, #43D8F7 100%)",
        "brand-gradient-teal": "linear-gradient(135deg, #005F5F 0%, #0FB39A 50%, #43D8F7 100%)",
      },
      transitionTimingFunction: {
        enter: "cubic-bezier(0.2, 0, 0, 1)",
        exit: "cubic-bezier(0.4, 0, 1, 1)",
      },
      keyframes: {
        "fade-in": { "0%": { opacity: "0", transform: "translateY(2px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "live-pulse": { "0%,100%": { opacity: "1" }, "50%": { opacity: "0.35" } },
      },
      animation: {
        "fade-in": "fade-in 200ms cubic-bezier(0.2,0,0,1)",
        "live-pulse": "live-pulse 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
