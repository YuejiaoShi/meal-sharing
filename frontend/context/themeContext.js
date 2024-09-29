"use client";
import { createContext, useContext, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material";

const ThemeContext = createContext();

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    custom: {
      darkColor: "#0c4022", // Define a custom dark color
      lightColor: "#9bebc9", // Define a custom light color
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    custom: {
      darkColor: "#0c4022", // Define a custom dark color
      lightColor: "#9bebc9", // Define a custom light color
    },
  },
});
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error(
      "useThemeContext must be used within a ThemeProviderClient"
    );
  }
  return context;
};

export default function ThemeProviderClient({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleThemeChange = () => {
    setIsDarkMode(!isDarkMode);
  };

  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{ isDarkMode, darkTheme, lightTheme, handleThemeChange }}
    >
      <ThemeProvider theme={currentTheme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}
