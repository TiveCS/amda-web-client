import { create } from "zustand";
import { ProfileType } from "../types";

type ProfileStatusType =
  | "authenticated"
  | "unauthenticated"
  | "loading"
  | "error";

interface ProfileState {
  profile: ProfileType | null;
  logout: () => void;
  setProfile: (newUser: ProfileType) => void;
  setStatus: (newStatus: ProfileStatusType) => void;
  status: ProfileStatusType;
}

export const useProfileStore = create<ProfileState>()((set) => ({
  profile: null,
  status: "loading",
  logout: () => set(() => ({ profile: null, status: "unauthenticated" })),
  setProfile: (newProfile: ProfileType) => set(() => ({ profile: newProfile })),
  setStatus: (newStatus: ProfileStatusType) =>
    set(() => ({ status: newStatus })),
}));
