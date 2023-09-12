import { LopVolume } from "./volumes";

export type LopTicketAcceptanceStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export type LopTicketEvidenceStatus = "COMPLETE" | "INCOMPLETE";

export type LopTicket = {
  id: number;
  identifier: string;
  location: string;
  note: string | null;
  acceptedAt: Date | null;
  acceptStatus: LopTicketAcceptanceStatus;
  volumes: LopVolume[];
  activity: LopTicketActivity;
  evidence: LopTicketEvidence;
};

export type LopTicketActivity = {
  isForMitra: boolean;
  inputAt: Date;
  mitra: {
    id: number;
    name: string;
  };
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

export type GetTicketCountsResponse = {
  total: number;
  accepted: number;
  pending: number;
  rejected: number;
};
