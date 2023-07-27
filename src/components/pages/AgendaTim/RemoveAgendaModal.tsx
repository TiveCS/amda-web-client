import { removeAgenda } from "@api/agenda";
import { AgendaResponsePayload } from "@api/types/agenda";
import ButtonAMDA from "@components/ButtonAMDA";
import { Flex, Modal, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface RemoveAgendaModalProps {
  isOpen: boolean;
  closeModal: () => void;
  agenda: AgendaResponsePayload | null;
  setRemoveAgenda: React.Dispatch<
    React.SetStateAction<AgendaResponsePayload | null>
  >;
}

export default function RemoveAgendaModal({
  isOpen,
  closeModal,
  agenda,
  setRemoveAgenda,
}: RemoveAgendaModalProps) {
  const queryClient = useQueryClient();
  const removeAgendaMutation = useMutation({
    mutationFn: async () => {
      if (agenda === null) return;
      return removeAgenda(agenda.id);
    },
    onMutate: () => {
      showNotification({
        title: "Loading",
        message: "Sedang menghapus agenda...",
        color: "blue",
      });
    },
    onError: (error) => {
      if (error instanceof Error) {
        showNotification({
          title: "Error",
          message: error.message ?? "Gagal menghapus agenda",
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
      await queryClient.invalidateQueries(["agenda"]);
      showNotification({
        title: "Success",
        message: "Agenda berhasil dihapus",
        color: "green",
      });
      closeModal();
    },
  });

  const handleRemoveAgenda = () => {
    if (agenda === null) {
      showNotification({
        title: "Error",
        message: "Agenda tidak dipilih!",
        color: "red",
      });
      return;
    }

    removeAgendaMutation.mutate();
  };

  return (
    <Modal
      opened={isOpen}
      onClose={() => {
        setRemoveAgenda(null);
        closeModal();
      }}
      title={"Hapus Agenda?"}
      padding={"xl"}
      size={"md"}
      centered
    >
      <Text>Apakah anda yakin ingin menghapus agenda</Text>
      <Text mb={32} className="font-semibold">
        "{agenda?.title}"
      </Text>

      <Flex direction={"row-reverse"} gap={32}>
        <ButtonAMDA
          variant="filled"
          color="red"
          onClick={handleRemoveAgenda}
          loading={removeAgendaMutation.isLoading}
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
