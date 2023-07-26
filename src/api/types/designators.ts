export type Designator = {
  id: number;
  name: string;
  workDescription: string;
  isMaterial: boolean;
  pricePerUnit: number;
  unit: string;
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

export type GetListDesignatorResponse = DesignatorWithCount[];
