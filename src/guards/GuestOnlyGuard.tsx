import { useProfile } from "@hooks/useProfile";
import { useProfileStore } from "@zustand/profileStore";
import { PropsWithChildren } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface GuestOnlyGuardProps {
  fallback?: string;
}

export default function GuestOnlyGuard({
  fallback,
  children = <Outlet />,
}: PropsWithChildren<GuestOnlyGuardProps>) {
  const { status } = useProfileStore();
  useProfile();

  if (status === "authenticated") {
    return <Navigate to={fallback || "/"} replace />;
  }

  return children;
}
