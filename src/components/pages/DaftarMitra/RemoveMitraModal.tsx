import { removeMitra } from "@api/mitra";
import { MitraResponsePayload } from "@api/types/mitra";
import ButtonAMDA from "@components/ButtonAMDA";
import { Flex, Modal, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface RemoveMitraModalProps {
  isOpen: boolean;
  closeModal: () => void;
  mitra: MitraResponsePayload | null;
  setRemoveMitra: React.Dispatch<
    React.SetStateAction<MitraResponsePayload | null>
  >;
}

export default function RemoveMitraModal({
  isOpen,
  closeModal,
  mitra,
  setRemoveMitra,
}: RemoveMitraModalProps) {
  const queryClient = useQueryClient();
  const removeMitraMutation = useMutation({
    mutationFn: async () => {
      if (mitra === null) return;
      return removeMitra(mitra.id);
    },
    onMutate: () => {
      showNotification({
        title: "Loading",
        message: "Sedang menghapus mitra...",
        color: "blue",
      });
    },
    onError: (error) => {
      if (error instanceof Error) {
        showNotification({
          title: "Error",
          message: error.message ?? "Gagal menghapus mitra",
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
      await queryClient.invalidateQueries(["mitra"]);
      showNotification({
        title: "Success",
        message: "Mitra berhasil dihapus",
        color: "green",
      });
      closeModal();
    },
  });

  const handleRemoveMitra = () => {
    if (mitra === null) {
      showNotification({
        title: "Error",
        message: "Mitra tidak dipilih!",
        color: "red",
      });
      return;
    }

    removeMitraMutation.mutate();
  };

  return (
    <Modal
      opened={isOpen}
      onClose={() => {
        setRemoveMitra(null);
        closeModal();
      }}
      title={"Hapus Mitra?"}
      padding={"xl"}
      size={"md"}
      centered
    >
      <Text>Apakah anda yakin ingin menghapus mitra</Text>
      <Text span className="font-semibold">
        "{mitra?.name}"{" "}
      </Text>
      <Text span> beserta data </Text>
      <Text span className="font-semibold">
        {mitra?._count.users}
      </Text>
      <Text span> users dan </Text>
      <Text span className="font-medium">
        {mitra?._count.activities}
      </Text>
      <Text span> kegiatan?</Text>

      <Text my={"md"}>
        Anda tidak dapat mengembalikan data mitra yang telah dihapus
      </Text>

      <Flex direction={"row-reverse"} gap={32}>
        <ButtonAMDA
          variant="filled"
          color="red"
          onClick={handleRemoveMitra}
          loading={removeMitraMutation.isLoading}
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
