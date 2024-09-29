"use client"; // This line is important for Next.js app routing

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Stack,
  Button,
  useMediaQuery,
  ListItem,
  List,
  Drawer,
  ListItemButton,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToogle";
import { useThemeContext } from "@/context/themeContext";

function NavBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");
  const pathname = usePathname();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const getButtonClasses = (path) => {
    return pathname === path ? "font-bold text-base" : "";
  };

  const currentTheme = useThemeContext();

  const drawer = (
    <List>
      <ListItem>
        <ListItemButton
          component={Link}
          href="/"
          className={getButtonClasses("/")}
        >
          Home
        </ListItemButton>
      </ListItem>
      <ListItem>
        <ListItemButton
          component={Link}
          href="/about"
          className={getButtonClasses("/about")}
        >
          About Us
        </ListItemButton>
      </ListItem>
      <ListItem>
        <ListItemButton
          component={Link}
          href="/meals"
          className={getButtonClasses("/meals")}
        >
          Menu
        </ListItemButton>
      </ListItem>
      <ListItem>
        <ListItemButton
          component={Link}
          href="/contact"
          className={getButtonClasses("/contact")}
        >
          Contact
        </ListItemButton>
      </ListItem>
      <ListItem>
        <ThemeToggle />
      </ListItem>
    </List>
  );

  const theme = useTheme();

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: currentTheme.isDarkMode
          ? theme.palette.custom.darkColor
          : theme.palette.custom.lightColor,
        color: currentTheme.isDarkMode
          ? "white"
          : theme.palette.custom.darkColor,
      }}
    >
      <Toolbar
        className={`${
          currentTheme.isDarkMode
            ? "bg-darkMode-background text-darkMode-text"
            : "bg-lightMode-background text-lightMode-text"
        } flex justify-between items-center`}
      >
        <Link href="/" passHref className={`flex items-center space-x-2 `}>
          <IconButton color="inherit" aria-label="logo">
            <img
              src={`${
                currentTheme.isDarkMode ? "/favicon-white.png" : "/favicon.ico"
              }`}
              alt="Homepage logo"
              className="w-8 h-8"
            />
          </IconButton>
          <Typography variant="h6" className="text- ml-0">
            Meal Sharing
          </Typography>
        </Link>
        {isMobile ? (
          <>
            <IconButton color="inherit" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
              {drawer}
            </Drawer>
          </>
        ) : (
          <Stack direction="row" spacing={2}>
            <ThemeToggle />
            <Button
              color="inherit"
              component={Link}
              href="/"
              className={getButtonClasses("/")}
            >
              Home
            </Button>
            <Button
              color="inherit"
              component={Link}
              href="/about"
              className={getButtonClasses("/about")}
            >
              About Us
            </Button>
            <Button
              color="inherit"
              component={Link}
              href="/meals"
              className={getButtonClasses("/meals")}
            >
              Menu
            </Button>
            <Button
              color="inherit"
              component={Link}
              href="/contact"
              className={getButtonClasses("/contact")}
            >
              Contact
            </Button>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
