import { useProfile } from "@hooks/useProfile";
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
  const profileStore = useProfileStore();

  const { data: profile, status } = useProfile();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "error" || profileStore.status === "unauthenticated") {
    return <Navigate to={redirectUnauthenticated || "/auth/login"} replace />;
  }

  const role = profile?.data.role.slug;

  if (
    blacklistRoles?.includes(role as RoleType) ||
    (!whitelistRoles?.includes(role as RoleType) && role !== "super-admin")
  ) {
    return <Navigate to={redirectUnauthorized || "/"} replace />;
  }

  return children;
}
