import axios from "axios";
import { LOPS_URL } from "./routes";
import { apiRequest } from "./helpers";
import { ListLopsResponse } from "./types/lops";
import { NestResponse } from "./types/common";

export async function getLops({
  cursor,
  take,
  search,
}: {
  cursor?: number;
  take?: number;
  search?: string;
}) {
  const request = axios.get<never>(LOPS_URL, {
    params: {
      cursor: cursor ? cursor : undefined,
      take: take ? take : undefined,
      search: search ? search : undefined,
    },
  });

  return apiRequest<NestResponse<ListLopsResponse>>(request);
}

export async function addLop({ name }: { name: string }) {
  const request = axios.post<never>(LOPS_URL, {
    name,
  });

  return apiRequest<NestResponse<unknown>>(request);
}

export async function editLop(payload: { name: string; lopId: number }) {
  const request = axios.put<never>(`${LOPS_URL}/${payload.lopId}`, {
    name: payload.name,
  });

  return apiRequest<NestResponse<unknown>>(request);
}

export async function removeLop(payload: { lopId: number }) {
  const request = axios.delete<never>(`${LOPS_URL}/${payload.lopId}`);

  return apiRequest<NestResponse<unknown>>(request);
}
