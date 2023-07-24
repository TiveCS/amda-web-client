import axios from "axios";
import { MANAGEMENT_MITRA_URL } from "./routes";
import { apiRequest } from "./helpers";
import { NestResponse } from "./types/common";
import {
  AddMitraPayload,
  AddMitraResponse,
  GetMitraResponse,
} from "./types/mitra";

export async function addMitra(payload: AddMitraPayload) {
  const request = axios.post<never>(MANAGEMENT_MITRA_URL, {
    name: payload.name,
  });

  return await apiRequest<NestResponse<AddMitraResponse>>(request);
}

export async function getListMitra({
  cursor,
  limit,
  search,
}: {
  limit?: number;
  cursor?: number;
  search?: string;
}) {
  const request = axios.get<never>(MANAGEMENT_MITRA_URL, {
    params: {
      limit,
      cursor,
      search: search && search?.trim().length > 0 ? search?.trim() : undefined,
    },
  });

  return await apiRequest<NestResponse<GetMitraResponse>>(request);
}

export async function editMitra({
  mitraId,
  payload,
}: {
  mitraId: number;
  payload: {
    name: string;
  };
}) {
  const request = axios.put<never>(`${MANAGEMENT_MITRA_URL}/${mitraId}`, {
    name: payload.name,
  });

  return await apiRequest<NestResponse<never>>(request);
}

export async function removeMitra(mitraId: number) {
  const request = axios.delete<never>(`${MANAGEMENT_MITRA_URL}/${mitraId}`);

  return await apiRequest<NestResponse<never>>(request);
}
