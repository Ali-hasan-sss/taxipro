"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { Box, CircularProgress } from "@mui/material";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // التحقق من وجود token في localStorage
    const token = localStorage.getItem("token");

    if (!token && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, router]);

  // إذا لم يتم التحقق بعد، عرض loading
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token && !isAuthenticated) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}
