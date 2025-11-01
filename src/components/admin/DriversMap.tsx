"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { DivIcon, LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Driver } from "@/types";
import {
  Box,
  Chip,
  Typography,
  IconButton,
  Tooltip,
  Button,
  Stack,
} from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import AddIcon from "@mui/icons-material/Add";

// مكون لتحديث مركز الخريطة
function MapUpdater({ center }: { center: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

interface DriversMapProps {
  drivers: Driver[];
  selectedDriver?: string | null;
  onAddOrder?: (driverId: string) => void;
}

export default function DriversMap({
  drivers,
  selectedDriver,
  onAddOrder,
}: DriversMapProps) {
  const [mounted, setMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // التعامل مع ملء الشاشة
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // فتح واتساب مع رقم السائق
  const handleWhatsApp = (mobile: string) => {
    // إزالة الصفر من البداية وإضافة كود سوريا +963
    const phoneNumber = mobile.startsWith("0")
      ? "963" + mobile.substring(1)
      : "963" + mobile;
    window.open(`https://wa.me/${phoneNumber}`, "_blank");
  };

  // السائقين الذين لديهم مواقع
  const driversWithLocation = drivers.filter((d) => d.location && d.isActive);

  // المركز الافتراضي (طرطوس، سوريا)
  const defaultCenter: LatLngExpression = [34.8895, 35.8837];

  // المركز الحالي
  const center = selectedDriver
    ? (() => {
        const driver = driversWithLocation.find((d) => d.id === selectedDriver);
        return driver?.location
          ? ([driver.location.lat, driver.location.lng] as LatLngExpression)
          : defaultCenter;
      })()
    : defaultCenter;

  // إنشاء أيقونة أفاتار دائري مخصص
  const createAvatarIcon = (driver: Driver) => {
    // اسم السائق كاملاً
    const driverName = driver.name;

    // لون الأفاتار حسب حالة النشاط
    const bgColor = driver.isActive ? "#FFD700" : "#9E9E9E";
    const textColor = driver.isActive ? "#1E293B" : "#FFFFFF";

    const html = `
      <div style="
        min-width: 80px;
        height: 40px;
        border-radius: 20px;
        background-color: ${bgColor};
        color: ${textColor};
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: bold;
        font-family: 'Cairo', 'Tajawal', Arial, sans-serif;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        cursor: pointer;
        transition: transform 0.2s;
        padding: 0 12px;
        white-space: nowrap;
      ">
        ${driverName}
      </div>
    `;

    return new DivIcon({
      html,
      className: "custom-driver-icon",
      iconSize: [80, 40],
      iconAnchor: [40, 20],
      popupAnchor: [0, -20],
    });
  };

  if (!mounted) {
    return (
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
        <Typography color="text.secondary">جارٍ تحميل الخريطة...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: isFullscreen ? "fixed" : "relative",
        top: isFullscreen ? 0 : "auto",
        left: isFullscreen ? 0 : "auto",
        right: isFullscreen ? 0 : "auto",
        bottom: isFullscreen ? 0 : "auto",
        height: isFullscreen
          ? "100vh"
          : { xs: "400px", sm: "500px", md: "600px" },
        width: isFullscreen ? "100vw" : "100%",
        zIndex: isFullscreen ? 9999 : "auto",
        borderRadius: isFullscreen ? 0 : 2,
        overflow: "hidden",
      }}
    >
      {/* زر ملء الشاشة */}
      <Tooltip title={isFullscreen ? "الخروج من ملء الشاشة" : "ملء الشاشة"}>
        <IconButton
          onClick={toggleFullscreen}
          sx={{
            position: "absolute",
            top: { xs: 5, sm: 10 },
            right: { xs: 5, sm: 10 },
            zIndex: 1000,
            bgcolor: "background.paper",
            boxShadow: 2,
            padding: { xs: 1, sm: 1.5 },
            "&:hover": {
              bgcolor: "background.paper",
            },
          }}
          size="small"
        >
          {isFullscreen ? (
            <FullscreenExitIcon fontSize="small" />
          ) : (
            <FullscreenIcon fontSize="small" />
          )}
        </IconButton>
      </Tooltip>

      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={center} />

        {driversWithLocation.map((driver) => (
          <Marker
            key={driver.id}
            position={[driver.location!.lat, driver.location!.lng]}
            icon={createAvatarIcon(driver)}
          >
            <Popup>
              <Box sx={{ minWidth: 220 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {driver.name}
                </Typography>
                <Box
                  sx={{
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      الموبايل:
                    </Typography>
                    <Typography variant="body2">{driver.mobile}</Typography>
                  </Box>
                  <Tooltip title="محادثة واتساب">
                    <IconButton
                      size="small"
                      color="success"
                      onClick={() => handleWhatsApp(driver.mobile)}
                      sx={{
                        bgcolor: "#25D366",
                        color: "white",
                        "&:hover": {
                          bgcolor: "#128C7E",
                        },
                      }}
                    >
                      <WhatsAppIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    السيارة:
                  </Typography>
                  <Typography variant="body2">{driver.carModel}</Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    رقم اللوحة:
                  </Typography>
                  <Typography variant="body2">
                    {driver.carPlateNumber}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={driver.carType === "private" ? "خاصة" : "عامة"}
                    color={
                      driver.carType === "private" ? "primary" : "secondary"
                    }
                    size="small"
                  />
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<AddIcon />}
                    fullWidth
                    onClick={() => onAddOrder && onAddOrder(driver.id)}
                    sx={{
                      fontSize: "0.75rem",
                      py: 0.5,
                    }}
                  >
                    إضافة طلب
                  </Button>
                </Stack>
              </Box>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
}
