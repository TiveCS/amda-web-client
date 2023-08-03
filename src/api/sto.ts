import axios from "axios";
import { STO_URL } from "./routes";
import { apiRequest } from "./helpers";
import { NestResponse } from "./types/common";
import { GetListStoResponse } from "./types/sto";

export async function getListSto(payload: { take?: number; search?: string }) {
  const request = axios.get<never>(STO_URL, {
    params: {
      take: payload.take ?? undefined,
      search: payload.search ?? undefined,
    },
  });

  return apiRequest<NestResponse<GetListStoResponse>>(request);
}

export async function addSto(payload: { name: string }) {
  const request = axios.post<never>(STO_URL, {
    name: payload.name,
  });

  return apiRequest<NestResponse<{id: number, name: string}>>(request);
}

export async function editSto(
  stoId: number,
  payload: {
    name: string;
  }
) {
  const request = axios.put<never>(`${STO_URL}/${stoId}`, {
    name: payload.name,
  });

  return apiRequest<NestResponse<unknown>>(request);
}

export async function removeSto(stoId: number) {
  const request = axios.delete<never>(`${STO_URL}/${stoId}`);

  return apiRequest<NestResponse<unknown>>(request);
}
