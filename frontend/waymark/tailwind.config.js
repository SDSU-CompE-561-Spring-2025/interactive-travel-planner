/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx}", // Adjust if your files are in a different path
    ],
    theme: {
      extend: {
        colors: {
          background: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
          border: "hsl(var(--border))",
          muted: "hsl(var(--muted))",
          accent: "hsl(var(--accent))",
          destructive: "hsl(var(--destructive))",
          ring: "hsl(var(--ring))",
        },
      },
    },
    plugins: [],
  };
  