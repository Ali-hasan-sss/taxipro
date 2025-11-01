"use client";

import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Divider,
  Paper,
} from "@mui/material";
import { Save, Settings as SettingsIcon } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateSettings } from "@/store/slices/settingsSlice";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";

function SettingsContent() {
  const dispatch = useAppDispatch();
  const { settings } = useAppSelector((state) => state.settings);

  const [formData, setFormData] = useState({
    companyName: settings.companyName,
    commissionRate: settings.commissionRate.toString(),
    currency: settings.currency,
  });

  const [errors, setErrors] = useState<any>({});
  const [success, setSuccess] = useState(false);

  // التحقق من البيانات
  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = "اسم الشركة مطلوب";
    }

    const rate = parseFloat(formData.commissionRate);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      newErrors.commissionRate = "نسبة العمولة يجب أن تكون بين 0 و 100";
    }

    if (!formData.currency.trim()) {
      newErrors.currency = "العملة مطلوبة";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // حفظ الإعدادات
  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const updatedSettings = {
      companyName: formData.companyName,
      commissionRate: parseFloat(formData.commissionRate),
      currency: formData.currency,
    };

    dispatch(updateSettings(updatedSettings));
    setSuccess(true);

    // إخفاء رسالة النجاح بعد 3 ثواني
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  // إعادة تعيين الإعدادات
  const handleReset = () => {
    setFormData({
      companyName: settings.companyName,
      commissionRate: settings.commissionRate.toString(),
      currency: settings.currency,
    });
    setErrors({});
    setSuccess(false);
  };

  return (
    <AdminLayout>
      <Box>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <SettingsIcon sx={{ fontSize: 40, color: "primary.main" }} />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              الإعدادات
            </Typography>
            <Typography color="text.secondary">
              إعدادات الشركة والنظام
            </Typography>
          </Box>
        </Box>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            تم حفظ الإعدادات بنجاح
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* إعدادات الشركة */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  معلومات الشركة
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <TextField
                    fullWidth
                    label="اسم الشركة"
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                    error={!!errors.companyName}
                    helperText={errors.companyName}
                  />

                  <TextField
                    fullWidth
                    label="نسبة العمولة (%)"
                    type="number"
                    value={formData.commissionRate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        commissionRate: e.target.value,
                      })
                    }
                    error={!!errors.commissionRate}
                    helperText={
                      errors.commissionRate ||
                      "نسبة العمولة التي يتم اقتطاعها من كل طلب"
                    }
                    inputProps={{ min: 0, max: 100, step: 0.1 }}
                  />

                  <TextField
                    fullWidth
                    label="العملة"
                    value={formData.currency}
                    onChange={(e) =>
                      setFormData({ ...formData, currency: e.target.value })
                    }
                    error={!!errors.currency}
                    helperText={errors.currency || "مثال: ر.س، ج.م، د.ك"}
                  />

                  <Box display="flex" gap={2} justifyContent="flex-end">
                    <Button variant="outlined" onClick={handleReset}>
                      إلغاء
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSave}
                    >
                      حفظ التغييرات
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* معاينة الإعدادات الحالية */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, bgcolor: "primary.main", color: "white" }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                الإعدادات الحالية
              </Typography>
              <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", mb: 2 }} />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    اسم الشركة
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {settings.companyName}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    نسبة العمولة
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {settings.commissionRate}%
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    العملة
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {settings.currency}
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* معلومات إضافية */}
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  معلومات مهمة
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  • نسبة العمولة يتم تطبيقها على جميع الطلبات الجديدة
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  • الطلبات السابقة لن تتأثر بتغيير نسبة العمولة
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • يمكنك تغيير الإعدادات في أي وقت
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* أمثلة على حساب العمولة */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  أمثلة على حساب العمولة
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                  {[50, 100, 200, 500].map((amount) => {
                    const rate = parseFloat(formData.commissionRate) || 0;
                    const commission = (amount * rate) / 100;
                    const driverEarnings = amount - commission;

                    return (
                      <Grid item xs={12} sm={6} md={3} key={amount}>
                        <Paper
                          sx={{
                            p: 2,
                            textAlign: "center",
                            bgcolor: "grey.50",
                          }}
                        >
                          <Typography
                            variant="h5"
                            fontWeight="bold"
                            color="primary"
                          >
                            {amount} {formData.currency}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            تكلفة الطلب
                          </Typography>
                          <Divider sx={{ my: 1 }} />
                          <Typography variant="body2" color="warning.main">
                            عمولة: {commission.toFixed(2)} {formData.currency}
                          </Typography>
                          <Typography variant="body2" color="success.main">
                            للسائق: {driverEarnings.toFixed(2)}{" "}
                            {formData.currency}
                          </Typography>
                        </Paper>
                      </Grid>
                    );
                  })}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </AdminLayout>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}
