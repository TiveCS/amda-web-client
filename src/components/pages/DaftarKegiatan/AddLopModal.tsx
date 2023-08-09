import { addLop } from "@api/lops";
import ButtonAMDA from "@components/ButtonAMDA";
import { Flex, Modal, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AddLopModalProps {
  openedAddLOP: boolean;
  closeAddLOP: () => void;
}

export default function AddLopModal({
  closeAddLOP,
  openedAddLOP,
}: AddLopModalProps) {
  const queryClient = useQueryClient();
  const addLopForm = useForm({
    initialValues: {
      name: "",
    },
    validate: {
      name: (value) =>
        value.trim().length > 0 ? null : "Nama Segment tidak boleh kosong",
    },
  });

  const addLopMutation = useMutation({
    mutationFn: async () => {
      const name = addLopForm.values.name.trim();
      return await addLop({
        name,
      });
    },
    onMutate: () => {
      showNotification({
        title: "Loading",
        message: "Sedang menambahkan Segment...",
        color: "blue",
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["lops"]);
      showNotification({
        title: "Success",
        message: "Berhasil menambahkan Segment",
        color: "green",
      });
      closeAddLOP();
      addLopForm.reset();
    },
    onError: (error) => {
      addLopForm.reset();
      if (error instanceof Error) {
        showNotification({
          title: "Error",
          message: error.message ?? "Gagal menambahkan Segment",
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

  const handleAddLop = () => {
    if (addLopForm.validate().hasErrors) return;
    addLopMutation.mutate();
  };

  return (
    <Modal opened={openedAddLOP} onClose={closeAddLOP} title="Add Segment">
      <Flex direction={"column"} gap={24}>
        <Flex direction={"column"} gap={8}>
          <TextInput
            withAsterisk
            name="name"
            label="Nama Segment"
            placeholder="Nama Segment"
            onChange={(e) =>
              addLopForm.setFieldValue("name", e.currentTarget.value)
            }
            value={addLopForm.values.name}
            error={addLopForm.errors.name}
          />
        </Flex>
        <ButtonAMDA onClick={handleAddLop}>Tambah</ButtonAMDA>
      </Flex>
    </Modal>
  );
}
