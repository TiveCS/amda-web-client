export * from "./auth";

export type ApiResponse = {
  data: {
    [key: string]: unknown;
  };
};
