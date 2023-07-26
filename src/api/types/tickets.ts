type LopDesignator = {
  id: number;
  name: string;
};

type LopVolume = {
  id: number;
  value: number;
  designator: LopDesignator;
};

export type LopTicket = {
  id: number;
  identifier: string;
  location: string;
  volumes: LopVolume[];
};

export type GetAllTicketsResponse = LopTicket[];
