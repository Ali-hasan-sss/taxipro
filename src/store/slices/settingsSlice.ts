import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SettingsState, CompanySettings } from "@/types";

const initialState: SettingsState = {
  settings: {
    commissionRate: 5, // 5% عمولة افتراضية
    companyName: "تاكسي برو",
    currency: "ل.س",
  },
  loading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<CompanySettings>) => {
      state.settings = action.payload;
    },
    updateCommissionRate: (state, action: PayloadAction<number>) => {
      state.settings.commissionRate = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { updateSettings, updateCommissionRate, setLoading, setError } =
  settingsSlice.actions;

export default settingsSlice.reducer;
