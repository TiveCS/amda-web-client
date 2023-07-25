export type Lop = {
  id: number;
  name: string;
  activities?: LopActivity[];
  _count: {
    activities: number;
  };
};

export type LopActivity = {
  id: number;
  isForMitra: boolean;
  workType: string;
  ticket: {
    identifier: string;
    location: string | null;
  };
  sto: {
    name: string;
  };
  mitra: {
    name: string;
  };
};

export type ListLopsResponse = Lop[];
