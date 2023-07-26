export type LopVolume = {
  id: string;
  value: number;
  designator: {
    id: true;
    name: string;
  };
};

export type GetListVolumesOfTicketResponse = {
  id: number;
  identifier: string;
  volumes: LopVolume[];
};
