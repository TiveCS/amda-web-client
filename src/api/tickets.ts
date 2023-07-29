import axios from "axios";
import { LOPS_TICKETS_URL } from "./routes";
import { apiRequest } from "./helpers";
import {
  GetAllTicketLocationsResponse,
  GetAllTicketsResponse,
  GetTicketEvidencesResponse,
} from "./types/tickets";
import { NestResponse } from "./types/common";

export async function getListTickets({
  cursor,
  search,
  take,
  location,
  identifier,
  statusAcc,
  evidenceStatus,
}: {
  take?: number;
  cursor?: number;
  search?: string;
  location?: string[];
  identifier?: string[];
  statusAcc?: boolean | null;
  evidenceStatus?: boolean | null;
}) {
  const request = axios.get<never>(`${LOPS_TICKETS_URL}`, {
    params: {
      take: take ? take : undefined,
      cursor: cursor ? cursor : undefined,

      search: search && search.trim().length > 0 ? search.trim() : undefined,
      identifier: identifier && identifier.length > 0 ? identifier : undefined,

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

export async function getTicketEvidences(
  ticketIdentifier: string,
  select: {
    after: boolean;
    before: boolean;
    onProgress: boolean;
  }
) {
  const request = axios.get<never>(
    `${LOPS_TICKETS_URL}/${ticketIdentifier}/evidences`,
    {
      params: {
        after: select.after,
        before: select.before,
        onProgress: select.onProgress,
      },
    }
  );

  return apiRequest<NestResponse<GetTicketEvidencesResponse>>(request);
}

export async function uploadTicketEvidence(
  ticketIdentifier: string,
  payload: {
    file: File;
    type: "after" | "onProgress" | "before";
  }
) {
  const formData = new FormData();
  formData.append("file", payload.file);
  formData.append("type", payload.type);

  const request = axios.post<never>(
    `${LOPS_TICKETS_URL}/${ticketIdentifier}/evidences`,
    formData
  );

  return apiRequest<NestResponse<GetTicketEvidencesResponse>>(request);
}

export async function deleteTicketEvidence(
  ticketIdentifier: string,
  type: "after" | "onProgress" | "before"
) {
  const request = axios.delete<never>(
    `${LOPS_TICKETS_URL}/${ticketIdentifier}/evidences/${type}`
  );

  return apiRequest<NestResponse<GetTicketEvidencesResponse>>(request);
}
