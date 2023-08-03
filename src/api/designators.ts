import axios from "axios";
import { DESIGNATOR_URL } from "./routes";
import { apiRequest } from "./helpers";
import { NestResponse } from "./types/common";
import {
  Designator,
  DesignatorFormData,
  GetImportDesignatorFullImportStatusResponse,
  GetListDesignatorResponse,
  PostImportDesignatorFullImportResponse,
  PostImportDesignatorPreviewResponse,
} from "./types/designators";
import useImportDesignatorForm from "@hooks/useImportDesignatorForm";

export async function getListDesignator({
  cursor,
  search,
  take = 10,
}: {
  take?: number;
  cursor?: number;
  search?: string;
}) {
  const request = axios.get<never>(`${DESIGNATOR_URL}`, {
    params: {
      take: take ? take : undefined,
      cursor: cursor ? cursor : undefined,
      search: search && search.trim().length > 0 ? search.trim() : undefined,
    },
  });

  const result = await apiRequest<NestResponse<GetListDesignatorResponse>>(
    request
  );

  return result;
}

export async function addDesignator(payload: {
  name: string;
  unit: string;
  isMaterial: boolean;
  pricePerUnit: number;
  workDescription: string;
}) {
  const request = axios.post<never>(`${DESIGNATOR_URL}`, payload);

  const result = await apiRequest<NestResponse<Designator>>(request);

  return result;
}

export async function removeDesignatorById(designatorId: number) {
  const request = axios.delete<never>(`${DESIGNATOR_URL}/${designatorId}`);

  return apiRequest<NestResponse<unknown>>(request);
}

export async function editDesignator(
  designatorId: number,
  payload: DesignatorFormData
) {
  const request = axios.put<never>(
    `${DESIGNATOR_URL}/${designatorId}`,
    payload
  );

  return apiRequest<NestResponse<unknown>>(request);
}

export async function importDesignator(
  payload: ReturnType<typeof useImportDesignatorForm>["values"]
): Promise<
  | NestResponse<PostImportDesignatorPreviewResponse>
  | NestResponse<PostImportDesignatorFullImportResponse>
  | undefined
> {
  const {
    designatorHeaderAddress,
    file,
    firstValueRow,
    materialPriceHeaderAddress,
    mode,
    servicePriceHeaderAddress,
    unitHeaderAddress,
    workDescriptionHeaderAddress,
  } = payload;

  const request = axios.post<never>(
    `${DESIGNATOR_URL}/import`,
    {
      file,
      mode,
      firstValueRow,
      designatorHeaderAddress,
      unitHeaderAddress,
      workDescriptionHeaderAddress,
      materialPriceHeaderAddress,
      servicePriceHeaderAddress,
    },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  if (mode === "preview") {
    return apiRequest<NestResponse<PostImportDesignatorPreviewResponse>>(
      request
    );
  } else if (mode === "full_import") {
    return apiRequest<NestResponse<PostImportDesignatorFullImportResponse>>(
      request
    );
  }

  return undefined;
}

export async function getDesignatorImportStatus(jobId: string) {
  const request = axios.get<never>(`${DESIGNATOR_URL}/import/status`, {
    params: {
      jobId,
    },
  });

  return apiRequest<NestResponse<GetImportDesignatorFullImportStatusResponse>>(
    request
  );
}
