import { apiRequest, axiosAuthedApi } from "./helpers";
import { MANAGEMENT_USERS_URL } from "./routes";
import { NestResponse } from "./types/common";
import {
  AddUserPayload,
  AddUserResponse,
  GetUserCountsResponse,
  GetUserResponse,
} from "./types/users";

export async function addUser(payload: AddUserPayload) {
  const request = axiosAuthedApi.post<never>(MANAGEMENT_USERS_URL, {
    roleId: payload.roleId,
    username: payload.username,
    name: payload.name,
    mitraId: payload.mitraId,
    password: payload.password,
  });

  return await apiRequest<NestResponse<AddUserResponse>>(request);
}

export async function getUserCounts({ mitraId }: { mitraId?: number }) {
  const request = axiosAuthedApi.get<never>(MANAGEMENT_USERS_URL, {
    params: {
      mitraId: mitraId ?? undefined,
      countOnly: true,
    },
  });

  return await apiRequest<NestResponse<GetUserCountsResponse>>(request);
}

export async function getListUser({
  cursor,
  limit,
  search,
  mitraId,
  countOnly,
}: {
  limit?: number;
  cursor?: number;
  search?: string;
  mitraId?: number;
  countOnly?: boolean;
}) {
  const request = axiosAuthedApi.get<never>(MANAGEMENT_USERS_URL, {
    params: {
      limit: limit ?? undefined,
      cursor: cursor ?? undefined,
      search: search && search?.trim().length > 0 ? search?.trim() : undefined,
      mitraId: mitraId ?? undefined,
      countOnly: countOnly ?? undefined,
    },
  });

  return await apiRequest<NestResponse<GetUserResponse>>(request);
}

export async function editUser({
  userId,
  payload,
}: {
  userId: number;
  payload: {
    roleId: number;
    name: string;
    mitraId: number;
    newPassword: string | null;
  };
}) {
  const newPassword =
    payload.newPassword && payload.newPassword.trim().length > 0
      ? payload.newPassword.trim()
      : undefined;

  const request = axiosAuthedApi.put<never>(
    `${MANAGEMENT_USERS_URL}/${userId}`,
    {
      name: payload.name,
      roleId: payload.roleId,
      mitraId: payload.mitraId,
      newPassword: newPassword,
    }
  );

  return await apiRequest<NestResponse<never>>(request);
}

export async function removeUser(userId: number) {
  const request = axiosAuthedApi.delete<never>(
    `${MANAGEMENT_USERS_URL}/${userId}`
  );

  return await apiRequest<NestResponse<never>>(request);
}
