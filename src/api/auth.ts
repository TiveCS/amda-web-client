import { ProfileType } from "../types";
import { apiRequest, axiosAuthedApi, axiosGuestApi } from "./helpers";
import {
  AUTH_LOGIN_URL,
  AUTH_LOGOUT_URL,
  AUTH_PROFILE_URL,
  AUTH_REGISTER_URL,
} from "./routes";
import { LoginResponse } from "./types";
import { NestResponse } from "./types/common";

export async function login({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const request = axiosAuthedApi.post<LoginResponse>(AUTH_LOGIN_URL, {
    username,
    password,
  });

  return apiRequest<NestResponse<LoginResponse>>(request);
}

export async function register({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const request = axiosGuestApi.post<never>(AUTH_REGISTER_URL, {
    username,
    password,
  });

  return apiRequest<NestResponse<never>>(request);
}

export async function logout() {
  const request = axiosAuthedApi.delete<never>(AUTH_LOGOUT_URL);

  return apiRequest<NestResponse<never>>(request);
}

export async function getProfile() {
  const request = axiosAuthedApi.get<never>(AUTH_PROFILE_URL);

  return apiRequest<NestResponse<ProfileType>>(request);
}
