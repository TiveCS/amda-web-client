import { removeSto } from "@api/sto";
import { StoResponsePayload } from "@api/types/sto";
import ButtonAMDA from "@components/ButtonAMDA";
import { Flex, Modal, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface RemoveStoModalProps {
  isOpen: boolean;
  closeModal: () => void;
  sto: StoResponsePayload | null;
  setRemoveSto: React.Dispatch<React.SetStateAction<StoResponsePayload | null>>;
}

export default function RemoveStoModal({
  isOpen,
  closeModal,
  sto,
  setRemoveSto,
}: RemoveStoModalProps) {
  const queryClient = useQueryClient();
  const removeStoMutation = useMutation({
    mutationFn: async () => {
      if (sto === null) return;
      return removeSto(sto.id);
    },
    onMutate: () => {
      showNotification({
        title: "Loading",
        message: "Sedang menghapus STO...",
        color: "blue",
      });
    },
    onError: (error) => {
      if (error instanceof Error) {
        showNotification({
          title: "Error",
          message: error.message ?? "Gagal menghapus STO",
          color: "red",
          icon: <IconX />,
        });
        return;
      }

      showNotification({
        title: "Error",
        message: "Terjadi kesalahan internal",
        color: "red",
        icon: <IconX />,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["sto"]);
      showNotification({
        title: "Success",
        message: "STO berhasil dihapus",
        color: "green",
        icon: <IconCheck />,
      });
      closeModal();
    },
  });

  const handleRemoveSto = () => {
    if (sto === null) {
      showNotification({
        title: "Error",
        message: "STO tidak dipilih!",
        color: "red",
      });
      return;
    }

    removeStoMutation.mutate();
  };

  return (
    <Modal
      opened={isOpen}
      onClose={() => {
        setRemoveSto(null);
        closeModal();
      }}
      title={"Hapus STO?"}
      padding={"xl"}
      size={"md"}
      centered
    >
      <Text>Apakah anda yakin ingin menghapus STO</Text>
      <Text mb={32} className="font-semibold">
        "{sto?.name}"{" "}
        <Text span className="font-normal">
          {" "}
          beserta{" "}
          <Text span className="font-medium">
            {sto?._count.activities}
          </Text>{" "}
          kegiatan?
        </Text>
      </Text>

      <Flex direction={"row-reverse"} gap={32}>
        <ButtonAMDA
          variant="filled"
          color="red"
          onClick={handleRemoveSto}
          loading={removeStoMutation.isLoading}
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
