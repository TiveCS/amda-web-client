import { useProfileStore } from "@zustand/profileStore";
import { PropsWithChildren } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { RoleType } from "../types";

interface AuthGuardProps {
  redirectUnauthenticated?: string;
  redirectUnauthorized?: string;
  blacklistRoles?: RoleType[];
  whitelistRoles?: RoleType[];
}

export default function AuthGuard({
  redirectUnauthenticated,
  redirectUnauthorized,
  blacklistRoles,
  whitelistRoles,
  children = <Outlet />,
}: PropsWithChildren<AuthGuardProps>) {
  const { isAuthenticated, ...profileStore } = useProfileStore();

  if (!isAuthenticated()) {
    return <Navigate to={redirectUnauthenticated || "/auth/login"} replace />;
  }

  const role = profileStore.profile?.role.slug;

  if (
    blacklistRoles?.includes(role as RoleType) ||
    (!whitelistRoles?.includes(role as RoleType) && role !== "super-admin")
  ) {
    return <Navigate to={redirectUnauthorized || "/"} replace />;
  }

  return children;
}
