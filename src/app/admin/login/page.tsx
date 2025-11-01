"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { LocalTaxi, Visibility, VisibilityOff } from "@mui/icons-material";
import { useAppDispatch } from "@/store/hooks";
import {
  loginSuccess,
  loginFailure,
  setLoading,
} from "@/store/slices/authSlice";

export default function AdminLogin() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // التحقق من البيانات
    if (!username || !password) {
      setError("يرجى إدخال اسم المستخدم وكلمة المرور");
      return;
    }

    dispatch(setLoading(true));

    // محاكاة تسجيل الدخول (في التطبيق الحقيقي، سيتم إرسال طلب للـ API)
    setTimeout(() => {
      if (username === "admin" && password === "admin123") {
        const user = {
          id: "1",
          username: "admin",
          role: "admin" as const,
        };

        dispatch(loginSuccess(user));
        localStorage.setItem("token", "demo-token");
        router.push("/admin/dashboard");
      } else {
        dispatch(loginFailure("اسم المستخدم أو كلمة المرور غير صحيحة"));
        setError("اسم المستخدم أو كلمة المرور غير صحيحة");
      }
    }, 1000);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ borderRadius: 3, boxShadow: 6 }}>
          <CardContent sx={{ p: 4 }}>
            {/* Logo & Title */}
            <Box textAlign="center" mb={4}>
              <LocalTaxi sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                تاكسي برو
              </Typography>
              <Typography variant="body1" color="text.secondary">
                لوحة تحكم المدير
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="اسم المستخدم"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
                variant="outlined"
                autoFocus
              />

              <TextField
                fullWidth
                label="كلمة المرور"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, py: 1.5 }}
              >
                تسجيل الدخول
              </Button>
            </form>

            {/* Demo Credentials */}
            <Box mt={4} p={2} bgcolor="grey.100" borderRadius={2}>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                mb={1}
              >
                بيانات تجريبية للتجربة:
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                اسم المستخدم: admin
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                كلمة المرور: admin123
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <Box textAlign="center" mt={3}>
          <Button
            variant="text"
            sx={{ color: "white" }}
            onClick={() => router.push("/")}
          >
            العودة للصفحة الرئيسية
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
