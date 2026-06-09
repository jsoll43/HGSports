import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0b2545',
        pool: '#35c2d1',
        aqua: '#dff8fb',
        deck: '#f6fbff',
      },
      boxShadow: {
        soft: '0 16px 40px rgba(11, 37, 69, 0.12)',
      },
    },
  },
  plugins: [],
}

export default config
