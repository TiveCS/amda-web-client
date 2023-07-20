export interface LoginResponse {
  message: string;
  data: {
    access_token: string;
  };
}

export interface LoginRequestResult {
  message: string;
  status: number;
}
