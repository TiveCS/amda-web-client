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

export type PostAddVolumeToTicketResponse = LopVolume;

export type PutUpdateVolumeFromTicketResponse = LopVolume;

export type DeleteVolumeFromTicketResponse = { id: number };
