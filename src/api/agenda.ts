import { apiRequest, axiosAuthedApi } from "./helpers";
import { AGENDAS_URL } from "./routes";
import {
  AddAgendaPayload,
  AddAgendaResponse,
  GetAgendaResponse,
} from "./types/agenda";
import { NestResponse } from "./types/common";

export async function addAgenda(payload: AddAgendaPayload) {
  const request = axiosAuthedApi.post<never>(AGENDAS_URL, {
    title: payload.title,
    basisOfAgenda: payload.basisOfAgenda,
    time: payload.time.toISOString(),
    note: payload.note,
    picId: payload.picId,
  });

  return await apiRequest<NestResponse<AddAgendaResponse>>(request);
}

export async function getListAgenda({
  search,
  time,
}: {
  limit?: number;
  cursor?: number;
  search?: string;
  time: Date;
}) {
  const request = axiosAuthedApi.get<never>(AGENDAS_URL, {
    params: {
      search: search && search?.trim().length > 0 ? search?.trim() : undefined,
      time,
    },
  });

  return await apiRequest<NestResponse<GetAgendaResponse>>(request);
}

export async function editAgenda({
  agendaId,
  payload,
}: {
  agendaId: number;
  payload: {
    title: string;
    basisOfAgenda: string;
    time: Date;
    note: string;
    picId: number;
  };
}) {
  const request = axiosAuthedApi.put<never>(`${AGENDAS_URL}/${agendaId}`, {
    title: payload.title,
    basisOfAgenda: payload.basisOfAgenda,
    time: payload.time.toISOString(),
    note: payload.note,
    picId: payload.picId,
  });

  return await apiRequest<NestResponse<never>>(request);
}

export async function removeAgenda(agendaId: number) {
  const request = axiosAuthedApi.delete<never>(`${AGENDAS_URL}/${agendaId}`);

  return await apiRequest<NestResponse<never>>(request);
}
