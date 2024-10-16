"use client";

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
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToogle";
import { useThemeContext } from "@/context/themeContext";

function NavBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:768px)");
  const pathname = usePathname();
  const theme = useTheme();
  const currentTheme = useThemeContext();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  useEffect(() => {
    const handleHashChange = () => setDrawerOpen(false);
    const handlePathChange = () => setDrawerOpen(false);

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handlePathChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handlePathChange);
    };
  }, [pathname]);

  const getButtonClasses = (path) => {
    return pathname === path ? "font-bold text-base" : "";
  };

  const menuItems = [
    { href: "/", label: "Home" },
    { href: "/about-us", label: "About Us" },
    { href: "/meals", label: "Meals" },
    { href: "/share-a-meal", label: "Share Meal" },
    { href: "#social-media", label: "Contact" },
  ];

  const drawer = (
    <List>
      {menuItems.map((item) => (
        <ListItem key={item.href}>
          <ListItemButton
            component={Link}
            href={item.href}
            className={getButtonClasses(item.href)}
            onClick={() => setDrawerOpen(false)}
          >
            {item.label}
          </ListItemButton>
        </ListItem>
      ))}
      <ListItem>
        <ThemeToggle />
      </ListItem>
    </List>
  );

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
            ? "bg-darkMode-bg text-darkMode-text"
            : "bg-lightMode-bg text-lightMode-text"
        } flex justify-between items-center shadow-lg`}
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

          {!isTablet && (
            <Typography variant="h6" className="text- ml-0">
              MealSharing
            </Typography>
          )}
        </Link>
        {isMobile ? (
          <div className="flex justify-center items-center w-full">
            <div className="ml-auto">
              <IconButton color="inherit" onClick={toggleDrawer}>
                <MenuIcon />
              </IconButton>
            </div>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            >
              {drawer}
            </Drawer>
          </div>
        ) : (
          <Stack
            direction="row"
            spacing={1}
            className="flex justify-center items-center ml-4"
          >
            <ThemeToggle />
            {menuItems.map((item) => (
              <Button
                key={item.href}
                color="inherit"
                component={Link}
                href={item.href}
                className={getButtonClasses(item.href)}
                onClick={() => setDrawerOpen(false)}
                sx={{
                  whiteSpace: "nowrap",
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
