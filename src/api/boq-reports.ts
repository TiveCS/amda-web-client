import axios from "axios";
import { BOQ_REPORTS_URL } from "./routes";
import { apiRequest } from "./helpers";
import { NestResponse } from "./types/common";
import { GetBoqReportsResponse } from "./types/boq-reports";

export async function getBoqReport(payload: {
  stoId: number;
  lopId: number;
  ticketIdentifiers: string[];
}) {
  const request = axios.post<never>(`${BOQ_REPORTS_URL}`, payload);

  const result = await apiRequest<NestResponse<GetBoqReportsResponse>>(request);

  return result.data.url;
}
