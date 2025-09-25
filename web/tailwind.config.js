/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Game-themed colors
        'quest-purple': '#6366f1',
        'quest-purple-dark': '#4f46e5',
        'quest-gold': '#f59e0b',
        'quest-gold-dark': '#d97706',
        'quest-green': '#10b981',
        'quest-red': '#ef4444',
        'quest-blue': '#3b82f6',
        'quest-dark': '#1e293b',
        'quest-darker': '#0f172a',
        'quest-light': '#f8fafc',
      },
      fontFamily: {
        'game': ['Orbitron', 'monospace'],
        'fantasy': ['Cinzel', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #6366f1, 0 0 10px #6366f1, 0 0 15px #6366f1' },
          '100%': { boxShadow: '0 0 10px #6366f1, 0 0 20px #6366f1, 0 0 30px #6366f1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      backgroundImage: {
        'quest-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'quest-gradient-gold': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        'quest-gradient-purple': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        'quest-gradient-dark': 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        'quest-gradient-green': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      },
      boxShadow: {
        'quest': '0 10px 25px -5px rgba(99, 102, 241, 0.3), 0 10px 10px -5px rgba(99, 102, 241, 0.1)',
        'quest-glow': '0 0 20px rgba(99, 102, 241, 0.5)',
        'quest-gold': '0 10px 25px -5px rgba(245, 158, 11, 0.3), 0 10px 10px -5px rgba(245, 158, 11, 0.1)',
      },
    },
  },
  plugins: [],
}
