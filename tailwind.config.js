/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    spacing: {
      // compact spacing scale replaces the default
      px: '1px',
      0: '0px',
      0.5: '0.1rem',
      1: '0.2rem',
      1.5: '0.3rem',
      2: '0.4rem',
      2.5: '0.5rem',
      3: '0.6rem',
      4: '0.8rem',
      5: '1rem',
      6: '1.2rem',
      8: '1.6rem',
      10: '2rem',
      12: '2.4rem',
      16: '3.2rem',
      20: '4rem',
      24: '4.8rem',
      32: '6.4rem',
      40: '8rem',
      48: '9.6rem',
      56: '11.2rem',
      64: '12.8rem',
    },
    fontSize: {
      // slightly smaller font sizes
      xs: ['0.6rem', { lineHeight: '1rem' }],
      sm: ['0.75rem', { lineHeight: '1rem' }],
      base: ['0.875rem', { lineHeight: '1.25rem' }],
      lg: ['1rem', { lineHeight: '1.5rem' }],
      xl: ['1.125rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.25rem', { lineHeight: '1.75rem' }],
    }
  },
  plugins: []
};