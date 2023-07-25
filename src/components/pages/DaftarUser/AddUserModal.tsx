import { addUser } from "@api/users";
import ButtonAMDA from "@components/ButtonAMDA";
import {
  Flex,
  Modal,
  NumberInput,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import { matches, useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AddUserModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

export default function AddUserModal({
  closeModal,
  isOpen,
}: AddUserModalProps) {
  //   const [isOpen, { open: openModal, close: closeModal }] = useDisclosure(false);

  const addUserForm = useForm({
    initialValues: {
      username: "",
      password: "",
      name: "",
      mitraId: -1,
      roleId: -1,
    },
    validate: {
      username: matches(
        /^[a-z0-9]+$/ || /^[a-z]+$/,
        "Harus terdiri dari huruf kecil /dan angka"
      ),
      name: (value) => (value.trim().length > 0 ? null : "Nama wajib diisi"),
    },
  });

  const queryClient = useQueryClient();
  const addUserMutation = useMutation({
    mutationFn: async () => addUser(addUserForm.values),
    onSuccess: async () => {
      addUserForm.reset();
      closeModal();
      await queryClient.invalidateQueries(["user"]);

      showNotification({
        title: "Success",
        message: "User berhasil ditambahkan",
        color: "green",
      });
    },
    onError: (error) => {
      if (error instanceof Error) {
        showNotification({
          title: "Error",
          message: error.message ?? "Gagal menambahkan user",
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
        message: "Sedang menambahkan user...",
        color: "blue",
      });
    },
  });

  const handleAddUser = () => {
    if (addUserForm.validate().hasErrors) return;
    addUserMutation.mutate();
  };

  return (
    <Modal opened={isOpen} onClose={closeModal} title="Add User" padding={"xl"}>
      <Flex direction={"column"} gap={24}>
        <NumberInput
          withAsterisk
          label="Role"
          placeholder="Contoh: 1"
          {...addUserForm.getInputProps("roleId")}
        />
        <TextInput
          withAsterisk
          label="Username"
          placeholder="Contoh: telkom atau telkom123"
          {...addUserForm.getInputProps("username")}
        />
        <TextInput
          withAsterisk
          label="Nama"
          placeholder=""
          {...addUserForm.getInputProps("name")}
        />
        <NumberInput
          withAsterisk
          label="Mitra"
          placeholder="Contoh: 1"
          {...addUserForm.getInputProps("mitraId")}
        />
        <PasswordInput
          withAsterisk
          label="Password"
          placeholder=""
          {...addUserForm.getInputProps("password")}
        />
        <ButtonAMDA
          type="button"
          loading={addUserMutation.isLoading}
          onClick={handleAddUser}
        >
          Tambah
        </ButtonAMDA>
      </Flex>
    </Modal>
  );
}
