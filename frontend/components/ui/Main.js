"use client";
import { useTheme } from "@mui/material";

const Main = ({ children }) => {
  const theme = useTheme();

  const contentClasses =
    theme.palette.mode === "light"
      ? "bg-[#F4FFFA] text-black"
      : "bg-[#022511] text-white";

  return <main className={`flex-grow ${contentClasses}`}>{children}</main>;
};

export default Main;
