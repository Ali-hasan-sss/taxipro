"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import { Add, Visibility, Delete } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addOrder,
  updateOrderStatus,
  deleteOrder,
} from "@/store/slices/ordersSlice";
import { Order } from "@/types";
import {
  generateId,
  formatDate,
  calculateCommission,
  getDriverOrders,
  calculateTotalCost,
  calculateTotalCommission,
} from "@/utils/helpers";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";

function OrdersContent() {
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector((state) => state.orders);
  const { drivers } = useAppSelector((state) => state.drivers);
  const { settings } = useAppSelector((state) => state.settings);

  const [openDialog, setOpenDialog] = useState(false);
  const [viewOrderDialog, setViewOrderDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentTab, setCurrentTab] = useState(0);

  // نموذج الطلب
  const [formData, setFormData] = useState({
    driverId: "",
    startLocation: "",
    destination: "",
    cost: "",
  });

  const [errors, setErrors] = useState<any>({});

  // فحص localStorage عند تحميل الصفحة
  useEffect(() => {
    const selectedDriverId = localStorage.getItem("selectedDriverForOrder");
    if (selectedDriverId) {
      setFormData({
        driverId: selectedDriverId,
        startLocation: "",
        destination: "",
        cost: "",
      });
      setOpenDialog(true);
      // حذف من localStorage بعد الاستخدام
      localStorage.removeItem("selectedDriverForOrder");
    }
  }, []);

  // فتح نافذة إضافة طلب جديد
  const handleAddClick = () => {
    setFormData({
      driverId: "",
      startLocation: "",
      destination: "",
      cost: "",
    });
    setErrors({});
    setOpenDialog(true);
  };

  // عرض تفاصيل الطلب
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setViewOrderDialog(true);
  };

  // التحقق من البيانات
  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.driverId) {
      newErrors.driverId = "يرجى اختيار السائق";
    }

    if (!formData.startLocation.trim()) {
      newErrors.startLocation = "نقطة الانطلاق مطلوبة";
    }

    if (!formData.destination.trim()) {
      newErrors.destination = "الوجهة مطلوبة";
    }

    if (!formData.cost || parseFloat(formData.cost) <= 0) {
      newErrors.cost = "التكلفة يجب أن تكون أكبر من صفر";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // حفظ الطلب
  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const driver = drivers.find((d) => d.id === formData.driverId);
    if (!driver) return;

    const cost = parseFloat(formData.cost);
    const commission = calculateCommission(cost, settings.commissionRate);

    const newOrder: Order = {
      id: generateId(),
      driverId: formData.driverId,
      driverName: driver.name,
      startLocation: formData.startLocation,
      destination: formData.destination,
      cost,
      commission,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    dispatch(addOrder(newOrder));
    setOpenDialog(false);
  };

  // تغيير حالة الطلب
  const handleStatusChange = (orderId: string, status: Order["status"]) => {
    dispatch(updateOrderStatus({ id: orderId, status }));
  };

  // حذف الطلب
  const handleDelete = (orderId: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الطلب؟")) {
      dispatch(deleteOrder(orderId));
    }
  };

  // تصفية الطلبات حسب التبويب
  const filteredOrders = useMemo(() => {
    switch (currentTab) {
      case 0:
        return orders; // جميع الطلبات
      case 1:
        return orders.filter((o) => o.status === "pending");
      case 2:
        return orders.filter((o) => o.status === "in-progress");
      case 3:
        return orders.filter((o) => o.status === "completed");
      default:
        return orders;
    }
  }, [orders, currentTab]);

  // حساب تقرير سائق
  const [reportDriverId, setReportDriverId] = useState("");
  const [showReport, setShowReport] = useState(false);

  const handleGenerateReport = () => {
    if (reportDriverId) {
      setShowReport(true);
    }
  };

  const driverReport = useMemo(() => {
    if (!reportDriverId) return null;

    const driver = drivers.find((d) => d.id === reportDriverId);
    if (!driver) return null;

    const driverOrders = getDriverOrders(orders, reportDriverId);
    const completedOrders = driverOrders.filter(
      (o) => o.status === "completed"
    );
    const totalRevenue = calculateTotalCost(completedOrders);
    const totalCommission = calculateTotalCommission(completedOrders);
    const driverEarnings = totalRevenue - totalCommission;

    return {
      driver,
      totalOrders: driverOrders.length,
      completedOrders: completedOrders.length,
      totalRevenue,
      totalCommission,
      driverEarnings,
    };
  }, [reportDriverId, drivers, orders]);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "completed":
        return "success";
      case "in-progress":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "completed":
        return "مكتمل";
      case "in-progress":
        return "قيد التنفيذ";
      case "cancelled":
        return "ملغي";
      default:
        return "معلق";
    }
  };

  return (
    <AdminLayout>
      <Box>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              إدارة الطلبات
            </Typography>
            <Typography color="text.secondary">
              إضافة وإدارة الطلبات وحساب العمولات
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddClick}
            size="large"
          >
            إضافة طلب جديد
          </Button>
        </Box>

        {/* تقرير السائق */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            تقرير أرباح السائق
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>اختر السائق</InputLabel>
                <Select
                  value={reportDriverId}
                  label="اختر السائق"
                  onChange={(e) => setReportDriverId(e.target.value)}
                >
                  <MenuItem value="">-- اختر السائق --</MenuItem>
                  {drivers.map((driver) => (
                    <MenuItem key={driver.id} value={driver.id}>
                      {driver.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleGenerateReport}
                disabled={!reportDriverId}
              >
                إنشاء تقرير
              </Button>
            </Grid>
          </Grid>

          {showReport && driverReport && (
            <Box mt={3}>
              <Grid container spacing={2}>
                <Grid item xs={6} md={2}>
                  <Box
                    textAlign="center"
                    p={2}
                    bgcolor="grey.100"
                    borderRadius={2}
                  >
                    <Typography variant="h5" fontWeight="bold" color="primary">
                      {driverReport.totalOrders}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      إجمالي الطلبات
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={2}>
                  <Box
                    textAlign="center"
                    p={2}
                    bgcolor="grey.100"
                    borderRadius={2}
                  >
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      color="success.main"
                    >
                      {driverReport.completedOrders}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      طلبات مكتملة
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box
                    textAlign="center"
                    p={2}
                    bgcolor="grey.100"
                    borderRadius={2}
                  >
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      color="info.main"
                    >
                      {driverReport.totalRevenue} {settings.currency}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      إجمالي الإيرادات
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={2}>
                  <Box
                    textAlign="center"
                    p={2}
                    bgcolor="grey.100"
                    borderRadius={2}
                  >
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      color="warning.main"
                    >
                      {driverReport.totalCommission} {settings.currency}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      العمولة ({settings.commissionRate}%)
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box
                    textAlign="center"
                    p={2}
                    bgcolor="success.light"
                    borderRadius={2}
                  >
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      color="success.dark"
                    >
                      {driverReport.driverEarnings} {settings.currency}
                    </Typography>
                    <Typography variant="caption" color="success.dark">
                      صافي أرباح السائق
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>

        {/* التبويبات */}
        <Card sx={{ mb: 2 }}>
          <Tabs
            value={currentTab}
            onChange={(e, newValue) => setCurrentTab(newValue)}
          >
            <Tab label={`جميع الطلبات (${orders.length})`} />
            <Tab
              label={`معلق (${
                orders.filter((o) => o.status === "pending").length
              })`}
            />
            <Tab
              label={`قيد التنفيذ (${
                orders.filter((o) => o.status === "in-progress").length
              })`}
            />
            <Tab
              label={`مكتمل (${
                orders.filter((o) => o.status === "completed").length
              })`}
            />
          </Tabs>
        </Card>

        {/* جدول الطلبات */}
        <Card>
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: { xs: 750, sm: 900 } }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>السائق</strong>
                  </TableCell>
                  <TableCell>
                    <strong>من</strong>
                  </TableCell>
                  <TableCell>
                    <strong>إلى</strong>
                  </TableCell>
                  <TableCell>
                    <strong>التكلفة</strong>
                  </TableCell>
                  <TableCell>
                    <strong>العمولة</strong>
                  </TableCell>
                  <TableCell>
                    <strong>الحالة</strong>
                  </TableCell>
                  <TableCell>
                    <strong>التاريخ</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>الإجراءات</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography color="text.secondary" py={4}>
                        لا يوجد طلبات
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.driverName}</TableCell>
                      <TableCell>{order.startLocation}</TableCell>
                      <TableCell>{order.destination}</TableCell>
                      <TableCell>
                        {order.cost} {settings.currency}
                      </TableCell>
                      <TableCell>
                        {order.commission} {settings.currency}
                      </TableCell>
                      <TableCell>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <Select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(
                                order.id,
                                e.target.value as Order["status"]
                              )
                            }
                            sx={{
                              color:
                                order.status === "completed"
                                  ? "success.main"
                                  : order.status === "in-progress"
                                  ? "warning.main"
                                  : "text.secondary",
                            }}
                          >
                            <MenuItem value="pending">معلق</MenuItem>
                            <MenuItem value="in-progress">قيد التنفيذ</MenuItem>
                            <MenuItem value="completed">مكتمل</MenuItem>
                            <MenuItem value="cancelled">ملغي</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {new Date(order.createdAt).toLocaleDateString(
                            "ar-SA"
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={() => handleViewOrder(order)}
                          title="عرض"
                          size="small"
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(order.id)}
                          title="حذف"
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* نافذة إضافة طلب */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>إضافة طلب جديد</DialogTitle>
          <DialogContent>
            <Box
              sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <FormControl fullWidth error={!!errors.driverId}>
                <InputLabel>السائق</InputLabel>
                <Select
                  value={formData.driverId}
                  label="السائق"
                  onChange={(e) =>
                    setFormData({ ...formData, driverId: e.target.value })
                  }
                >
                  <MenuItem value="">-- اختر السائق --</MenuItem>
                  {drivers
                    .filter((d) => d.isActive)
                    .map((driver) => (
                      <MenuItem key={driver.id} value={driver.id}>
                        {driver.name} - {driver.carModel}
                      </MenuItem>
                    ))}
                </Select>
                {errors.driverId && (
                  <Typography variant="caption" color="error">
                    {errors.driverId}
                  </Typography>
                )}
              </FormControl>

              <TextField
                fullWidth
                label="نقطة الانطلاق"
                value={formData.startLocation}
                onChange={(e) =>
                  setFormData({ ...formData, startLocation: e.target.value })
                }
                error={!!errors.startLocation}
                helperText={errors.startLocation}
                placeholder="الرياض - حي النخيل"
              />

              <TextField
                fullWidth
                label="الوجهة"
                value={formData.destination}
                onChange={(e) =>
                  setFormData({ ...formData, destination: e.target.value })
                }
                error={!!errors.destination}
                helperText={errors.destination}
                placeholder="الرياض - حي العليا"
              />

              <TextField
                fullWidth
                label={`التكلفة (${settings.currency})`}
                type="number"
                value={formData.cost}
                onChange={(e) =>
                  setFormData({ ...formData, cost: e.target.value })
                }
                error={!!errors.cost}
                helperText={
                  errors.cost ||
                  (formData.cost &&
                    parseFloat(formData.cost) > 0 &&
                    `العمولة: ${calculateCommission(
                      parseFloat(formData.cost),
                      settings.commissionRate
                    ).toFixed(2)} ${settings.currency} (${
                      settings.commissionRate
                    }%)`)
                }
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>إلغاء</Button>
            <Button onClick={handleSave} variant="contained">
              حفظ
            </Button>
          </DialogActions>
        </Dialog>

        {/* نافذة عرض تفاصيل الطلب */}
        <Dialog
          open={viewOrderDialog}
          onClose={() => setViewOrderDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          {selectedOrder && (
            <>
              <DialogTitle>تفاصيل الطلب</DialogTitle>
              <DialogContent>
                <Box sx={{ pt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        السائق
                      </Typography>
                      <Typography fontWeight="bold">
                        {selectedOrder.driverName}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        الحالة
                      </Typography>
                      <Box>
                        <Chip
                          label={getStatusText(selectedOrder.status)}
                          color={getStatusColor(selectedOrder.status)}
                          size="small"
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">
                        من
                      </Typography>
                      <Typography>{selectedOrder.startLocation}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">
                        إلى
                      </Typography>
                      <Typography>{selectedOrder.destination}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        التكلفة
                      </Typography>
                      <Typography fontWeight="bold">
                        {selectedOrder.cost} {settings.currency}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        العمولة ({settings.commissionRate}%)
                      </Typography>
                      <Typography fontWeight="bold" color="warning.main">
                        {selectedOrder.commission} {settings.currency}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">
                        تاريخ الإنشاء
                      </Typography>
                      <Typography>
                        {formatDate(selectedOrder.createdAt)}
                      </Typography>
                    </Grid>
                    {selectedOrder.completedAt && (
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">
                          تاريخ الإكمال
                        </Typography>
                        <Typography>
                          {formatDate(selectedOrder.completedAt)}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setViewOrderDialog(false)}>إغلاق</Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    </AdminLayout>
  );
}

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersContent />
    </ProtectedRoute>
  );
}
