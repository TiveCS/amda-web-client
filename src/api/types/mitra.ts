export type MitraResponsePayload = {
  id: number;
  name: string;
  slug: string;
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
