export type RoleResponsePayload = {
  id: number;
  name: string;
  slug: string;
};

export type GetRoleResponse = RoleResponsePayload[];

export interface RoleSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}
