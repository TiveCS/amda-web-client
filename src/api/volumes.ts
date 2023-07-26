import axios from "axios";
import { apiRequest } from "./helpers";
import { LOPS_TICKETS_URL } from "./routes";
import { NestResponse } from "./types/common";
import { GetListVolumesOfTicketResponse } from "./types/volumes";

export async function addVolumeToTicket(
  ticketIdentifier: string,
  payload: {}
) {}

export async function updateVolumeOfTicket(
  ticketIdentifier: string,
  volumeId: string,
  payload: {}
) {}

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
