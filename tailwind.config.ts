import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#F8F6F1",
        paper: "#FFFEFB",
        ink: "#173B38",
        muted: "#6E7E79",
        line: "#E4E5DD",
        pine: "#1E5B53",
        "pine-dark": "#123F3A",
        coral: "#D87B61",
        "coral-soft": "#F3DFD5",
        sand: "#EDE5D7",
        moss: "#DCE6DD",
        "blue-soft": "#DDE9EC",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Arial", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 16px 45px rgba(23, 59, 56, 0.08)",
        card: "0 4px 18px rgba(23, 59, 56, 0.06)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
