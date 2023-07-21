import { getProfile } from "@api/auth";
import { useQuery } from "@tanstack/react-query";
import { useProfileStore } from "@zustand/profileStore";
import { Navigate, Outlet } from "react-router-dom";

export default function AuthGuard() {
  const profileStore = useProfileStore();

  const query = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        const response = await getProfile();
        if (response.data) {
          profileStore.setProfile(response.data);
          profileStore.setStatus("authenticated");
          return response.data; // return the data
        } else {
          profileStore.setStatus("unauthenticated");
          return;
        }
      } catch (error) {
        console.error(error);
        profileStore.setStatus("error");
        throw error; // forward the error to react-query
      }
    },
  });

  if (query.isFetching) return <p>Loading...</p>;

  if (query.isFetched && profileStore.status === "unauthenticated")
    return <Navigate to="/auth/login" />;

  return <Outlet />;
}
