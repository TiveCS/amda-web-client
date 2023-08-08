import { apiRequest, axiosAuthedApi } from "./helpers";
import { LOPS_URL } from "./routes";
import { ActivitiesWorkType } from "./types/activities";
import { NestResponse } from "./types/common";
import { ListLopsResponse } from "./types/lops";

export async function getLops({
  cursor,
  take,
  search,
  lopOnly = false,
  filter,
}: {
  cursor?: number;
  take?: number;
  search?: string;
  lopOnly?: boolean;
  filter?: {
    stoIds?: number[];
    mitraIds?: number[];
    workType?: ActivitiesWorkType;
  };
}) {
  const request = axiosAuthedApi.get<never>(LOPS_URL, {
    params: {
      cursor: cursor ? cursor : undefined,
      take: take ? take : undefined,
      search: search ? search : undefined,
      lopOnly,
      stoIds: filter?.stoIds ? filter.stoIds : undefined,
      mitraIds: filter?.mitraIds ? filter.mitraIds : undefined,
      workType: filter?.workType ? filter.workType : undefined,
    },
  });

  return apiRequest<NestResponse<ListLopsResponse>>(request);
}

export async function addLop({ name }: { name: string }) {
  const request = axiosAuthedApi.post<never>(LOPS_URL, {
    name,
  });

  return apiRequest<NestResponse<unknown>>(request);
}

export async function editLop(payload: { name: string; lopId: number }) {
  const request = axiosAuthedApi.put<never>(`${LOPS_URL}/${payload.lopId}`, {
    name: payload.name,
  });

  return apiRequest<NestResponse<unknown>>(request);
}

export async function removeLop(payload: { lopId: number }) {
  const request = axiosAuthedApi.delete<never>(`${LOPS_URL}/${payload.lopId}`);

  const result = await apiRequest<NestResponse<unknown>>(request);

  return result;
}
