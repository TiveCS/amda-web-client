import { addSto } from "@api/sto";
import ButtonAMDA from "@components/ButtonAMDA";
import { Flex, Modal, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AddMitraStoProps {
  isOpen: boolean;
  closeModal: () => void;
}

export default function AddStoModal({ closeModal, isOpen }: AddMitraStoProps) {
  //   const [isOpen, { open: openModal, close: closeModal }] = useDisclosure(false);

  const addStoForm = useForm({
    initialValues: {
      name: "",
    },
    validate: {
      name: (value) =>
        value.trim().length > 0 ? null : "Nama mitra wajib diisi",
    },
  });

  const queryClient = useQueryClient();
  const addStoMutation = useMutation({
    mutationFn: async () => addSto(addStoForm.values),
    onSuccess: async () => {
      addStoForm.reset();
      closeModal();
      await queryClient.invalidateQueries(["sto"]);

      showNotification({
        title: "Success",
        message: "STO berhasil ditambahkan",
        color: "green",
      });
    },
    onError: (error) => {
      if (error instanceof Error) {
        showNotification({
          title: "Error",
          message: error.message ?? "Gagal menambahkan STO",
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
        message: "Sedang menambahkan STO...",
        color: "blue",
      });
    },
  });

  const handleAddSto = () => {
    if (addStoForm.validate().hasErrors) return;
    addStoMutation.mutate();
  };

  return (
    <Modal opened={isOpen} onClose={closeModal} title="Add STO" padding={"xl"}>
      <Flex direction={"column"} gap={24}>
        <TextInput
          withAsterisk
          label="Nama STO"
          placeholder="Contoh: Gladak"
          {...addStoForm.getInputProps("name")}
        />

        <ButtonAMDA
          type="button"
          loading={addStoMutation.isLoading}
          onClick={handleAddSto}
        >
          Tambah
        </ButtonAMDA>
      </Flex>
    </Modal>
  );
}
