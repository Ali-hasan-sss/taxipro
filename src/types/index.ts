// أنواع السائقين
export interface Driver {
  id: string;
  name: string;
  mobile: string;
  carType: "private" | "public";
  carModel: string;
  carPlateNumber: string;
  isActive: boolean;
  location?: {
    lat: number;
    lng: number;
  };
  createdAt: string;
}

// أنواع الطلبات
export interface Order {
  id: string;
  driverId: string;
  driverName: string;
  startLocation: string;
  destination: string;
  cost: number;
  commission?: number;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  createdAt: string;
  completedAt?: string;
}

// أنواع المستخدمين
export interface User {
  id: string;
  username: string;
  role: "admin";
}

// إعدادات الشركة
export interface CompanySettings {
  commissionRate: number; // نسبة العمولة بالمئة
  companyName: string;
  currency: string;
}

// إحصائيات
export interface Statistics {
  totalDrivers: number;
  activeDrivers: number;
  totalOrders: number;
  todayOrders: number;
  totalRevenue: number;
  todayRevenue: number;
  totalCommission: number;
  todayCommission: number;
}

// حالات Redux
export interface DriversState {
  drivers: Driver[];
  loading: boolean;
  error: string | null;
}

export interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface SettingsState {
  settings: CompanySettings;
  loading: boolean;
  error: string | null;
}
