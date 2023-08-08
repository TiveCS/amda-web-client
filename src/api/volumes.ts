import { apiRequest, axiosAuthedApi } from "./helpers";
import { LOPS_TICKETS_URL } from "./routes";
import { NestResponse } from "./types/common";
import {
  DeleteVolumeFromTicketResponse,
  GetListVolumesOfTicketResponse,
  PostAddVolumeToTicketResponse,
  PutUpdateVolumeFromTicketResponse,
} from "./types/volumes";

export async function addVolumeToTicket(
  ticketIdentifier: string,
  payload: {
    designatorId: number;
  }
) {
  const requset = axiosAuthedApi.post<never>(
    `${LOPS_TICKETS_URL}/${ticketIdentifier}/volumes`,
    {
      ...payload,
      value: 1,
    }
  );

  return await apiRequest<NestResponse<PostAddVolumeToTicketResponse>>(requset);
}

export async function updateVolume(
  ticketIdentifier: string,
  volumeId: number,
  payload: {
    value: number;
  }
) {
  const request = axiosAuthedApi.put<never>(
    `${LOPS_TICKETS_URL}/${ticketIdentifier}/volumes/${volumeId}`,
    payload
  );

  return await apiRequest<NestResponse<PutUpdateVolumeFromTicketResponse>>(
    request
  );
}

export async function deleteVolume(ticketIdentifier: string, volumeId: number) {
  const request = axiosAuthedApi.delete<never>(
    `${LOPS_TICKETS_URL}/${ticketIdentifier}/volumes/${volumeId}`
  );

  return await apiRequest<NestResponse<DeleteVolumeFromTicketResponse>>(
    request
  );
}

export async function getListVolumesOfTicket(ticketIdentifier: string) {
  const request = axiosAuthedApi.get<never>(
    `${LOPS_TICKETS_URL}/${ticketIdentifier}/volumes`
  );

  const response = await apiRequest<
    NestResponse<GetListVolumesOfTicketResponse>
  >(request);

  return response;
}
