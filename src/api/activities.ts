import axios from "axios";
import { apiRequest } from "./helpers";
import { LOPS_ACTIVITIES_URL, STO_URL } from "./routes";
import { NestResponse } from "./types/common";
import {
  ActivitiesWorkType,
  GetAllActivitiesResponse,
  GetAllActivitiesStoResponse,
  GetAllActivitiesMitraResponse
} from  "./types/activities"

export async function removeActivity(activityId: number) {
  const request = axios.delete<never>(`${LOPS_ACTIVITIES_URL}/${activityId}`);

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
    ticketLocation: string | null;
    inputAt: Date;
    isForMitra: boolean;
    workType: string;
    mitraId: number;
  }
) {
  const request = axios.put<never>(`${LOPS_ACTIVITIES_URL}/${activityId}`, {
    ...payload,
    ticketLocation:
      payload.ticketLocation || payload.ticketIdentifier.trim().length > 0
        ? payload.ticketLocation?.trim()
        : undefined,
  });

  return apiRequest<NestResponse<unknown>>(request);
}