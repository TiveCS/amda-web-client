import axios from "axios";
import { AUTH_LOGIN_URL } from "./routes";
import { LoginResponse } from "./types";
import { apiRequest } from "./helpers";
import { NestResponse } from "./types/common";

async function login({
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

export { login };
