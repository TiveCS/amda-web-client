import { apiRequest, axiosAuthedApi } from "./helpers";
import { STO_URL } from "./routes";
import { NestResponse } from "./types/common";
import { AddStoPayload, AddStoResponse, GetStoResponse } from "./types/sto";

export async function addSto(payload: AddStoPayload) {
  const request = axiosAuthedApi.post<never>(STO_URL, {
    name: payload.name,
  });

  return apiRequest<NestResponse<AddStoResponse>>(request);
}

export async function getListSto(payload: {
  take?: number;
  search?: string;
  cursor?: number;
}) {
  const request = axiosAuthedApi.get<never>(STO_URL, {
    params: {
      take: payload.take ?? undefined,
      search: payload.search ?? undefined,
      cursor: payload.cursor ?? undefined,
    },
  });

  return apiRequest<NestResponse<GetStoResponse>>(request);
}

export async function editSto({
  stoId,
  payload,
}: {
  stoId: number;
  payload: {
    name: string;
  };
}) {
  const request = axiosAuthedApi.put<never>(`${STO_URL}/${stoId}`, {
    name: payload.name,
  });

  return apiRequest<NestResponse<never>>(request);
}

export async function removeSto(stoId: number) {
  const request = axiosAuthedApi.delete<never>(`${STO_URL}/${stoId}`);

  return apiRequest<NestResponse<unknown>>(request);
}
