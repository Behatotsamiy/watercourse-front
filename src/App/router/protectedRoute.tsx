import { Navigate } from "react-router-dom";
import type React from "react";

type Props = {
  children: React.ReactNode;
};

const isAuth = true; // потом подключишь auth

const ProtectedRoute = ({ children }: Props) => {
  if (!isAuth) {
    return <Navigate to="auth?mode=login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;