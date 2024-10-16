"use client";

import Button from "@mui/material/Button";
import { useThemeContext } from "@/context/themeContext";

const modeIcons = {
  lightIcon: "/modeIcons/light-mode.png",
  darkIcon: "/modeIcons/dark-mode.png",
};

export default function ThemeToggle() {
  const theme = useThemeContext();

  return (
    <Button onClick={theme.handleThemeChange} sx={{ p: 0, m: 0 }}>
      <img
        src={theme.isDarkMode ? modeIcons.lightIcon : modeIcons.darkIcon}
        alt="mode toggle"
        className="w-6 h-6"
      />
    </Button>
  );
}
