/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"]
      },
      colors: {
        ink: "#06070a",
        panel: "#0e1118",
        panel2: "#151a23",
        line: "#242a36",
        mint: "#63e6be",
        blue: "#7aa7ff",
        violet: "#a78bfa",
        gold: "#f5c76b"
      },
      boxShadow: {
        glow: "0 0 70px rgba(99, 230, 190, 0.16)"
      }
    }
  },
  plugins: []
};
