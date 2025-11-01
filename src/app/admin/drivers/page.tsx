"use client";

import { useState } from "react";
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
  Alert,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  PersonOff,
  PersonOutline,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addDriver,
  updateDriver,
  deleteDriver,
  toggleDriverStatus,
} from "@/store/slices/driversSlice";
import { Driver } from "@/types";
import { generateId } from "@/utils/helpers";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";

function DriversContent() {
  const dispatch = useAppDispatch();
  const { drivers } = useAppSelector((state) => state.drivers);

  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentDriver, setCurrentDriver] = useState<Driver | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<string | null>(null);

  // نموذج السائق
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    carType: "private" as "private" | "public",
    carModel: "",
    carPlateNumber: "",
  });

  const [errors, setErrors] = useState<any>({});

  // فتح نافذة إضافة سائق جديد
  const handleAddClick = () => {
    setEditMode(false);
    setCurrentDriver(null);
    setFormData({
      name: "",
      mobile: "",
      carType: "private",
      carModel: "",
      carPlateNumber: "",
    });
    setErrors({});
    setOpenDialog(true);
  };

  // فتح نافذة تعديل سائق
  const handleEditClick = (driver: Driver) => {
    setEditMode(true);
    setCurrentDriver(driver);
    setFormData({
      name: driver.name,
      mobile: driver.mobile,
      carType: driver.carType,
      carModel: driver.carModel,
      carPlateNumber: driver.carPlateNumber,
    });
    setErrors({});
    setOpenDialog(true);
  };

  // التحقق من البيانات
  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = "اسم السائق مطلوب";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "رقم الموبايل مطلوب";
    } else if (!/^05\d{8}$/.test(formData.mobile)) {
      newErrors.mobile = "رقم الموبايل غير صحيح (مثال: 0501234567)";
    }

    if (!formData.carModel.trim()) {
      newErrors.carModel = "موديل السيارة مطلوب";
    }

    if (!formData.carPlateNumber.trim()) {
      newErrors.carPlateNumber = "رقم اللوحة مطلوب";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // حفظ السائق
  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    if (editMode && currentDriver) {
      // تعديل سائق موجود
      const updatedDriver: Driver = {
        ...currentDriver,
        ...formData,
      };
      dispatch(updateDriver(updatedDriver));
    } else {
      // إضافة سائق جديد
      const newDriver: Driver = {
        id: generateId(),
        ...formData,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      dispatch(addDriver(newDriver));
    }

    setOpenDialog(false);
  };

  // تأكيد حذف السائق
  const handleDeleteClick = (driverId: string) => {
    setDriverToDelete(driverId);
    setDeleteConfirmOpen(true);
  };

  // حذف السائق
  const handleDeleteConfirm = () => {
    if (driverToDelete) {
      dispatch(deleteDriver(driverToDelete));
      setDeleteConfirmOpen(false);
      setDriverToDelete(null);
    }
  };

  // تغيير حالة نشاط السائق
  const handleToggleStatus = (driverId: string) => {
    dispatch(toggleDriverStatus(driverId));
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
              إدارة السائقين
            </Typography>
            <Typography color="text.secondary">
              إضافة وتعديل وحذف السائقين
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddClick}
            size="large"
          >
            إضافة سائق جديد
          </Button>
        </Box>

        {/* جدول السائقين */}
        <Card>
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: { xs: 650, sm: 750 } }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>اسم السائق</strong>
                  </TableCell>
                  <TableCell>
                    <strong>الموبايل</strong>
                  </TableCell>
                  <TableCell>
                    <strong>نوع السيارة</strong>
                  </TableCell>
                  <TableCell>
                    <strong>موديل السيارة</strong>
                  </TableCell>
                  <TableCell>
                    <strong>رقم اللوحة</strong>
                  </TableCell>
                  <TableCell>
                    <strong>الحالة</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>الإجراءات</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {drivers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography color="text.secondary" py={4}>
                        لا يوجد سائقين
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  drivers.map((driver) => (
                    <TableRow key={driver.id}>
                      <TableCell>{driver.name}</TableCell>
                      <TableCell>{driver.mobile}</TableCell>
                      <TableCell>
                        <Chip
                          label={driver.carType === "private" ? "خاصة" : "عامة"}
                          color={
                            driver.carType === "private"
                              ? "primary"
                              : "secondary"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{driver.carModel}</TableCell>
                      <TableCell>{driver.carPlateNumber}</TableCell>
                      <TableCell>
                        <Chip
                          label={driver.isActive ? "نشط" : "غير نشط"}
                          color={driver.isActive ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color={driver.isActive ? "error" : "success"}
                          onClick={() => handleToggleStatus(driver.id)}
                          title={driver.isActive ? "إيقاف" : "تفعيل"}
                        >
                          {driver.isActive ? <PersonOff /> : <PersonOutline />}
                        </IconButton>
                        <IconButton
                          color="primary"
                          onClick={() => handleEditClick(driver)}
                          title="تعديل"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteClick(driver.id)}
                          title="حذف"
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

        {/* نافذة إضافة/تعديل سائق */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {editMode ? "تعديل سائق" : "إضافة سائق جديد"}
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                fullWidth
                label="اسم السائق"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                error={!!errors.name}
                helperText={errors.name}
              />

              <TextField
                fullWidth
                label="رقم الموبايل"
                value={formData.mobile}
                onChange={(e) =>
                  setFormData({ ...formData, mobile: e.target.value })
                }
                error={!!errors.mobile}
                helperText={errors.mobile}
                placeholder="0501234567"
              />

              <FormControl fullWidth>
                <InputLabel>نوع السيارة</InputLabel>
                <Select
                  value={formData.carType}
                  label="نوع السيارة"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      carType: e.target.value as "private" | "public",
                    })
                  }
                >
                  <MenuItem value="private">خاصة</MenuItem>
                  <MenuItem value="public">عامة</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="موديل السيارة"
                value={formData.carModel}
                onChange={(e) =>
                  setFormData({ ...formData, carModel: e.target.value })
                }
                error={!!errors.carModel}
                helperText={errors.carModel}
                placeholder="تويوتا كامري 2022"
              />

              <TextField
                fullWidth
                label="رقم لوحة السيارة"
                value={formData.carPlateNumber}
                onChange={(e) =>
                  setFormData({ ...formData, carPlateNumber: e.target.value })
                }
                error={!!errors.carPlateNumber}
                helperText={errors.carPlateNumber}
                placeholder="أ ب ج 1234"
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

        {/* نافذة تأكيد الحذف */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
        >
          <DialogTitle>تأكيد الحذف</DialogTitle>
          <DialogContent>
            <Alert severity="warning">
              هل أنت متأكد من حذف هذا السائق؟ لا يمكن التراجع عن هذا الإجراء.
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)}>إلغاء</Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
            >
              حذف
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
}

export default function DriversPage() {
  return (
    <ProtectedRoute>
      <DriversContent />
    </ProtectedRoute>
  );
}
