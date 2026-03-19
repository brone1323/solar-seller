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
        solar: {
          sky: '#0ea5e9',
          ocean: '#0284c7',
          deep: '#0c4a6e',
          leaf: '#22c55e',
          forest: '#16a34a',
          sage: '#15803d',
          dark: '#0f172a',
        },
        accent: {
          sun: '#fbbf24',
          sunset: '#f97316',
        },
      },
      fontFamily: {
        display: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      spacing: {
        18: '4.5rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out both',
        'fade-up': 'fadeUp 0.6s ease both',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.2s ease-out',
        'orb-float': 'orbFloat 8s ease-in-out infinite',
        'orb-float2': 'orbFloat2 11s ease-in-out infinite',
        'spin-slow': 'spinSlow 20s linear infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'shimmer': 'shimmer 1.8s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        orbFloat: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-30px) scale(1.04)' },
        },
        orbFloat2: {
          '0%, 100%': { transform: 'translateY(0) scale(1) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) scale(1.06) rotate(5deg)' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
