import axios from "axios";
import { MANAGEMENT_USERS_URL } from "./routes";
import { apiRequest } from "./helpers";
import { NestResponse } from "./types/common";
import {
  AddUserPayload,
  AddUserResponse,
  GetUserResponse,
} from "./types/users";

export async function addUser(payload: AddUserPayload) {
  const request = axios.post<never>(MANAGEMENT_USERS_URL, {
    roleId: payload.roleId,
    username: payload.username,
    name: payload.name,
    mitraId: payload.mitraId,
    password: payload.password, 
  });

  console.log(payload);

  return await apiRequest<NestResponse<AddUserResponse>>(request);
}

export async function getListUser({
  cursor,
  limit,
  page,
  search,
}: {
  page?: number;
  limit?: number;
  cursor?: number;
  search?: string;
}) {
  const request = axios.get<never>(MANAGEMENT_USERS_URL, {
    params: {
      page: page || 1,
      limit: limit? limit:undefined,
      cursor: cursor? cursor:undefined,
      search: search? search:undefined,
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
  };
}) {
  const request = axios.put<never>(`${MANAGEMENT_USERS_URL}/${userId}`, {
    name: payload.name,
    roleId: payload.roleId,
    mitraId: payload.mitraId,
  });

  return await apiRequest<NestResponse<never>>(request);
}

export async function removeUser(userId: number) {
  const request = axios.delete<never>(`${MANAGEMENT_USERS_URL}/${userId}`);

  return await apiRequest<NestResponse<never>>(request);
}
