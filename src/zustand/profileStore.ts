import { ProfileType } from "src/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ProfileState {
  profile: ProfileType | null;
  setProfile: (profile: ProfileType | null) => void;
  isAuthenticated: () => boolean;
  clear: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
      isAuthenticated: () => get().profile !== null,
      clear: () => {
        useProfileStore.persist.clearStorage();
        set({ profile: null });
      },
      // profile: null,
      // setProfile: (newProfile) => set(() => ({ profile: newProfile })),
      // isAuthenticated: () => get().profile !== null,
    }),
    {
      name: "profile-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
