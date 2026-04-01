import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { clearAuth, isTokenValid } from "@/lib/blog-api";

type Props = {
  children: React.ReactNode;
};

const AdminProtectedRoute = ({ children }: Props) => {
  const valid = isTokenValid();

  useEffect(() => {
    if (!valid) clearAuth();
  }, [valid]);

  if (!valid) return <Navigate to="/admin" replace />;
  return <>{children}</>;
};

export default AdminProtectedRoute;

