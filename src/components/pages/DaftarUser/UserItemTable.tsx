import { UserResponsePayload } from "@api/types/users";
import ButtonAMDA from "@components/ButtonAMDA";
import { Flex } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconEdit, IconTrash } from "@tabler/icons-react";

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
  return (
    <tr>
      <td>{user.roleId}</td>
      <td>{user.username}</td>
      <td>{user.name}</td>
      <td>{user.mitraId}</td>
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
