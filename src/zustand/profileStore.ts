import { create } from "zustand";
import { ProfileType } from "../types";

type ProfileStatusType = "authenticated" | "unauthenticated";

interface ProfileState {
  profile: ProfileType | null;
  status: ProfileStatusType;
  isLoading: boolean;
  isError: boolean;
  logout: () => void;
  setLoading: (newLoading: boolean) => void;
  setProfile: (newUser: ProfileType) => void;
  setStatus: (newStatus: ProfileStatusType) => void;
  setError: (newError: boolean) => void;
}

export const useProfileStore = create<ProfileState>()((set) => ({
  profile: null,
  status: "unauthenticated",
  isLoading: true,
  isError: false,
  logout: () =>
    set(() => ({
      profile: null,
      status: "unauthenticated",
      isError: false,
      isLoading: false,
    })),
  setLoading: (newLoading: boolean) => set(() => ({ isLoading: newLoading })),
  setProfile: (newProfile: ProfileType) => set(() => ({ profile: newProfile })),
  setStatus: (newStatus: ProfileStatusType) =>
    set(() => ({ status: newStatus })),
  setError: (newError: boolean) => set(() => ({ isError: newError })),
}));
