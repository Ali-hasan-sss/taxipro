import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order, OrdersState } from "@/types";

const initialState: OrdersState = {
  orders: [
    // بيانات تجريبية - طرطوس، سوريا
    {
      id: "1",
      driverId: "1",
      driverName: "أحمد محمد",
      startLocation: "طرطوس - الكورنيش الجنوبي",
      destination: "طرطوس - ساحة الشهداء",
      cost: 15000,
      commission: 3000,
      status: "completed",
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    },
    {
      id: "2",
      driverId: "2",
      driverName: "خالد علي",
      startLocation: "طرطوس - المدينة القديمة",
      destination: "طرطوس - مشتى الحلو",
      cost: 25000,
      commission: 5000,
      status: "in-progress",
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      driverId: "3",
      driverName: "محمود حسن",
      startLocation: "طرطوس - المشفى الوطني",
      destination: "طرطوس - الأوتوستراد الدولي",
      cost: 18000,
      commission: 3600,
      status: "completed",
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    },
    {
      id: "4",
      driverId: "4",
      driverName: "عمر يوسف",
      startLocation: "طرطوس - حي الزهراء",
      destination: "طرطوس - الميناء",
      cost: 12000,
      commission: 2400,
      status: "completed",
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    },
    {
      id: "5",
      driverId: "5",
      driverName: "ياسر إبراهيم",
      startLocation: "طرطوس - حي الثورة",
      destination: "طرطوس - الجامعة",
      cost: 20000,
      commission: 4000,
      status: "pending",
      createdAt: new Date().toISOString(),
    },
  ],
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.push(action.payload);
    },
    updateOrder: (state, action: PayloadAction<Order>) => {
      const index = state.orders.findIndex((o) => o.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    },
    deleteOrder: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter((o) => o.id !== action.payload);
    },
    updateOrderStatus: (
      state,
      action: PayloadAction<{ id: string; status: Order["status"] }>
    ) => {
      const order = state.orders.find((o) => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
        if (action.payload.status === "completed") {
          order.completedAt = new Date().toISOString();
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addOrder,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
  setLoading,
  setError,
} = ordersSlice.actions;

export default ordersSlice.reducer;
