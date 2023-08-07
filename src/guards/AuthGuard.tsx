import { useProfileStore } from "@zustand/profileStore";
import { PropsWithChildren } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { checkRoleAllowed } from "src/utils";
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
  const { isAuthenticated, profile } = useProfileStore();

  if (!isAuthenticated()) {
    return <Navigate to={redirectUnauthenticated || "/auth/login"} replace />;
  }

  const role = profile?.role.slug as unknown as RoleType;

  const isAllowed = checkRoleAllowed(role, {
    blackListedRoles: blacklistRoles,
    whiteListedRoles: whitelistRoles,
  });

  if (!isAllowed) {
    console.log("UNAUTHORIZED");

    return <Navigate to={redirectUnauthorized || "/"} />;
  }

  return children;
}
