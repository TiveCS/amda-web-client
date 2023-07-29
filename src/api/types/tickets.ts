import { LopVolume } from "./volumes";

export type LopTicket = {
  id: number;
  identifier: string;
  location: string;
  acceptedAt: Date | null;
  volumes: LopVolume[];
  evidence: LopTicketEvidence;
};

export type LopTicketEvidence = {
  afterKey: string | null;
  beforeKey: string | null;
  onProgressKey: string | null;
};

export type LopTicketEvidenceUrl = {
  afterUrl: string | null;
  beforeUrl: string | null;
  onProgressUrl: string | null;
};

export type LopTicketLocation = {
  location: string | null;
};

export type GetAllTicketsResponse = LopTicket[];

export type GetAllTicketLocationsResponse = LopTicketLocation[];

export type GetTicketEvidencesResponse = LopTicketEvidenceUrl;

export type PostTicketEvidencesResponse = {
  id: number;
} & LopTicketEvidenceUrl;
