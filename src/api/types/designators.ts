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
  isMaterial: boolean;
  unit: string;
  pricePerUnit: number;
  workDescription: string;
};

export type DesignatorWithTicketVolumes = Designator & {
  volumes?: DesignatorTicketVolume[];
};

export type DesignatorFormData = {
  name: string;
  workDescription: string;
  isMaterial: boolean;
  pricePerUnit: number;
  unit: string;
};

export type DesignatorTicketVolume = {
  id: number;
  value: number;
};

export type DesignatorPreviewImportData = {
  designator: string;
  workDescription: string;
  unit: string;
  isMaterial: boolean;
  pricePerUnit: number;
};

export type GetListDesignatorResponse = DesignatorWithTicketVolumes[];

export type PostImportDesignatorPreviewResponse = DesignatorPreviewImportData[];

export type PostImportDesignatorFullImportResponse = { jobId: string };

export type GetImportDesignatorFullImportStatusResponse = {
  processedOn?: number;
  finishedOn?: number;
  failedReason?: string;
  attemptsMade?: number;
};
