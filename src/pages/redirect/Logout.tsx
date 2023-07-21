import { useProfileStore } from "@zustand/profileStore";
import { Navigate } from "react-router-dom";

export default function LogoutRedirect() {
  const profileStore = useProfileStore();

  if (profileStore.isAuthenticated()) {
    profileStore.setProfile(null);
  }

  return <Navigate to={"/auth/login"} replace />;
}
