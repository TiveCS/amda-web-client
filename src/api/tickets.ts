import axios from "axios";
import { LOPS_TICKETS_URL } from "./routes";
import { apiRequest } from "./helpers";
import {
  GetAllTicketLocationsResponse,
  GetAllTicketsResponse,
} from "./types/tickets";
import { NestResponse } from "./types/common";

export async function getListTickets({
  cursor,
  search,
  take,
  location,
  statusAcc,
  evidenceStatus,
}: {
  take?: number;
  cursor?: number;
  search?: string;
  location?: string[];
  statusAcc?: boolean | null;
  evidenceStatus?: boolean | null;
}) {
  const request = axios.get<never>(`${LOPS_TICKETS_URL}`, {
    params: {
      take: take ? take : undefined,
      cursor: cursor ? cursor : undefined,
      search: search && search.trim().length > 0 ? search.trim() : undefined,

      location: location && location.length > 0 ? location : undefined,
      isAccepted:
        statusAcc !== undefined && statusAcc !== null ? statusAcc : undefined,
      isEvidenceComplete:
        evidenceStatus !== undefined && evidenceStatus !== null
          ? evidenceStatus
          : undefined,
    },
  });

  const result = await apiRequest<NestResponse<GetAllTicketsResponse>>(request);

  return result;
}

export async function getListTicketLocations({
  cursor,
  search,
  take,
}: {
  take?: number;
  cursor?: number;
  search?: string;
}) {
  const request = axios.get<never>(`${LOPS_TICKETS_URL}/locations`, {
    params: {
      take: take ? take : undefined,
      cursor: cursor ? cursor : undefined,
      search: search && search.trim().length > 0 ? search.trim() : undefined,
    },
  });

  return apiRequest<NestResponse<GetAllTicketLocationsResponse>>(request);
}
