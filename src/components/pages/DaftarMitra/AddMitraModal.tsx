import { addMitra } from "@api/mitra";
import ButtonAMDA from "@components/ButtonAMDA";
import { Flex, Modal, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AddMitraModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

export default function AddMitraModal({
  closeModal,
  isOpen,
}: AddMitraModalProps) {
  //   const [isOpen, { open: openModal, close: closeModal }] = useDisclosure(false);

  const addMitraForm = useForm({
    initialValues: {
      name: "",
    },
    validate: {
      name: (value) =>
        value.trim().length > 0 ? null : "Nama mitra wajib diisi",
    },
  });

  const queryClient = useQueryClient();
  const addMitraMutation = useMutation({
    mutationFn: async () => addMitra(addMitraForm.values),
    onSuccess: async () => {
      addMitraForm.reset();
      closeModal();
      await queryClient.invalidateQueries(["mitra"]);

      showNotification({
        title: "Success",
        message: "Mitra berhasil ditambahkan",
        color: "green",
      });
    },
    onError: (error) => {
      if (error instanceof Error) {
        showNotification({
          title: "Error",
          message: error.message ?? "Gagal menambahkan mitra",
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
    onMutate: () => {
      showNotification({
        title: "Loading",
        message: "Sedang menambahkan mitra...",
        color: "blue",
      });
    },
  });

  const handleAddMitra = () => {
    if (addMitraForm.validate().hasErrors) return;
    addMitraMutation.mutate();
  };

  return (
    <Modal
      opened={isOpen}
      onClose={closeModal}
      title="Add Mitra"
      padding={"xl"}
    >
      <Flex direction={"column"} gap={24}>
        <TextInput
          withAsterisk
          label="Nama Mitra"
          placeholder="Contoh: Telkom Indonesia"
          {...addMitraForm.getInputProps("name")}
        />

        <ButtonAMDA
          type="button"
          loading={addMitraMutation.isLoading}
          onClick={handleAddMitra}
        >
          Tambah
        </ButtonAMDA>
      </Flex>
    </Modal>
  );
}
