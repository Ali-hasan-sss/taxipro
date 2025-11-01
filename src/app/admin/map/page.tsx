"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
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
} from "@mui/material";
import { LocationOn, DriveEta } from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { updateDriverLocation } from "@/store/slices/driversSlice";
import { getActiveDrivers } from "@/utils/helpers";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";

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
  const router = useRouter();
  const { drivers } = useAppSelector((state) => state.drivers);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [liveTracking, setLiveTracking] = useState(true);
  const [showInactiveDrivers, setShowInactiveDrivers] = useState(false);

  const activeDrivers = getActiveDrivers(drivers);
  const displayDrivers = showInactiveDrivers ? drivers : activeDrivers;
  const driversWithLocation = displayDrivers.filter((d) => d.location);

  // دالة للانتقال إلى صفحة الطلبات مع اختيار السائق
  const handleAddOrder = (driverId: string) => {
    // تخزين السائق المختار في localStorage للاستخدام في صفحة الطلبات
    localStorage.setItem("selectedDriverForOrder", driverId);
    router.push("/admin/orders");
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
