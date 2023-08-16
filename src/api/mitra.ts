import { apiRequest, axiosAuthedApi } from "./helpers";
import { MANAGEMENT_MITRA_URL } from "./routes";
import { NestResponse } from "./types/common";
import {
  AddMitraPayload,
  AddMitraResponse,
  GetMitraResponse,
} from "./types/mitra";

export async function addMitra(payload: AddMitraPayload) {
  const request = axiosAuthedApi.post<never>(MANAGEMENT_MITRA_URL, {
    name: payload.name,
  });

  return await apiRequest<NestResponse<AddMitraResponse>>(request);
}

export async function getListMitra({
  cursor,
  limit,
  search,
  mitraId,
  countOnly,
}: {
  limit?: number;
  cursor?: number;
  search?: string;
  mitraId?: number;
  countOnly?: boolean;
}) {
  const request = axiosAuthedApi.get<never>(MANAGEMENT_MITRA_URL, {
    params: {
      limit,
      cursor,
      search: search && search?.trim().length > 0 ? search?.trim() : undefined,
      mitraId: mitraId ?? undefined,
      countOnly: countOnly ?? undefined,
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
  const request = axiosAuthedApi.put<never>(
    `${MANAGEMENT_MITRA_URL}/${mitraId}`,
    {
      name: payload.name,
    }
  );

  return await apiRequest<NestResponse<never>>(request);
}

export async function removeMitra(mitraId: number) {
  const request = axiosAuthedApi.delete<never>(
    `${MANAGEMENT_MITRA_URL}/${mitraId}`
  );

  return await apiRequest<NestResponse<never>>(request);
}
