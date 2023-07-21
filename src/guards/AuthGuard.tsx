import { getProfile } from "@api/auth";
import { useQuery } from "@tanstack/react-query";
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

  const { data: profile, status } = useQuery(
    ["profile"],
    async () => {
      try {
        const response = await getProfile();
        profileStore.setProfile(response.data);
        profileStore.setStatus("authenticated");
        profileStore.setError(false);
        return response.data;
      } catch (error) {
        if (error.response?.status === 401) {
          profileStore.setStatus("unauthenticated");
          throw new Error("MAS: Unauthorized");
        }
        profileStore.setError(true);
        console.log("status", profileStore.status);

        throw error;
      } finally {
        profileStore.setLoading(false);
      }
    },
    { retry: false }
  );

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "error" || profileStore.status === "unauthenticated") {
    return <Navigate to={redirectUnauthenticated || "/auth/login"} replace />;
  }

  const role = profile?.role.slug;

  if (
    blacklistRoles?.includes(role as RoleType) ||
    (!whitelistRoles?.includes(role as RoleType) && role !== "super-admin")
  ) {
    return <Navigate to={redirectUnauthorized || "/"} replace />;
  }

  return children;
}
