import { RoleResponsePayload } from "@api/types/role";

interface RoleItemTableProps {
  role: RoleResponsePayload;
}

export default function RoleItemTable({ role }: RoleItemTableProps) {
  return (
    <tr>
      <td>{role.name}</td>
    </tr>
  );
}
