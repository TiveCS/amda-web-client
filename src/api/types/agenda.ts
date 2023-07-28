export type AgendaResponsePayload = {
    id: number;
    title: string;
    basisOfAgenda: string;
    note?: string;
    time: Date;
    picId: number;
    evidenceId: number;
    pic: {
      id: number;
      name: string;
    };
    evidence: {
      id : number;
      evidenceKey: string | null;
    }
  };
  
  export type GetAgendaResponse = AgendaResponsePayload[];
  
  export type AddAgendaPayload = {
    title: string;
    basisOfAgenda: string;
    time: Date;
    note: string;
    picId: number;
  };
  
  export type AddAgendaResponse = {
    id: number;
  };
  