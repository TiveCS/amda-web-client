import { apiRequest, axiosAuthedApi } from "./helpers";
import { LOPS_ACTIVITIES_URL } from "./routes";
import { NestResponse } from "./types/common";

export async function removeActivity(activityId: number) {
  const request = axiosAuthedApi.delete<never>(
    `${LOPS_ACTIVITIES_URL}/${activityId}`
  );

  return apiRequest<NestResponse<unknown>>(request);
}

export async function addActivity(payload: {
  lopId: number;
  stoId: number;
  ticketIdentifier: string;
  ticketLocation: string | null;
  inputAt: Date;
  isForMitra: boolean;
  workType: string;
  workDescription?: string;
  mitraId: number;
}) {
  const request = axiosAuthedApi.post<never>(`${LOPS_ACTIVITIES_URL}`, {
    ...payload,
    ticketLocation: payload.ticketLocation ? payload.ticketLocation : undefined,
  });

  return apiRequest<NestResponse<unknown>>(request);
}

export async function editActivity(
  activityId: number,
  payload: {
    lopId: number;
    stoId: number;
    ticketIdentifier: string;
    ticketLocation: string | null;
    inputAt: Date;
    isForMitra: boolean;
    workType: string;
    workDescription?: string;
    mitraId: number;
  }
) {
  const request = axiosAuthedApi.put<never>(
    `${LOPS_ACTIVITIES_URL}/${activityId}`,
    {
      ...payload,
      ticketLocation:
        payload.ticketLocation || payload.ticketIdentifier.trim().length > 0
          ? payload.ticketLocation?.trim()
          : undefined,
    }
  );

  return apiRequest<NestResponse<unknown>>(request);
}
