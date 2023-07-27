import { LopVolume } from "./volumes";

export type LopTicket = {
  id: number;
  identifier: string;
  location: string;
  volumes: LopVolume[];
};

export type LopTicketLocation = {
  location: string | null;
};

export type GetAllTicketsResponse = LopTicket[];

export type GetAllTicketLocationsResponse = LopTicketLocation[];
