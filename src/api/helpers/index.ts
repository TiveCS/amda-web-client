import { NestErrorResponse } from "@api/types/common";
import axios, { AxiosResponse } from "axios";
import { ApiResponse } from "..";

export async function apiRequest<T>(
  request: Promise<AxiosResponse<ApiResponse>>
): Promise<T> {
  try {
    const response = await request;
    return response.data as T;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData: NestErrorResponse = error.response
        ?.data as unknown as NestErrorResponse;
      throw new Error(errData.message);
    }
    throw error;
  }
}
