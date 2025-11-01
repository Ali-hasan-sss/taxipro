"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  LocalTaxi,
  Speed,
  LocationOn,
  Security,
  Phone,
  Email,
  Facebook,
  Twitter,
  Instagram,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import Link from "next/link";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { text: "خدماتنا", href: "#services" },
    { text: "المميزات", href: "#features" },
    { text: "تواصل معنا", href: "#contact" },
  ];

  const handleMenuItemClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <Box>
      {/* Header */}
      <Box
        component="header"
        sx={{
          bgcolor: "secondary.main",
          color: "white",
          py: 2,
          boxShadow: 2,
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <Container maxWidth="lg">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center" gap={1}>
              <LocalTaxi
                sx={{
                  fontSize: { xs: 32, sm: 40 },
                  color: "primary.main",
                }}
              />
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
              >
                تاكسي برو
              </Typography>
            </Box>

            {/* Desktop Menu */}
            <Box display={{ xs: "none", md: "flex" }} gap={2}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  variant="text"
                  sx={{ color: "white" }}
                  href={item.href}
                >
                  {item.text}
                </Button>
              ))}
            </Box>

            {/* Mobile Menu Button */}
            <IconButton
              sx={{
                display: { xs: "flex", md: "none" },
                color: "white",
              }}
              onClick={() => setMobileMenuOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Container>
      </Box>

      {/* Mobile Drawer Menu */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 280,
            bgcolor: "secondary.main",
            color: "white",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <LocalTaxi sx={{ fontSize: 32, color: "primary.main" }} />
              <Typography variant="h6" fontWeight="bold">
                تاكسي برو
              </Typography>
            </Box>
            <IconButton
              onClick={() => setMobileMenuOpen(false)}
              sx={{ color: "white" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)", mb: 2 }} />
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component="a"
                  href={item.href}
                  onClick={handleMenuItemClick}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    "&:hover": {
                      bgcolor: "primary.main",
                      color: "secondary.main",
                    },
                  }}
                >
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: 600,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
          color: "white",
          py: 12,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            fontWeight="bold"
            gutterBottom
            sx={{ fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" } }}
          >
            مرحباً بك في تاكسي برو - طرطوس
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              opacity: 0.9,
              fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
              px: { xs: 2, sm: 0 },
            }}
          >
            خدمة النقل الأولى في طرطوس - سريعة، آمنة، ومريحة على امتداد الساحل
            السوري
          </Typography>
          <Box
            display="flex"
            gap={2}
            justifyContent="center"
            flexDirection={{ xs: "column", sm: "row" }}
            px={{ xs: 2, sm: 0 }}
          >
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: "primary.main",
                color: "secondary.main",
                px: { xs: 3, sm: 4 },
                py: 1.5,
                fontSize: { xs: "1rem", sm: "1.1rem" },
                "&:hover": {
                  bgcolor: "primary.dark",
                },
              }}
            >
              اطلب تاكسي الآن
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: "white",
                color: "white",
                px: { xs: 3, sm: 4 },
                py: 1.5,
                fontSize: { xs: "1rem", sm: "1.1rem" },
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "rgba(255, 215, 0, 0.1)",
                },
              }}
            >
              انضم كسائق
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box id="features" sx={{ py: 8, bgcolor: "background.default" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            textAlign="center"
            fontWeight="bold"
            mb={2}
            sx={{ fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" } }}
          >
            لماذا تاكسي برو طرطوس؟
          </Typography>
          <Typography
            variant="subtitle1"
            textAlign="center"
            color="text.secondary"
            mb={6}
            sx={{
              maxWidth: 800,
              mx: "auto",
              fontSize: { xs: "0.875rem", sm: "1rem" },
              px: { xs: 2, sm: 0 },
            }}
          >
            نخدم جميع مناطق طرطوس: الكورنيش، ساحة الشهداء، المدينة القديمة،
            الميناء، مشتى الحلو، والأحياء المحيطة
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <Card sx={{ height: "100%", textAlign: "center", p: 2 }}>
                <CardContent>
                  <Speed sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    خدمة سريعة
                  </Typography>
                  <Typography color="text.secondary">
                    وصول سريع لجميع أحياء طرطوس في دقائق معدودة
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ height: "100%", textAlign: "center", p: 2 }}>
                <CardContent>
                  <Security
                    sx={{ fontSize: 60, color: "primary.main", mb: 2 }}
                  />
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    آمن وموثوق
                  </Typography>
                  <Typography color="text.secondary">
                    سائقون محترفون ومرخصون
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ height: "100%", textAlign: "center", p: 2 }}>
                <CardContent>
                  <LocationOn
                    sx={{ fontSize: 60, color: "primary.main", mb: 2 }}
                  />
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    تتبع مباشر
                  </Typography>
                  <Typography color="text.secondary">
                    تتبع موقع سيارتك في الوقت الفعلي
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ height: "100%", textAlign: "center", p: 2 }}>
                <CardContent>
                  <LocalTaxi
                    sx={{ fontSize: 60, color: "primary.main", mb: 2 }}
                  />
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    أسعار منافسة
                  </Typography>
                  <Typography color="text.secondary">
                    أفضل الأسعار بدون رسوم خفية
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Services Section */}
      <Box id="services" sx={{ py: 8, bgcolor: "white" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            textAlign="center"
            fontWeight="bold"
            mb={6}
            sx={{ fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" } }}
          >
            خدماتنا
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  تاكسي خاص
                </Typography>
                <Typography color="text.secondary" paragraph>
                  سيارات فاخرة ومريحة لرحلة خاصة وهادئة. مثالية للعائلات ورحلات
                  العمل في طرطوس والمناطق المحيطة.
                </Typography>
                <Button variant="contained" color="primary">
                  اطلب الآن
                </Button>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  تاكسي عام
                </Typography>
                <Typography color="text.secondary" paragraph>
                  خدمة نقل اقتصادية وسريعة تغطي جميع أحياء طرطوس من الكورنيش إلى
                  مشتى الحلو.
                </Typography>
                <Button variant="contained" color="primary">
                  اطلب الآن
                </Button>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box id="contact" sx={{ py: 8, bgcolor: "background.default" }}>
        <Container maxWidth="md">
          <Typography
            variant="h3"
            textAlign="center"
            fontWeight="bold"
            mb={6}
            sx={{ fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" } }}
          >
            تواصل معنا
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Phone sx={{ fontSize: 50, color: "primary.main", mb: 2 }} />
                <Typography variant="h6" fontWeight="bold">
                  الهاتف
                </Typography>
                <Typography color="text.secondary">+963 43 123 456</Typography>
                <Typography color="text.secondary" variant="body2">
                  0932 000 000
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Email sx={{ fontSize: 50, color: "primary.main", mb: 2 }} />
                <Typography variant="h6" fontWeight="bold">
                  البريد الإلكتروني
                </Typography>
                <Typography color="text.secondary">info@taxipro.sy</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <LocationOn
                  sx={{ fontSize: 50, color: "primary.main", mb: 2 }}
                />
                <Typography variant="h6" fontWeight="bold">
                  العنوان
                </Typography>
                <Typography color="text.secondary">
                  ساحة الشهداء - طرطوس، سوريا
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: "secondary.main",
          color: "white",
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <LocalTaxi sx={{ fontSize: 40, color: "primary.main" }} />
                <Typography variant="h5" fontWeight="bold">
                  تاكسي برو
                </Typography>
              </Box>
              <Typography color="rgba(255,255,255,0.7)">
                خدمة النقل الأولى في طرطوس - نخدم جميع أحياء المدينة على مدار
                الساعة
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                تابعنا على
              </Typography>
              <Box display="flex" gap={2}>
                <Facebook
                  sx={{
                    fontSize: 30,
                    cursor: "pointer",
                    "&:hover": { color: "primary.main" },
                  }}
                />
                <Twitter
                  sx={{
                    fontSize: 30,
                    cursor: "pointer",
                    "&:hover": { color: "primary.main" },
                  }}
                />
                <Instagram
                  sx={{
                    fontSize: 30,
                    cursor: "pointer",
                    "&:hover": { color: "primary.main" },
                  }}
                />
              </Box>
            </Grid>
          </Grid>
          <Box
            mt={4}
            pt={4}
            borderTop="1px solid rgba(255,255,255,0.1)"
            textAlign="center"
          >
            <Typography color="rgba(255,255,255,0.7)">
              © 2024 تاكسي برو. جميع الحقوق محفوظة.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Hidden Admin Link */}
      <Link
        href="/admin/login"
        style={{
          position: "fixed",
          bottom: "10px",
          left: "10px",
          opacity: 0.01,
          fontSize: "1px",
        }}
      >
        Admin
      </Link>
    </Box>
  );
}
