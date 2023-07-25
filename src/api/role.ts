import axios from "axios";
import { MANAGEMENT_ROLES_URL } from "./routes";
import { apiRequest } from "./helpers";
import { NestResponse } from "./types/common";
import {
  GetRoleResponse,
} from "./types/role";

export async function getListRole() {
  const request = axios.get<never>(MANAGEMENT_ROLES_URL);

  return await apiRequest<NestResponse<GetRoleResponse>>(request);
}
