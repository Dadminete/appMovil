
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
    
    // Update body background based on theme
    if (theme === 'light') {
      document.body.style.setProperty('--background', '#f8f9fa');
      document.body.style.setProperty('--foreground', '#1a1a1a');
      document.body.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.8)');
      document.body.style.setProperty('--card-border', 'rgba(0, 0, 0, 0.1)');
    } else {
      document.body.style.setProperty('--background', '#050507');
      document.body.style.setProperty('--foreground', '#ffffff');
      document.body.style.setProperty('--card-bg', 'rgba(15, 15, 20, 0.8)');
      document.body.style.setProperty('--card-border', 'rgba(212, 175, 55, 0.2)');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
