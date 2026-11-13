import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#061013',
          navy: '#0A191E',
          navyLight: '#132B32',
          card: '#0D2329',
          cardHover: '#16353E',
          border: '#1A3F49',
          gold: '#E5B842',
          goldHover: '#F7CE5A',
          goldLight: '#FDF0CD',
          mint: '#00E599',
          mintHover: '#00FFAB',
          mintDark: '#004730',
          positive: '#00E599',
          danger: '#EF4444',
          muted: '#8AA0A6',
        },
      },
    },
  },
  plugins: [],
};

export default config;

