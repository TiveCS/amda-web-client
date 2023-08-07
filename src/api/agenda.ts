import axios from "axios";
import { AGENDAS_URL } from "./routes";
import { apiRequest } from "./helpers";
import { NestResponse } from "./types/common";
import {
  AddAgendaPayload,
  AddAgendaResponse,
  GetAgendaResponse,
} from "./types/agenda";

export async function addAgenda(payload: AddAgendaPayload) {
  const request = axios.post<never>(AGENDAS_URL, {
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
  const request = axios.get<never>(AGENDAS_URL, {
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
  const request = axios.put<never>(`${AGENDAS_URL}/${agendaId}`, {
    title: payload.title,
    basisOfAgenda: payload.basisOfAgenda,
    time: payload.time.toISOString(),
    note: payload.note,
    picId: payload.picId,
  });

  return await apiRequest<NestResponse<never>>(request);
}

export async function removeAgenda(agendaId: number) {
  const request = axios.delete<never>(`${AGENDAS_URL}/${agendaId}`);

  return await apiRequest<NestResponse<never>>(request);
}
