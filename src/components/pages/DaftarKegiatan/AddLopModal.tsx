import { addLop } from "@api/lops";
import ButtonAMDA from "@components/ButtonAMDA";
import { Flex, Modal, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

interface AddLopModalProps {
  openedAddLOP: boolean;
  closeAddLOP: () => void;
}

export default function AddLopModal({
  closeAddLOP,
  openedAddLOP,
}: AddLopModalProps) {
  const notificationId = useMemo(() => Math.random().toString(), []);

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
      notifications.show({
        id: notificationId,
        title: "Loading",
        message: "Sedang menambahkan Segment...",
        color: "blue",
        loading: true,
        withCloseButton: false,
        autoClose: false,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["lops"]);

      notifications.update({
        id: notificationId,
        title: "Success",
        message: "Berhasil menambahkan Segment",
        color: "green",
        loading: false,
        autoClose: 3000,
        icon: <IconCheck />,
      });

      closeAddLOP();
      addLopForm.reset();
    },
    onError: (error) => {
      addLopForm.reset();
      if (error instanceof Error) {
        notifications.update({
          id: notificationId,
          title: "Error",
          message: error.message ?? "Gagal menambahkan Segment",
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
