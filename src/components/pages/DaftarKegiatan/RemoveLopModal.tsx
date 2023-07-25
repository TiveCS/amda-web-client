import { removeLop } from "@api/lops";
import { Lop } from "@api/types/lops";
import ButtonAMDA from "@components/ButtonAMDA";
import { Flex, Modal, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface RemoveLopModalProps {
  isOpen: boolean;
  closeModal: () => void;
  removeLop: Lop | null;
  setRemoveLop: React.Dispatch<React.SetStateAction<Lop | null>>;
}

export default function RemoveLopModal(props: RemoveLopModalProps) {
  const queryClient = useQueryClient();
  const removeLopMutation = useMutation({
    mutationFn: async () => {
      if (!props.removeLop) {
        showNotification({
          title: "Error",
          message: "Tidak ada LOP yang dipilih",
          color: "red",
        });
        return Promise.reject();
      }

      return removeLop({ lopId: props.removeLop.id });
    },
    onMutate: () => {
      showNotification({
        title: "Loading",
        message: "Sedang menghapus LOP...",
        color: "blue",
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["lops"]);
      showNotification({
        title: "Success",
        message: "Berhasil menghapus LOP",
        color: "green",
      });
      props.closeModal();
      props.setRemoveLop(null);
    },
    onError: (error) => {
      if (error instanceof Error) {
        showNotification({
          title: "Error",
          message: error.message ?? "Gagal menghapus LOP",
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
  });

  return (
    <Modal
      opened={props.isOpen}
      onClose={props.closeModal}
      title="Hapus LOP?"
      centered
    >
      <Text>Apakah anda ingin menghapus LOP</Text>
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
