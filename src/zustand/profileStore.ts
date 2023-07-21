import { ProfileType } from "src/types";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface ProfileState {
  profile: ProfileType | null;
  setProfile: (profile: ProfileType | null) => void;
  isAuthenticated: () => boolean;
}

export const useProfileStore = create<ProfileState>()(
  devtools(
    persist(
      (set, get) => ({
        profile: null,
        setProfile: (newProfile) => set(() => ({ profile: newProfile })),
        isAuthenticated: () => get().profile !== null,
      }),
      {
        name: "profile-storage",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);
