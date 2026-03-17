import type { Config } from "tailwindcss";

const rem = (px: number) => `${px / 16}rem`;

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#000000",
        panel: "#050505",
        surface: {
          DEFAULT: "#0b0b0b",
          light: "#0f0f0f",
          lighter: "#141414",
          muted: "#1a1a1a",
        },
        border: {
          DEFAULT: "rgba(255, 255, 255, 0.12)",
          strong: "rgba(255, 255, 255, 0.22)",
        },
        text: {
          DEFAULT: "#f5f5f5",
          muted: "rgba(245, 245, 245, 0.62)",
        },
        accent: {
          DEFAULT: "#ffffff",
          muted: "rgba(255, 255, 255, 0.80)",
          subtle: "rgba(255, 255, 255, 0.08)",
        },
        verdict: {
          true: "#3fb950",
          "true-muted": "rgba(63, 185, 80, 0.2)",
          false: "#f85149",
          "false-muted": "rgba(248, 81, 73, 0.2)",
          unverified: "#d29922",
          "unverified-muted": "rgba(210, 153, 34, 0.2)",
        },
      },
      spacing: {
        18: rem(72),
        22: rem(88),
        30: rem(120),
      },
      maxWidth: {
        container: "72rem",
        "container-wide": "80rem",
        prose: "65ch",
      },
      borderRadius: {
        card: rem(8),
        "card-lg": rem(12),
        ds: rem(8),
        "ds-lg": rem(12),
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.2)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.25)",
        ds: "0 1px 3px rgba(0,0,0,0.2)",
        "ds-lg": "0 4px 16px rgba(0,0,0,0.25)",
      },
      padding: { page: "1rem" },
      margin: { section: "2rem" },
      fontFamily: {
        sans: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "monospace"],
      },
      fontSize: {
        display: [rem(40), { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        h1: [rem(30), { lineHeight: "1.25" }],
        h2: [rem(24), { lineHeight: "1.3" }],
        h3: [rem(18), { lineHeight: "1.4" }],
        body: [rem(16), { lineHeight: "1.6" }],
        small: [rem(14), { lineHeight: "1.5" }],
        caption: [rem(12), { lineHeight: "1.5" }],
      },
      transitionDuration: {
        fast: "150ms",
        normal: "200ms",
      },
      aspectRatio: {
        "4/3": "4 / 3",
        "16/9": "16 / 9",
        "21/9": "21 / 9",
      },
    },
  },
  plugins: [],
};

export default config;
