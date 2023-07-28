import axios from "axios";
import { LOPS_TICKETS_URL } from "./routes";
import { apiRequest } from "./helpers";
import { GetAllTicketsResponse } from "./types/tickets";
import { NestResponse } from "./types/common";

export async function getListTickets({
  cursor,
  search,
  take,
}: {
  take?: number;
  cursor?: number;
  search?: string;
}) {
  const request = axios.get<never>(`${LOPS_TICKETS_URL}`, {
    params: {
      take: take ? take : undefined,
      cursor: cursor ? cursor : undefined,
      search: search && search.trim().length > 0 ? search.trim() : undefined,
    },
  });

  const result = await apiRequest<NestResponse<GetAllTicketsResponse>>(request);

  return result;
}
