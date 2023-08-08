import { apiRequest, axiosAuthedApi } from "./helpers";
import { MANAGEMENT_ROLES_URL } from "./routes";
import { NestResponse } from "./types/common";
import { GetRoleResponse } from "./types/role";

export async function getListRole() {
  const request = axiosAuthedApi.get<never>(MANAGEMENT_ROLES_URL);

  return await apiRequest<NestResponse<GetRoleResponse>>(request);
}
