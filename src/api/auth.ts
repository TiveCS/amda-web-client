import axios from "axios";
import { AUTH_LOGIN_URL } from "./routes";
import { LoginResponse } from "./types";

async function login({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  return axios.post<LoginResponse>(AUTH_LOGIN_URL, {
    username,
    password,
  });
}

export { login };
