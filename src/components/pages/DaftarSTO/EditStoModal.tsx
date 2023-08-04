import { editSto } from "@api/sto";
import { StoResponsePayload } from "@api/types/sto";
import ButtonAMDA from "@components/ButtonAMDA";
import { Flex, Modal, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface EditStoModalProps {
  sto: StoResponsePayload | null;
  setSto: (sto: StoResponsePayload | null) => void;
  isOpen: boolean;
  closeModal: () => void;
  editForm: UseFormReturnType<
    {
      nama: string;
    },
    (values: { nama: string }) => {
      nama: string;
    }
  >;
}

export default function EditStoModal({
  sto,
  setSto,
  editForm,
  isOpen,
  closeModal,
}: EditStoModalProps) {
  const queryClient = useQueryClient();
  const editStoMutation = useMutation({
    mutationFn: async () => {
      if (sto === null) return;

      return await editSto({
        stoId: sto.id,
        payload: { name: editForm.values.nama },
      });
    },
    onMutate: () => {
      showNotification({
        title: "Loading",
        message: "Sedang mengedit STO...",
        color: "blue",
      });
    },
    onSuccess: async (data) => {
      if (data === undefined) return;

      await queryClient.invalidateQueries(["sto"]);
      showNotification({
        title: "Success",
        message: "STO berhasil diedit!",
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
        message: error.message ?? "Gagal mengubah data STO!",
        color: "red",
      });
    },
  });

  const handleEditSto = () => {
    if (sto === null) {
      showNotification({
        title: "Error",
        message: "Tidak memilih STO untuk diedit!",
        color: "red",
      });
      return;
    }

    if (editForm.validate().hasErrors) {
      return;
    }

    editStoMutation.mutate();
  };

  return (
    <Modal
      onClose={() => {
        setSto(null);
        closeModal();
      }}
      opened={isOpen}
      title="Edit STO"
      padding={"xl"}
    >
      <Flex direction={"column"} gap={"md"}>
        <TextInput label="Nama STO" {...editForm.getInputProps("nama")} />

        <ButtonAMDA onClick={handleEditSto}>Simpan</ButtonAMDA>
      </Flex>
    </Modal>
  );
}
