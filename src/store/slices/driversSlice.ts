import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Driver, DriversState } from "@/types";

const initialState: DriversState = {
  drivers: [
    // بيانات تجريبية - طرطوس، سوريا
    {
      id: "1",
      name: "أيهم حسن ",
      mobile: "0931234567",
      carType: "private",
      carModel: "تويوتا كامري 2022",
      carPlateNumber: "طرطوس 123456",
      isActive: true,
      location: { lat: 34.8895, lng: 35.8837 },
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "خالد علي",
      mobile: "0937654321",
      carType: "public",
      carModel: "هيونداي النترا 2021",
      carPlateNumber: "طرطوس 234567",
      isActive: true,
      location: { lat: 34.8915, lng: 35.8857 },
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      name: "محمود حسن",
      mobile: "0939876543",
      carType: "private",
      carModel: "نيسان ماكسيما 2023",
      carPlateNumber: "طرطوس 345678",
      isActive: true,
      location: { lat: 34.8875, lng: 35.8817 },
      createdAt: new Date().toISOString(),
    },
    {
      id: "4",
      name: "عمر يوسف",
      mobile: "0941122334",
      carType: "public",
      carModel: "كيا سيراتو 2020",
      carPlateNumber: "طرطوس 456789",
      isActive: true,
      location: { lat: 34.8905, lng: 35.8827 },
      createdAt: new Date().toISOString(),
    },
    {
      id: "5",
      name: "ياسر إبراهيم",
      mobile: "0945566778",
      carType: "private",
      carModel: "مازدا 6 - 2022",
      carPlateNumber: "طرطوس 567890",
      isActive: true,
      location: { lat: 34.8885, lng: 35.8847 },
      createdAt: new Date().toISOString(),
    },
    {
      id: "6",
      name: "سامر الأحمد",
      mobile: "0949988776",
      carType: "public",
      carModel: "شيفروليه كروز 2019",
      carPlateNumber: "طرطوس 678901",
      isActive: true,
      location: { lat: 34.8865, lng: 35.8867 },
      createdAt: new Date().toISOString(),
    },
    {
      id: "7",
      name: "فراس حمود",
      mobile: "0932233445",
      carType: "private",
      carModel: "فولكس واجن باسات 2021",
      carPlateNumber: "طرطوس 789012",
      isActive: false,
      location: { lat: 34.8925, lng: 35.8877 },
      createdAt: new Date().toISOString(),
    },
    {
      id: "8",
      name: "بلال خليل",
      mobile: "0936677889",
      carType: "public",
      carModel: "رينو ميجان 2020",
      carPlateNumber: "طرطوس 890123",
      isActive: true,
      location: { lat: 34.8855, lng: 35.8807 },
      createdAt: new Date().toISOString(),
    },
    {
      id: "9",
      name: "نبيل سعيد",
      mobile: "0944455667",
      carType: "private",
      carModel: "سكودا أوكتافيا 2023",
      carPlateNumber: "طرطوس 901234",
      isActive: true,
      location: { lat: 34.8935, lng: 35.8797 },
      createdAt: new Date().toISOString(),
    },
    {
      id: "10",
      name: "طارق عباس",
      mobile: "0948899001",
      carType: "public",
      carModel: "بيجو 508 - 2021",
      carPlateNumber: "طرطوس 012345",
      isActive: true,
      location: { lat: 34.8845, lng: 35.8887 },
      createdAt: new Date().toISOString(),
    },
  ],
  loading: false,
  error: null,
};

const driversSlice = createSlice({
  name: "drivers",
  initialState,
  reducers: {
    addDriver: (state, action: PayloadAction<Driver>) => {
      state.drivers.push(action.payload);
    },
    updateDriver: (state, action: PayloadAction<Driver>) => {
      const index = state.drivers.findIndex((d) => d.id === action.payload.id);
      if (index !== -1) {
        state.drivers[index] = action.payload;
      }
    },
    deleteDriver: (state, action: PayloadAction<string>) => {
      state.drivers = state.drivers.filter((d) => d.id !== action.payload);
    },
    toggleDriverStatus: (state, action: PayloadAction<string>) => {
      const driver = state.drivers.find((d) => d.id === action.payload);
      if (driver) {
        driver.isActive = !driver.isActive;
      }
    },
    updateDriverLocation: (
      state,
      action: PayloadAction<{
        id: string;
        location: { lat: number; lng: number };
      }>
    ) => {
      const driver = state.drivers.find((d) => d.id === action.payload.id);
      if (driver) {
        driver.location = action.payload.location;
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
  addDriver,
  updateDriver,
  deleteDriver,
  toggleDriverStatus,
  updateDriverLocation,
  setLoading,
  setError,
} = driversSlice.actions;

export default driversSlice.reducer;
