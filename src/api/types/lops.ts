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
  lopId: number;
  isForMitra: boolean;
  workType: string;
  inputAt: string; // DATE STRING
  ticket: {
    identifier: string;
    location: string | null;
  };
  sto: {
    id: number;
    name: string;
  };
  mitra: {
    id: number;
    name: string;
  };
};

export type LopActivityForm = {
  lopId: number;
  mitraId: number;
  stoId: number;
  ticketLocation: string | null;
  ticketIdentifier: string;
  workType: string;
  isForMitra: boolean;
  inputDate: Date;
  inputTime: string;
};

export type ListLopsResponse = Lop[];
