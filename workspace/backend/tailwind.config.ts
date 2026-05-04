import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0066FF',
        secondary: '#FF6B35',
        dark: '#1A1A1A',
        light: '#F5F5F5',
      },
      spacing: {
        '128': '32rem',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#333',
            a: {
              color: '#0066FF',
              '&:hover': {
                color: '#0052CC',
              },
            },
          },
        },
      },
    },
  },
  plugins: [],
}

export default config
