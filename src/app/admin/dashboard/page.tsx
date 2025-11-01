"use client";

import { useMemo } from "react";
import { Box, Grid, Card, CardContent, Typography, Paper } from "@mui/material";
import {
  DriveEta,
  Receipt,
  AttachMoney,
  TrendingUp,
  CheckCircle,
  Pending,
  Cancel,
} from "@mui/icons-material";
import { useAppSelector } from "@/store/hooks";
import {
  getActiveDrivers,
  getTodayOrders,
  calculateTotalCost,
  calculateTotalCommission,
} from "@/utils/helpers";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

function DashboardContent() {
  const { drivers } = useAppSelector((state) => state.drivers);
  const { orders } = useAppSelector((state) => state.orders);
  const { settings } = useAppSelector((state) => state.settings);

  // حساب الإحصائيات
  const stats = useMemo(() => {
    const activeDrivers = getActiveDrivers(drivers);
    const todayOrders = getTodayOrders(orders);
    const completedOrders = orders.filter((o) => o.status === "completed");
    const todayCompletedOrders = todayOrders.filter(
      (o) => o.status === "completed"
    );

    return {
      totalDrivers: drivers.length,
      activeDrivers: activeDrivers.length,
      totalOrders: orders.length,
      todayOrders: todayOrders.length,
      completedOrders: completedOrders.length,
      pendingOrders: orders.filter((o) => o.status === "pending").length,
      inProgressOrders: orders.filter((o) => o.status === "in-progress").length,
      totalRevenue: calculateTotalCost(completedOrders),
      todayRevenue: calculateTotalCost(todayCompletedOrders),
      totalCommission: calculateTotalCommission(completedOrders),
      todayCommission: calculateTotalCommission(todayCompletedOrders),
    };
  }, [drivers, orders]);

  // بيانات الرسم البياني للطلبات الأسبوعية
  const weeklyOrdersData = [
    { day: "السبت", orders: 12 },
    { day: "الأحد", orders: 19 },
    { day: "الاثنين", orders: 15 },
    { day: "الثلاثاء", orders: 22 },
    { day: "الأربعاء", orders: 18 },
    { day: "الخميس", orders: 25 },
    { day: "الجمعة", orders: 20 },
  ];

  // بيانات الرسم البياني للإيرادات الشهرية
  const monthlyRevenueData = [
    { month: "يناير", revenue: 4500 },
    { month: "فبراير", revenue: 5200 },
    { month: "مارس", revenue: 4800 },
    { month: "أبريل", revenue: 6100 },
    { month: "مايو", revenue: 5900 },
    { month: "يونيو", revenue: 6800 },
  ];

  const StatCard = ({ title, value, icon, color, subtitle }: any) => (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography color="text.secondary" variant="body2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: `${color}.100`,
              color: `${color}.main`,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout>
      <Box>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          لوحة التحكم
        </Typography>
        <Typography color="text.secondary" mb={4}>
          مرحباً بك في لوحة تحكم تاكسي برو
        </Typography>

        {/* بطاقات الإحصائيات الرئيسية */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="إجمالي السائقين"
              value={stats.totalDrivers}
              subtitle={`${stats.activeDrivers} نشط`}
              icon={<DriveEta />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="إجمالي الطلبات"
              value={stats.totalOrders}
              subtitle={`${stats.todayOrders} اليوم`}
              icon={<Receipt />}
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="إجمالي الإيرادات"
              value={`${stats.totalRevenue} ${settings.currency}`}
              subtitle={`${stats.todayRevenue} ${settings.currency} اليوم`}
              icon={<AttachMoney />}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="إجمالي العمولات"
              value={`${stats.totalCommission} ${settings.currency}`}
              subtitle={`${stats.todayCommission} ${settings.currency} اليوم`}
              icon={<TrendingUp />}
              color="warning"
            />
          </Grid>
        </Grid>

        {/* بطاقات حالة الطلبات */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <CheckCircle sx={{ fontSize: 40, color: "success.main" }} />
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {stats.completedOrders}
                    </Typography>
                    <Typography color="text.secondary">طلبات مكتملة</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Pending sx={{ fontSize: 40, color: "warning.main" }} />
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {stats.inProgressOrders}
                    </Typography>
                    <Typography color="text.secondary">
                      طلبات قيد التنفيذ
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Cancel sx={{ fontSize: 40, color: "error.main" }} />
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {stats.pendingOrders}
                    </Typography>
                    <Typography color="text.secondary">طلبات معلقة</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* الرسوم البيانية */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" mb={3}>
                الطلبات الأسبوعية
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyOrdersData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#FFD700" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" mb={3}>
                الإيرادات الشهرية ({settings.currency})
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#1E293B"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* أحدث الطلبات */}
        <Paper sx={{ mt: 4, p: 3 }}>
          <Typography variant="h6" fontWeight="bold" mb={3}>
            أحدث الطلبات
          </Typography>
          <Box>
            {orders.slice(0, 5).map((order) => (
              <Box
                key={order.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 2,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  "&:last-child": {
                    borderBottom: "none",
                  },
                }}
              >
                <Box>
                  <Typography fontWeight="bold">{order.driverName}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {order.startLocation} ← {order.destination}
                  </Typography>
                </Box>
                <Box textAlign="left">
                  <Typography fontWeight="bold">
                    {order.cost} {settings.currency}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color:
                        order.status === "completed"
                          ? "success.main"
                          : order.status === "in-progress"
                          ? "warning.main"
                          : "error.main",
                    }}
                  >
                    {order.status === "completed"
                      ? "مكتمل"
                      : order.status === "in-progress"
                      ? "قيد التنفيذ"
                      : "معلق"}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>
    </AdminLayout>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
