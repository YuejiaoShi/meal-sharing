"use client";

import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { useThemeContext } from "@/context/themeContext";

export default function ThemeToggle() {
  const theme = useThemeContext();

  return (
    <Button onClick={theme.handleThemeChange}>
      {theme.isDarkMode ? "☀️" : "🌙"}
    </Button>
  );
}
