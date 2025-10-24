import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    
    // If nothing is stored, default to 'dark'
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // ✅ OTIMIZAÇÃO: useCallback para funções (padrão React.dev)
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  // ✅ OTIMIZAÇÃO: Memoizar value do context (padrão React.dev)
  const contextValue = useMemo(() => ({
    theme,
    toggleTheme,
    setTheme
  }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}