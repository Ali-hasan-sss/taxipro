"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard,
  DriveEta,
  Receipt,
  Map,
  Settings,
  Logout,
  LocalTaxi,
  AccountCircle,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";

const drawerWidth = 280;

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mounted, setMounted] = useState(false);

  // تجنب hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    router.push("/admin/login");
  };

  const menuItems = [
    { text: "لوحة التحكم", icon: <Dashboard />, path: "/admin/dashboard" },
    { text: "السائقين", icon: <DriveEta />, path: "/admin/drivers" },
    { text: "توزع السائقين", icon: <Map />, path: "/admin/map" },
    { text: "الطلبات", icon: <Receipt />, path: "/admin/orders" },
    { text: "الإعدادات", icon: <Settings />, path: "/admin/settings" },
  ];

  const handleBottomNavChange = (
    event: React.SyntheticEvent,
    newValue: string
  ) => {
    router.push(newValue);
  };

  const drawer = (
    <Box>
      <Box
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          gap: 2,
          bgcolor: "primary.main",
          color: "secondary.main",
        }}
      >
        <LocalTaxi sx={{ fontSize: 40 }} />
        <Box>
          <Typography variant="h6" fontWeight="bold">
            تاكسي برو
          </Typography>
          <Typography variant="caption">لوحة التحكم</Typography>
        </Box>
      </Box>
      <Divider />
      <List sx={{ px: 2, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={pathname === item.path}
              onClick={() => router.push(item.path)}
              sx={{
                borderRadius: 2,
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "secondary.main",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                  "& .MuiListItemIcon-root": {
                    color: "secondary.main",
                  },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  // عرض loading بسيط حتى يتم mount
  if (!mounted) {
    return (
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <Box sx={{ flexGrow: 1 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", direction: "rtl" }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: "100%",
          mr: 0,
          ml: 0,
          bgcolor: "white",
          color: "text.primary",
          boxShadow: 1,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ direction: "rtl" }}>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find((item) => item.path === pathname)?.text ||
              "لوحة التحكم"}
          </Typography>
          <IconButton onClick={handleMenuOpen}>
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem disabled>
              <Typography variant="body2">
                {user?.username || "المدير"}
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <ListItemText>تسجيل الخروج</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar for Desktop */}
      {mounted && !isMobile && (
        <Drawer
          anchor="right"
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width:
            mounted && !isMobile ? `calc(100% - ${drawerWidth}px)` : "100%",
          minHeight: "100vh",
          bgcolor: "background.default",
          direction: "rtl",
          pb: mounted && isMobile ? 9 : 3,
        }}
      >
        <Toolbar />
        {children}
      </Box>

      {/* Bottom Navigation for Mobile */}
      {mounted && isMobile && (
        <Paper
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          elevation={3}
        >
          <BottomNavigation
            value={pathname}
            onChange={handleBottomNavChange}
            showLabels
            sx={{
              direction: "rtl",
              "& .MuiBottomNavigationAction-root": {
                minWidth: "auto",
              },
              "& .Mui-selected": {
                color: "primary.main",
              },
            }}
          >
            {menuItems.map((item) => (
              <BottomNavigationAction
                key={item.path}
                label={item.text}
                value={item.path}
                icon={item.icon}
                sx={{
                  fontSize: { xs: "0.65rem", sm: "0.75rem" },
                  "& .MuiBottomNavigationAction-label": {
                    fontSize: { xs: "0.65rem", sm: "0.75rem" },
                  },
                }}
              />
            ))}
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
}
