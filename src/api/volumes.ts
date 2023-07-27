import axios from "axios";
import { apiRequest } from "./helpers";
import { LOPS_TICKETS_URL } from "./routes";
import { NestResponse } from "./types/common";
import {
  GetAddVolumeToTicketResponse,
  GetListVolumesOfTicketResponse,
} from "./types/volumes";

export async function addVolumeToTicket(
  ticketIdentifier: string,
  payload: {
    designatorId: number;
  }
) {
  const requset = axios.post<never>(
    `${LOPS_TICKETS_URL}/${ticketIdentifier}/volumes`,
    {
      ...payload,
      value: 1,
    }
  );

  return await apiRequest<NestResponse<GetAddVolumeToTicketResponse>>(requset);
}

export async function updateVolume(
  volumeId: string,
  payload: {
    designatorId: number;
    value: number;
  }
) {}

export async function deleteVolume(designatorId: number, volumeId: string) {
  const request = axios.delete<never>(
    `${LOPS_TICKETS_URL}/${designatorId}/volumes/${volumeId}`
  );

  return await apiRequest<NestResponse<never>>(request);
}

export async function getListVolumesOfTicket(ticketIdentifier: string) {
  const request = axios.get<never>(
    `${LOPS_TICKETS_URL}/${ticketIdentifier}/volumes`
  );

  const response = await apiRequest<
    NestResponse<GetListVolumesOfTicketResponse>
  >(request);

  console.log(response);

  return response;
}
