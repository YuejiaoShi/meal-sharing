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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
      <ListItem></ListItem>
    </List>
  );

  return (
    <AppBar position="static" sx={{ backgroundColor: "#145a32" }}>
      <Toolbar className="flex justify-between items-center">
        <Link href="/" passHref className="flex items-center space-x-2">
          <IconButton color="inherit" aria-label="logo">
            <img
              src="/favicon-white.png"
              alt="logo-white"
              className="w-8 h-8"
            />
          </IconButton>
          <Typography variant="h6" className="text-white ml-0">
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
