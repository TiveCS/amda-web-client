import axios from "axios";
import { ProfileType } from "../types";
import { apiRequest } from "./helpers";
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
  const request = axios.post<LoginResponse>(AUTH_LOGIN_URL, {
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
  const request = axios.post<never>(AUTH_REGISTER_URL, {
    username,
    password,
  });

  return apiRequest<NestResponse<never>>(request);
}

export async function logout() {
  const request = axios.delete<never>(AUTH_LOGOUT_URL, {
    withCredentials: true,
  });

  return apiRequest<NestResponse<never>>(request);
}

export async function getProfile() {
  const request = axios.get<never>(AUTH_PROFILE_URL, {
    withCredentials: true,
  });

  return apiRequest<NestResponse<ProfileType>>(request);
}
