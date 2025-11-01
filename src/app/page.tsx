"use client";

import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
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
} from "@mui/icons-material";
import Link from "next/link";

export default function Home() {
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
        }}
      >
        <Container maxWidth="lg">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center" gap={1}>
              <LocalTaxi sx={{ fontSize: 40, color: "primary.main" }} />
              <Typography variant="h5" fontWeight="bold">
                تاكسي برو
              </Typography>
            </Box>
            <Box display="flex" gap={2}>
              <Button variant="text" sx={{ color: "white" }} href="#services">
                خدماتنا
              </Button>
              <Button variant="text" sx={{ color: "white" }} href="#features">
                المميزات
              </Button>
              <Button variant="text" sx={{ color: "white" }} href="#contact">
                تواصل معنا
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

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
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            مرحباً بك في تاكسي برو
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            أفضل خدمة نقل في المدينة - سريعة، آمنة، ومريحة
          </Typography>
          <Box display="flex" gap={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: "primary.main",
                color: "secondary.main",
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
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
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
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
          <Typography variant="h3" textAlign="center" fontWeight="bold" mb={6}>
            لماذا تاكسي برو؟
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
                    وصول سريع في أقل من 5 دقائق
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
          <Typography variant="h3" textAlign="center" fontWeight="bold" mb={6}>
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
                  العمل.
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
                  خدمة نقل اقتصادية وسريعة تناسب جميع الاحتياجات اليومية.
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
          <Typography variant="h3" textAlign="center" fontWeight="bold" mb={6}>
            تواصل معنا
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Phone sx={{ fontSize: 50, color: "primary.main", mb: 2 }} />
                <Typography variant="h6" fontWeight="bold">
                  الهاتف
                </Typography>
                <Typography color="text.secondary">+966 50 123 4567</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Email sx={{ fontSize: 50, color: "primary.main", mb: 2 }} />
                <Typography variant="h6" fontWeight="bold">
                  البريد الإلكتروني
                </Typography>
                <Typography color="text.secondary">info@taxipro.sa</Typography>
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
                  الرياض، المملكة العربية السعودية
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
                أفضل خدمة نقل في المدينة - سريعة، آمنة، ومريحة
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
