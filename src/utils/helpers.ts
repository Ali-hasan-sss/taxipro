import { Order, Driver } from "@/types";

// حساب إجمالي التكلفة للطلبات
export const calculateTotalCost = (orders: Order[]): number => {
  return orders.reduce((total, order) => total + order.cost, 0);
};

// حساب إجمالي العمولة
export const calculateTotalCommission = (orders: Order[]): number => {
  return orders.reduce((total, order) => total + (order.commission || 0), 0);
};

// الحصول على طلبات سائق معين
export const getDriverOrders = (orders: Order[], driverId: string): Order[] => {
  return orders.filter((order) => order.driverId === driverId);
};

// حساب العمولة بناءً على التكلفة ونسبة العمولة
export const calculateCommission = (
  cost: number,
  commissionRate: number
): number => {
  return (cost * commissionRate) / 100;
};

// الحصول على طلبات اليوم
export const getTodayOrders = (orders: Order[]): Order[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    orderDate.setHours(0, 0, 0, 0);
    return orderDate.getTime() === today.getTime();
  });
};

// الحصول على السائقين النشطين
export const getActiveDrivers = (drivers: Driver[]): Driver[] => {
  return drivers.filter((driver) => driver.isActive);
};

// تنسيق التاريخ بالعربية
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// توليد ID عشوائي
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};
