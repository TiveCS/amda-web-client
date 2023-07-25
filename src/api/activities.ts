import axios from "axios";
import { LOPS_ACTIVITIES_URL } from "./routes";
import { apiRequest } from "./helpers";
import { NestResponse } from "./types/common";

export async function removeActivity(activityId: number) {
  const request = axios.delete<never>(`${LOPS_ACTIVITIES_URL}/${activityId}`);

  return apiRequest<NestResponse<unknown>>(request);
}

export async function addActivity(payload: {
  lopId: number;
  stoId: number;
  ticketIdentifier: string;
  ticketLocation?: string;
  inputAt: Date;
  isForMitra: boolean;
  workType: string;
  mitraId: number;
}) {
  const request = axios.post<never>(`${LOPS_ACTIVITIES_URL}`, {
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
    ticketLocation?: string;
    inputAt: Date;
    isForMitra: boolean;
    workType: string;
    mitraId: number;
  }
) {
  const request = axios.put<never>(`${LOPS_ACTIVITIES_URL}/${activityId}`, {
    ...payload,
    ticketLocation: payload.ticketLocation ? payload.ticketLocation : undefined,
  });

  return apiRequest<NestResponse<unknown>>(request);
}
