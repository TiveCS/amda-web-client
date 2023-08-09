import { removeLop } from "@api/lops";
import { Lop } from "@api/types/lops";
import ButtonAMDA from "@components/ButtonAMDA";
import { Flex, Modal, Text } from "@mantine/core";
import { notifications, showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface RemoveLopModalProps {
  isOpen: boolean;
  closeModal: () => void;
  removeLop: Lop | null;
  setRemoveLop: React.Dispatch<React.SetStateAction<Lop | null>>;
}

export default function RemoveLopModal(props: RemoveLopModalProps) {
  const notificationId = `remove-lops-notification-${props.removeLop?.id ?? 0}`;

  const queryClient = useQueryClient();
  const removeLopMutation = useMutation({
    mutationFn: async () => {
      if (!props.removeLop) {
        showNotification({
          title: "Error",
          message: "Tidak ada Segment yang dipilih",
          color: "red",
        });
        return Promise.reject();
      }

      return removeLop({ lopId: props.removeLop.id });
    },
    onMutate: () => {
      notifications.show({
        id: notificationId,
        title: "Loading",
        message: "Sedang menghapus Segment...",
        color: "blue",
        loading: true,
        withCloseButton: false,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["lops"]);

      notifications.update({
        id: notificationId,
        title: "Success",
        message: "Berhasil menghapus Segment",
        color: "green",
        loading: false,
        autoClose: 3000,
        icon: <IconCheck />,
      });

      props.closeModal();
      props.setRemoveLop(null);
    },
    onError: (error) => {
      if (error instanceof Error) {
        notifications.update({
          id: notificationId,
          title: "Error",
          message: error.message ?? "Gagal menghapus Segment",
          color: "red",
          loading: false,
          autoClose: 3000,
          icon: <IconX />,
        });
        return;
      }

      notifications.update({
        id: notificationId,
        title: "Error",
        message: "Terjadi kesalahan internal",
        color: "red",
        loading: false,
        autoClose: 3000,
        icon: <IconX />,
      });
    },
  });

  return (
    <Modal
      opened={props.isOpen}
      onClose={props.closeModal}
      title="Hapus Segment?"
      centered
    >
      <Text>Apakah anda ingin menghapus Segment</Text>
      <Text>
        <span className="font-medium">"{props.removeLop?.name}"</span>
      </Text>

      <Flex gap={16} justify={"flex-end"} className="mt-8">
        <ButtonAMDA variant="white" onClick={props.closeModal}>
          Batal
        </ButtonAMDA>
        <ButtonAMDA color="red" onClick={removeLopMutation.mutate}>
          Hapus
        </ButtonAMDA>
      </Flex>
    </Modal>
  );
}
