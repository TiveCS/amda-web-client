import axios from "axios";
import { MANAGEMENT_MITRA_URL } from "./routes";
import { apiRequest } from "./helpers";
import { NestResponse } from "./types/common";
import {
  AddMitraPayload,
  AddMitraResponse,
  GetMitraResponse,
} from "./types/mitra";

export async function addMitra(payload: AddMitraPayload) {
  const request = axios.post<never>(MANAGEMENT_MITRA_URL, {
    name: payload.name,
  });

  return await apiRequest<NestResponse<AddMitraResponse>>(request);
}

export async function getListMitra() {
  const request = axios.get<never>(MANAGEMENT_MITRA_URL);

  return await apiRequest<NestResponse<GetMitraResponse>>(request);
}
