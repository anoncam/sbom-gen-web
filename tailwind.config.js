/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: '#000000',
        darkGrey: '#353534',
        hackerGreen: '#73ef4b',
        background: '#000000',
        foreground: '#f3f4f6',
        danger: '#ef4444',
        warning: '#f59e0b',
      },
      fontFamily: {
        sans: ['Jost', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      backgroundImage: {
        'hero-pattern': "url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80')",
      },
    },
  },
  plugins: [],
}