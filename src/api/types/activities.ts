export type ActivitiesWorkType = "RECOVERY" | "RELOKASI";

export type Activities = {
  id: number;
  lop: string;
  sto: string;
  mitra: string;
  ticketIdentifier: string;
  ticketLocation: string;
  inputAt: Date;
  workType: ActivitiesWorkType;
  workDescription?: string;
  isForMitra: boolean;
};

export type ActivitiesSto = {
  sto: string | null;
};

export type ActivitiesMitra = {
  mitra: string | null;
};

export type GetAllActivitiesResponse = Activities[];
export type GetAllActivitiesStoResponse = ActivitiesSto[];
export type GetAllActivitiesMitraResponse = ActivitiesMitra[];
