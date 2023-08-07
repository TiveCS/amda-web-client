import { removeUser } from "@api/users";
import { UserResponsePayload } from "@api/types/users";
import ButtonAMDA from "@components/ButtonAMDA";
import { Flex, Modal, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface RemoveUserModalProps {
  isOpen: boolean;
  closeModal: () => void;
  user: UserResponsePayload | null;
  setRemoveUser: React.Dispatch<
    React.SetStateAction<UserResponsePayload | null>
  >;
}

export default function RemoveUserModal({
  isOpen,
  closeModal,
  user,
  setRemoveUser,
}: RemoveUserModalProps) {
  const queryClient = useQueryClient();
  const removeUserMutation = useMutation({
    mutationFn: async () => {
      if (user === null) return;
      return removeUser(user.id);
    },
    onMutate: () => {
      showNotification({
        title: "Loading",
        message: "Sedang menghapus user...",
        color: "blue",
      });
    },
    onError: (error) => {
      if (error instanceof Error) {
        showNotification({
          title: "Error",
          message: error.message ?? "Gagal menghapus user",
          color: "red",
        });
        return;
      }

      showNotification({
        title: "Error",
        message: "Terjadi kesalahan internal",
        color: "red",
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["user"]);
      showNotification({
        title: "Success",
        message: "User berhasil dihapus",
        color: "green",
      });
      closeModal();
    },
  });

  const handleRemoveUser = () => {
    if (user === null) {
      showNotification({
        title: "Error",
        message: "User tidak dipilih!",
        color: "red",
      });
      return;
    }

    removeUserMutation.mutate();
  };

  return (
    <Modal
      opened={isOpen}
      onClose={() => {
        setRemoveUser(null);
        closeModal();
      }}
      title={"Hapus User?"}
      padding={"xl"}
      size={"md"}
      centered
    >
      <Text>Apakah anda yakin ingin menghapus user</Text>
      <Text mb={32} className="font-semibold">
        "{user?.name}"
      </Text>

      <Flex direction={"row-reverse"} gap={32}>
        <ButtonAMDA
          variant="filled"
          color="red"
          onClick={handleRemoveUser}
          loading={removeUserMutation.isLoading}
        >
          Hapus
        </ButtonAMDA>
        <ButtonAMDA onClick={closeModal} variant="white">
          Batal
        </ButtonAMDA>
      </Flex>
    </Modal>
  );
}
