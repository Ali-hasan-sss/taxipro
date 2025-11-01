"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Chip,
  Paper,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
} from "@mui/material";
import { LocationOn, DriveEta } from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { updateDriverLocation } from "@/store/slices/driversSlice";
import { addOrder } from "@/store/slices/ordersSlice";
import {
  getActiveDrivers,
  generateId,
  calculateCommission,
} from "@/utils/helpers";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import { Order } from "@/types";

// تحميل الخريطة ديناميكياً لتجنب مشاكل SSR
const DriversMap = dynamic(() => import("@/components/admin/DriversMap"), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        height: "600px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.100",
        borderRadius: 2,
      }}
    >
      <Typography>جارٍ تحميل الخريطة...</Typography>
    </Box>
  ),
});

function MapContent() {
  const dispatch = useAppDispatch();
  const { drivers } = useAppSelector((state) => state.drivers);
  const { settings } = useAppSelector((state) => state.settings);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [liveTracking, setLiveTracking] = useState(true);
  const [showInactiveDrivers, setShowInactiveDrivers] = useState(false);

  // حالة Dialog إضافة الطلب
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [selectedDriverForOrder, setSelectedDriverForOrder] = useState<
    string | null
  >(null);
  const [orderFormData, setOrderFormData] = useState({
    startLocation: "",
    destination: "",
    cost: "",
  });
  const [orderErrors, setOrderErrors] = useState<any>({});
  const [orderSuccess, setOrderSuccess] = useState(false);

  const activeDrivers = getActiveDrivers(drivers);
  const displayDrivers = showInactiveDrivers ? drivers : activeDrivers;
  const driversWithLocation = displayDrivers.filter((d) => d.location);

  // دالة لفتح Dialog إضافة الطلب
  const handleAddOrder = (driverId: string) => {
    setSelectedDriverForOrder(driverId);
    setOrderFormData({
      startLocation: "",
      destination: "",
      cost: "",
    });
    setOrderErrors({});
    setOrderSuccess(false);
    setOrderDialogOpen(true);
  };

  // التحقق من بيانات الطلب
  const validateOrderForm = () => {
    const newErrors: any = {};

    if (!orderFormData.startLocation.trim()) {
      newErrors.startLocation = "نقطة الانطلاق مطلوبة";
    }

    if (!orderFormData.destination.trim()) {
      newErrors.destination = "الوجهة مطلوبة";
    }

    if (!orderFormData.cost || parseFloat(orderFormData.cost) <= 0) {
      newErrors.cost = "التكلفة يجب أن تكون أكبر من صفر";
    }

    setOrderErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // حفظ الطلب
  const handleSaveOrder = () => {
    if (!validateOrderForm() || !selectedDriverForOrder) return;

    const driver = drivers.find((d) => d.id === selectedDriverForOrder);
    if (!driver) return;

    const cost = parseFloat(orderFormData.cost);
    const commission = calculateCommission(cost, settings.commissionRate);

    const newOrder: Order = {
      id: generateId(),
      driverId: driver.id,
      driverName: driver.name,
      startLocation: orderFormData.startLocation,
      destination: orderFormData.destination,
      cost,
      commission,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    dispatch(addOrder(newOrder));
    setOrderSuccess(true);

    // إغلاق Dialog بعد ثانيتين
    setTimeout(() => {
      setOrderDialogOpen(false);
      setOrderSuccess(false);
    }, 2000);
  };

  // محاكاة تحديث مواقع السائقين كل 5 ثواني
  useEffect(() => {
    if (!liveTracking) return;

    const interval = setInterval(() => {
      activeDrivers.forEach((driver) => {
        if (driver.location) {
          // تحريك عشوائي صغير للموقع (محاكاة الحركة)
          const newLocation = {
            lat: driver.location.lat + (Math.random() - 0.5) * 0.003,
            lng: driver.location.lng + (Math.random() - 0.5) * 0.003,
          };
          dispatch(
            updateDriverLocation({
              id: driver.id,
              location: newLocation,
            })
          );
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [liveTracking, activeDrivers, dispatch]);

  return (
    <AdminLayout>
      <Box>
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}
        >
          توزع السائقين
        </Typography>
        <Typography
          color="text.secondary"
          mb={3}
          sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
        >
          تتبع مواقع السائقين وتحركاتهم بشكل مباشر
        </Typography>

        <Grid container spacing={{ xs: 2, md: 3 }}>
          {/* قائمة السائقين */}
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
                  >
                    السائقين
                  </Typography>
                  <Chip
                    label={driversWithLocation.length}
                    color="primary"
                    size="small"
                  />
                </Box>

                <Box
                  mb={2}
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "row", sm: "column" },
                    gap: { xs: 1, sm: 0 },
                  }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={liveTracking}
                        onChange={(e) => setLiveTracking(e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Typography
                        sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
                      >
                        تتبع مباشر
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showInactiveDrivers}
                        onChange={(e) =>
                          setShowInactiveDrivers(e.target.checked)
                        }
                        color="secondary"
                      />
                    }
                    label={
                      <Typography
                        sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
                      >
                        عرض غير النشطين
                      </Typography>
                    }
                  />
                </Box>

                <List
                  sx={{ maxHeight: { xs: 300, md: 500 }, overflow: "auto" }}
                >
                  {driversWithLocation.length === 0 ? (
                    <Box textAlign="center" py={4}>
                      <Typography color="text.secondary" variant="body2">
                        لا يوجد سائقين على الخريطة
                      </Typography>
                    </Box>
                  ) : (
                    driversWithLocation.map((driver) => (
                      <ListItem key={driver.id} disablePadding>
                        <ListItemButton
                          selected={selectedDriver === driver.id}
                          onClick={() =>
                            setSelectedDriver(
                              selectedDriver === driver.id ? null : driver.id
                            )
                          }
                          sx={{
                            borderRadius: 1,
                            mb: 0.5,
                            "&.Mui-selected": {
                              bgcolor: "primary.main",
                              color: "white",
                              "&:hover": {
                                bgcolor: "primary.dark",
                              },
                            },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: { xs: 35, md: 40 } }}>
                            <LocationOn
                              sx={{
                                color:
                                  selectedDriver === driver.id
                                    ? "white"
                                    : "primary.main",
                                fontSize: { xs: "1.2rem", md: "1.5rem" },
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography
                                sx={{
                                  fontSize: { xs: "0.875rem", md: "1rem" },
                                }}
                              >
                                {driver.name}
                              </Typography>
                            }
                            secondary={
                              <Box
                                component="span"
                                sx={{
                                  color:
                                    selectedDriver === driver.id
                                      ? "rgba(255,255,255,0.7)"
                                      : "text.secondary",
                                  fontSize: { xs: "0.75rem", md: "0.875rem" },
                                }}
                              >
                                {driver.carModel}
                              </Box>
                            }
                          />
                          {!driver.isActive && (
                            <Chip
                              label="غير نشط"
                              size="small"
                              sx={{
                                ml: 1,
                                fontSize: { xs: "0.65rem", md: "0.75rem" },
                              }}
                            />
                          )}
                        </ListItemButton>
                      </ListItem>
                    ))
                  )}
                </List>
              </CardContent>
            </Card>

            {/* إحصائيات */}
            <Paper sx={{ p: 2, mt: 2, display: { xs: "none", md: "block" } }}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <DriveEta color="primary" />
                <Typography variant="subtitle2" fontWeight="bold">
                  إحصائيات سريعة
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    إجمالي السائقين:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {drivers.length}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    السائقين النشطين:
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    color="success.main"
                  >
                    {activeDrivers.length}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    على الخريطة:
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    color="primary.main"
                  >
                    {driversWithLocation.length}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* الخريطة */}
          <Grid item xs={12} md={9}>
            <Card>
              <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
                <DriversMap
                  drivers={displayDrivers}
                  selectedDriver={selectedDriver}
                  onAddOrder={handleAddOrder}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Dialog إضافة طلب */}
        <Dialog
          open={orderDialogOpen}
          onClose={() => setOrderDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6" fontWeight="bold">
              إضافة طلب جديد
            </Typography>
            {selectedDriverForOrder && (
              <Typography variant="body2" color="text.secondary">
                السائق:{" "}
                {drivers.find((d) => d.id === selectedDriverForOrder)?.name}
              </Typography>
            )}
          </DialogTitle>
          <DialogContent dividers>
            {orderSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                تم إضافة الطلب بنجاح!
              </Alert>
            )}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="نقطة الانطلاق"
                value={orderFormData.startLocation}
                onChange={(e) =>
                  setOrderFormData({
                    ...orderFormData,
                    startLocation: e.target.value,
                  })
                }
                error={!!orderErrors.startLocation}
                helperText={orderErrors.startLocation}
                fullWidth
                placeholder="طرطوس - الكورنيش الجنوبي"
              />
              <TextField
                label="الوجهة"
                value={orderFormData.destination}
                onChange={(e) =>
                  setOrderFormData({
                    ...orderFormData,
                    destination: e.target.value,
                  })
                }
                error={!!orderErrors.destination}
                helperText={orderErrors.destination}
                fullWidth
                placeholder="طرطوس - ساحة الشهداء"
              />
              <TextField
                label={`التكلفة (${settings.currency})`}
                type="number"
                value={orderFormData.cost}
                onChange={(e) =>
                  setOrderFormData({ ...orderFormData, cost: e.target.value })
                }
                error={!!orderErrors.cost}
                helperText={
                  orderErrors.cost ||
                  (orderFormData.cost &&
                    `العمولة (${
                      settings.commissionRate
                    }%): ${calculateCommission(
                      parseFloat(orderFormData.cost),
                      settings.commissionRate
                    ).toLocaleString()} ${settings.currency}`)
                }
                fullWidth
                placeholder="15000"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOrderDialogOpen(false)}>إلغاء</Button>
            <Button
              onClick={handleSaveOrder}
              variant="contained"
              disabled={orderSuccess}
            >
              حفظ الطلب
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
}

export default function MapPage() {
  return (
    <ProtectedRoute>
      <MapContent />
    </ProtectedRoute>
  );
}
