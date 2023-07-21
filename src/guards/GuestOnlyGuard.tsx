import { useProfileStore } from "@zustand/profileStore";
import { PropsWithChildren } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface GuestOnlyGuardProps {
  fallback?: string;
  noFetching?: boolean;
}

export default function GuestOnlyGuard({
  fallback,
  children = <Outlet />,
}: PropsWithChildren<GuestOnlyGuardProps>) {
  const { isAuthenticated } = useProfileStore();

  if (isAuthenticated()) {
    return <Navigate to={fallback || "/"} replace />;
  }

  return children;
}
