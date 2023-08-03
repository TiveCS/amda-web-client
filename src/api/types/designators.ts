export type Designator = {
  id: number;
  name: string;
  workDescription: string;
  isMaterial: boolean;
  pricePerUnit: number;
  unit: string;
};

export type DesignatorForLop = {
  id: number;
  name: string;
};

export type DesignatorWithCount = Designator & {
  _count: {
    volumes: number;
  };
};

export type DesignatorFormData = {
  name: string;
  workDescription: string;
  isMaterial: boolean;
  pricePerUnit: number;
  unit: string;
};

export type DesignatorPreviewImportData = {
  designator: string;
  workDescription: string;
  unit: string;
  isMaterial: boolean;
  pricePerUnit: number;
};

export type GetListDesignatorResponse = DesignatorWithCount[];

export type PostImportDesignatorPreviewResponse = DesignatorPreviewImportData[];

export type PostImportDesignatorFullImportResponse = { jobId: string };

export type GetImportDesignatorFullImportStatusResponse = {
  processedOn?: number;
  finishedOn?: number;
  failedReason?: string;
  attemptsMade?: number;
};
