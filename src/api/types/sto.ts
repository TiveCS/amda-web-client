export type StoResponsePayload = {
  id: number;
  name: string;
  slug: string;
  _count: {
    activities: number;
  };
};

export type GetStoResponse = StoResponsePayload[];

export type AddStoPayload = {
  name: string;
};

export type AddStoResponse = {
  id: number;
  name: string;
  slug: string;
};

export interface StoSelectOption {
  value: string;
  label: string;
}
