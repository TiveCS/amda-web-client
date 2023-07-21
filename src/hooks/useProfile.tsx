import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@api/auth";
import { useProfileStore } from "@zustand/profileStore";
import { isAxiosError } from "axios";

export function useProfile() {
  const profileStore = useProfileStore();

  // Then in your query function
  return useQuery(
    ["profile"],
    async () => {
      try {
        const response = await getProfile();
        profileStore.setProfile(response.data);
        profileStore.setStatus("authenticated");
        return response;
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 401) {
          profileStore.setStatus("unauthenticated");
          throw new Error("Unauthorized");
        }
        profileStore.setError(true);
        throw error;
      }
    },
    { retry: false }
  );
}
