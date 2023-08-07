import { logout } from "@api/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProfileStore } from "@zustand/profileStore";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

export default function LogoutRedirect() {
  const { isAuthenticated, setProfile } = useProfileStore();
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: async () => {
      await logout();

      setProfile(null);
      await queryClient.invalidateQueries(["auth_guard_profile"]);
    },
  });

  useEffect(() => {
    if (isAuthenticated()) {
      void mutateAsync();
    }
  }, [isAuthenticated, mutateAsync]);

  return <Navigate to={"/auth/login"} replace />;
}
