import { getListMitra } from "@api/mitra";
import { getListRole } from "@api/role";
import { UserResponsePayload } from "@api/types/users";
import ButtonAMDA from "@components/ButtonAMDA";
import { Flex } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";

interface UserItemTableProps {
  user: UserResponsePayload;
  setRemoveUser: React.Dispatch<
    React.SetStateAction<UserResponsePayload | null>
  >;
  setEditUser: React.Dispatch<React.SetStateAction<UserResponsePayload | null>>;
  openRemoveUserModal: () => void;
  openEditUserModal: () => void;
  editUserForm: UseFormReturnType<
    {
      name: string;
      mitraId: number;
      roleId: number;
    },
    (values: { name: string; mitraId: number; roleId: number }) => {
      name: string;
      mitraId: number;
      roleId: number;
    }
  >;
}

export default function UserItemTable({
  user,
  setRemoveUser,
  setEditUser,
  editUserForm,
  openRemoveUserModal,
  openEditUserModal,
}: UserItemTableProps) {
  const getListRoleQuery = useQuery({
    queryKey: ["user_item_table_role"],
    queryFn: async () => {
      const result = await getListRole();

      return result.data.map((mitra) => ({
        value: mitra.id.toString(),
        label: mitra.name,
      }));
    },
  });

  const getListMitraQuery = useQuery({
    queryKey: ["user_item_table_mitra"],
    queryFn: async () => {
      const result = await getListMitra({
        limit: 30,
      });

      return result.data.map((mitra) => ({
        value: mitra.id.toString(),
        label: mitra.name,
      }));
    },
  });

  const role = getListRoleQuery.data?.filter(
    (r) => parseInt(r.value) === user.roleId
  );

  const mitra = getListMitraQuery.data?.filter(
    (r) => parseInt(r.value) === user.mitraId
  );

  return (
    <tr>
      <td>{role !== undefined ? role[0].label : "??"}</td>
      <td>{user.username}</td>
      <td>{user.name}</td>
      <td>{mitra !== undefined ? mitra[0].label : "??"}</td>
      <td className="w-40">
        <Flex direction={"row"} justify={"space-between"}>
          <ButtonAMDA
            variant="white"
            onClick={() => {
              setEditUser(user);
              editUserForm.setValues({
                name: user.name,
                mitraId: user.mitraId,
                roleId: user.roleId,
              });
              openEditUserModal();
            }}
          >
            <IconEdit></IconEdit>
          </ButtonAMDA>
          <ButtonAMDA
            variant="white"
            onClick={() => {
              setRemoveUser(user);
              openRemoveUserModal();
            }}
          >
            <IconTrash></IconTrash>
          </ButtonAMDA>
        </Flex>
      </td>
    </tr>
  );
}
