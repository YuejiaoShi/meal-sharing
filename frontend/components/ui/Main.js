"use client";
import { useTheme } from "@mui/material";

const Main = ({ children }) => {
  const theme = useTheme();

  const contentClasses =
    theme.palette.mode === "light"
      ? "bg-white text-black"
      : "bg-[#0c4022] text-white";

  return <main className={`flex-grow ${contentClasses}`}>{children}</main>;
};

export default Main;
