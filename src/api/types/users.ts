export type UserResponsePayload = {
    id: number;
    username: string;
    name: string;
    roleId: number;
    mitraId: number;
  };
  
  export type GetUserResponse = UserResponsePayload[];
  
  export type AddUserPayload = {
    username: string;
    password: string;
    name: string;
    mitraId: number;
    roleId: number;
  };
  
  export type AddUserResponse = {
    id: number;
    username: string;
    name: string;
    roleId: number;
    mitraId: number;
  };
  