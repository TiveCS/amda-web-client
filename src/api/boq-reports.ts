import { apiRequest, axiosAuthedApi } from "./helpers";
import { BOQ_REPORTS_URL } from "./routes";
import { GetBoqReportsResponse } from "./types/boq-reports";
import { NestResponse } from "./types/common";

export async function getBoqReport(payload: {
  stoId: number;
  lopId: number;
  ticketIdentifiers: string[];
}) {
  const request = axiosAuthedApi.post<never>(`${BOQ_REPORTS_URL}`, payload);

  const result = await apiRequest<NestResponse<GetBoqReportsResponse>>(request);

  return result.data.url;
}
