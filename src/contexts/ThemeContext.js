import React, { createContext, useContext, useState } from 'react';
import { THEME } from '../constants/Theme';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const theme = isDarkMode ? THEME.dark : THEME.light;
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  const value = {
    theme,
    isDarkMode,
    toggleTheme,
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;