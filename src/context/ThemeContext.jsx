import React, { createContext, useContext, useState } from 'react';
import { DEFAULT_THEME_COLOR, DEFAULT_THEME_MODE } from '@config/theme.config';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeColor, setThemeColor] = useState(DEFAULT_THEME_COLOR);
  const [themeMode, setThemeMode] = useState(DEFAULT_THEME_MODE);

  // Sidebar/Header Theme
  const changeTheme = (color) => {
    setThemeColor(color);
  };

  // Light/Dark Mode Toggle
  const toggleThemeMode = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{
      themeColor,
      changeTheme,
      themeMode,
      toggleThemeMode
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
