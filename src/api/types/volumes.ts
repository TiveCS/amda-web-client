import { DesignatorForLop } from "./designators";

export type LopVolume = {
  id: number;
  value: number;
  designator: DesignatorForLop;
};

export type GetListVolumesOfTicketResponse = {
  id: number;
  identifier: string;
  volumes: LopVolume[];
};

export type GetAddVolumeToTicketResponse = LopVolume;
