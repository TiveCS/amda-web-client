import { getListMitra } from "@api/mitra";
import { getListRole } from "@api/role";
import { UserResponsePayload } from "@api/types/users";
import { Flex, Tooltip } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useProfileStore } from "@zustand/profileStore";

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
  const profile = useProfileStore();
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

  const isSameUser = profile.profile?.id === user.id;

  return (
    <tr>
      <td>{role !== undefined ? role[0].label : "??"}</td>
      <td>{user.username}</td>
      <td>{user.name}</td>
      <td>{mitra !== undefined ? mitra[0].label : "??"}</td>
      <td className="w-40">
        <Flex gap="xl" justify="center" align="center" direction="row">
          <Tooltip label={"Edit User"}>
            <IconEdit
              onClick={() => {
                setEditUser(user);
                editUserForm.setValues({
                  name: user.name,
                  mitraId: user.mitraId,
                  roleId: user.roleId,
                });
                openEditUserModal();
              }}
              className="w-5 h-5 group-hover:text-sky-800 hover:cursor-pointer"
            />
          </Tooltip>
          <Tooltip label={"Remove User"}>
            <IconTrash
              color={isSameUser ? "gray" : "black"}
              onClick={() => {
                if (isSameUser) return;

                setRemoveUser(user);
                openRemoveUserModal();
              }}
              className={`w-5 h-5 group-hover:text-sky-800 ${
                isSameUser ? "hover:cursor-not-allowed" : "hover:cursor-pointer"
              }`}
            />
          </Tooltip>
        </Flex>
      </td>
    </tr>
  );
}
