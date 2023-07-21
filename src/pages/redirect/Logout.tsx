import { useQuery } from "@tanstack/react-query";
import { useProfileStore } from "@zustand/profileStore";
import { Navigate, useNavigate } from "react-router-dom";

export default function LogoutRedirect() {
  const profileStore = useProfileStore();
  const navigate = useNavigate();

  const logoutQuery = useQuery({
    queryKey: ["logout"],
    queryFn: () => {
      profileStore.logout();
      return navigate("/auth/login");
    },
  });

  if (logoutQuery.isFetching) return <p>Logging out...</p>;

  return <Navigate to="/auth/login" />;
}
