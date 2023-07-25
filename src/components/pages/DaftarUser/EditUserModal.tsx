import { editUser } from "@api/users";
import { UserResponsePayload } from "@api/types/users";
import ButtonAMDA from "@components/ButtonAMDA";
import { Flex, Modal, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface EditUserModalProps {
  user: UserResponsePayload | null;
  setUser: (user: UserResponsePayload | null) => void;
  isOpen: boolean;
  closeModal: () => void;
  editForm: UseFormReturnType<
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

export default function EditUserModal({
  user,
  setUser,
  editForm,
  isOpen,
  closeModal,
}: EditUserModalProps) {
  const queryClient = useQueryClient();
  const editUserMutation = useMutation({
    mutationFn: async () => {
      if (user === null) return;

      return await editUser({
        userId: user.id,
        payload: {
          name: editForm.values.name,
        },
      });
    },
    onMutate: () => {
      showNotification({
        title: "Loading",
        message: "Sedang mengedit user...",
        color: "blue",
      });
    },
    onSuccess: async (data) => {
      if (data === undefined) return;

      await queryClient.invalidateQueries(["user"]);
      showNotification({
        title: "Success",
        message: "User berhasil diedit!",
        color: "green",
      });
      closeModal();
    },
    onError: (error) => {
      if (error === undefined) return;
      if (!(error instanceof Error)) {
        showNotification({
          title: "Error",
          message: "Terjadi kesalahan pada server!",
          color: "red",
        });
        return;
      }

      showNotification({
        title: "Error",
        message: error.message ?? "Gagal mengubah data user!",
        color: "red",
      });
    },
  });

  const handleEditUser = () => {
    if (user === null) {
      showNotification({
        title: "Error",
        message: "Tidak memilih mitra untuk diedit!",
        color: "red",
      });
      return;
    }

    if (editForm.validate().hasErrors) {
      return;
    }

    editUserMutation.mutate();
  };

  return (
    <Modal
      onClose={() => {
        setUser(null);
        closeModal();
      }}
      opened={isOpen}
      title="Edit User"
      padding={"xl"}
    >
      <Flex direction={"column"} gap={"md"}>
        <TextInput label="Role" {...editForm.getInputProps("roleId")} />
        <TextInput disabled label="Username" value={user?.username} />
        <TextInput label="Nama" {...editForm.getInputProps("name")} />
        <TextInput label="Mitra" {...editForm.getInputProps("mitraId")} />

        <ButtonAMDA onClick={handleEditUser}>Simpan</ButtonAMDA>
      </Flex>
    </Modal>
  );
}
