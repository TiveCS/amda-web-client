export type MitraResponsePayload = {
  id: number;
  name: string;
  slug: string;
  _count: {
    users: number;
    activities: number;
  };
};

export type GetMitraResponse = MitraResponsePayload[];

export type AddMitraPayload = {
  name: string;
};

export type AddMitraResponse = {
  id: number;
  name: string;
  slug: string;
};

export interface MitraSelectOption {
  value: string;
  label: string;
}
