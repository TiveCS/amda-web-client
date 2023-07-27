import { LopVolume } from "./volumes";

export type LopTicket = {
  id: number;
  identifier: string;
  location: string;
  volumes: LopVolume[];
};

export type GetAllTicketsResponse = LopTicket[];
