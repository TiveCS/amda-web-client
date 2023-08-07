export type ProfileType = {
  id: number;
  name: string;
  username: string;
  role: {
    id: number;
    name: string;
    slug: string;
  };
  mitra: {
    id: number;
    name: string;
    slug: string;
  };
};

export type RoleType =
  | "super-admin"
  | "admin-ta"
  | "ta-uji-terima"
  | "ta-maintenance"
  | "admin-mitra";
