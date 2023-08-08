import { LOPS_TICKETS_URL } from "./routes";
import { apiRequest, axiosAuthedApi } from "./helpers";
import {
  GetAllTicketLocationsResponse,
  GetAllTicketsResponse,
  GetTicketEvidencesResponse,
  LopTicketAcceptanceStatus,
  LopTicketEvidenceStatus,
} from "./types/tickets";
import { NestResponse } from "./types/common";

export async function getListTickets({
  cursor,
  search,
  take,
  location,
  identifier,
  acceptStatus,
  evidenceStatus,
  mitraIds,
}: {
  take?: number;
  cursor?: number;
  search?: string;
  location?: string[];
  identifier?: string[];
  acceptStatus?: LopTicketAcceptanceStatus | null;
  evidenceStatus?: LopTicketEvidenceStatus | null;
  mitraIds?: number[];
}) {
  const request = axiosAuthedApi.get<never>(`${LOPS_TICKETS_URL}`, {
    params: {
      take: take ? take : undefined,
      cursor: cursor ? cursor : undefined,

      search: search && search.trim().length > 0 ? search.trim() : undefined,
      identifier: identifier && identifier.length > 0 ? identifier : undefined,

      location: location && location.length > 0 ? location : undefined,
      acceptStatus: acceptStatus ? acceptStatus : undefined,
      evidenceStatus: evidenceStatus ? evidenceStatus : undefined,

      mitraIds: mitraIds ? mitraIds : undefined,
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
  const request = axiosAuthedApi.get<never>(`${LOPS_TICKETS_URL}/locations`, {
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
  const request = axiosAuthedApi.get<never>(
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

  const request = axiosAuthedApi.post<never>(
    `${LOPS_TICKETS_URL}/${ticketIdentifier}/evidences`,
    formData
  );

  return apiRequest<NestResponse<GetTicketEvidencesResponse>>(request);
}

export async function deleteTicketEvidence(
  ticketIdentifier: string,
  type: "after" | "onProgress" | "before"
) {
  const request = axiosAuthedApi.delete<never>(
    `${LOPS_TICKETS_URL}/${ticketIdentifier}/evidences/${type}`
  );

  return apiRequest<NestResponse<GetTicketEvidencesResponse>>(request);
}

export async function acceptTicket(
  ticketIdentifier: string,
  {
    force = false,
    note = null,
  }: {
    force?: boolean;
    note: string | null;
  }
) {
  const request = axiosAuthedApi.put<never>(
    `${LOPS_TICKETS_URL}/${ticketIdentifier}/status`,
    {
      force,
      note: note ? note : undefined,
      status: "ACCEPTED",
    }
  );

  return apiRequest<NestResponse<GetTicketEvidencesResponse>>(request);
}

export async function rejectTicket(
  ticketIdentifier: string,
  {
    note = null,
  }: {
    note?: string | null;
  }
) {
  const request = axiosAuthedApi.put<never>(
    `${LOPS_TICKETS_URL}/${ticketIdentifier}/status`,
    {
      force: false,
      note: note ? note : undefined,
      status: "REJECTED",
    }
  );

  return apiRequest<NestResponse<GetTicketEvidencesResponse>>(request);
}
