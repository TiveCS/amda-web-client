import { editMitra } from "@api/mitra";
import { MitraResponsePayload } from "@api/types/mitra";
import ButtonAMDA from "@components/ButtonAMDA";
import { Flex, Modal, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface EditMitraModalProps {
  mitra: MitraResponsePayload | null;
  setMitra: (mitra: MitraResponsePayload | null) => void;
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

export default function EditMitraModal({
  mitra,
  setMitra,
  editForm,
  isOpen,
  closeModal,
}: EditMitraModalProps) {
  const queryClient = useQueryClient();
  const editMitraMutation = useMutation({
    mutationFn: async () => {
      if (mitra === null) return;

      return await editMitra({
        mitraId: mitra.id,
        payload: { name: editForm.values.nama },
      });
    },
    onMutate: () => {
      showNotification({
        title: "Loading",
        message: "Sedang mengedit mitra...",
        color: "blue",
      });
    },
    onSuccess: async (data) => {
      if (data === undefined) return;

      await queryClient.invalidateQueries(["mitra"]);
      showNotification({
        title: "Success",
        message: "Mitra berhasil diedit!",
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
        message: error.message ?? "Gagal mengubah data mitra!",
        color: "red",
      });
    },
  });

  const handleEditMitra = () => {
    if (mitra === null) {
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

    editMitraMutation.mutate();
  };

  return (
    <Modal
      onClose={() => {
        setMitra(null);
        closeModal();
      }}
      opened={isOpen}
      title="Edit Mitra"
      padding={"xl"}
    >
      <Flex direction={"column"} gap={"md"}>
        <TextInput label="Nama Mitra" {...editForm.getInputProps("nama")} />

        <ButtonAMDA onClick={handleEditMitra}>Simpan</ButtonAMDA>
      </Flex>
    </Modal>
  );
}
