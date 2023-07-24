import { useProfileStore } from "@zustand/profileStore";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

export default function LogoutRedirect() {
  const profileStore = useProfileStore();

  useEffect(() => {
    if (profileStore.isAuthenticated()) {
      profileStore.setProfile(null);
    }
  }, [profileStore]);

  return <Navigate to={"/auth/login"} replace />;
}
