import { addUser } from "@api/users";
import ButtonAMDA from "@components/ButtonAMDA";
import { Flex, Modal, PasswordInput, Select, TextInput } from "@mantine/core";
import { matches, useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebouncedValue } from "@mantine/hooks";
import { getListRole } from "@api/role";
import { getListMitra } from "@api/mitra";
import { useEffect, useState } from "react";
import { RoleSelectOption } from "@api/types/role";
import { MitraSelectOption } from "@api/types/mitra";

interface AddUserModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

export default function AddUserModal({
  closeModal,
  isOpen,
}: AddUserModalProps) {
  //   const [isOpen, { open: openModal, close: closeModal }] = useDisclosure(false);
  const searchForm = useForm({
    initialValues: {
      search: "",
    },
  });
  const [searchDebounced] = useDebouncedValue(searchForm.values.search, 500);

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

  //Role
  const getListRoleQuery = useQuery({
    queryKey: ["role"],
    queryFn: async () => getListRole(),
  });

  //Mitra
  const getListMitraQuery = useQuery({
    queryKey: ["mitra"],
    queryFn: async () =>
      getListMitra({
        search: searchDebounced,
      }),
  });

  useEffect(() => {
    void getListMitraQuery.refetch();
  }, [searchDebounced, getListMitraQuery]);

  useEffect(() => {
    void getListRoleQuery.refetch();
  }, [searchDebounced, getListRoleQuery]);

  // // Option
  // const [selectedOptionRole] = useState<RoleSelectOption | null>(null);
  // const [selectedOptionMitra] = useState<MitraSelectOption | null>(null);

  if (getListRoleQuery.isLoading) return <p>Loading...</p>;

  if (getListMitraQuery.isLoading) return <p>Loading...</p>;

  const selectOptionsRole: RoleSelectOption[] | undefined =
    getListRoleQuery.data?.data.map((role) => ({
      value: String(role.id),
      label: role.name,
    }));

  const selectOptionsMitra: MitraSelectOption[] | undefined =
    getListMitraQuery.data?.data.map((mitra) => ({
      value: String(mitra.id),
      label: mitra.name,
    }));

  if (selectOptionsRole === undefined) return <p>loading...</p>;
  if (selectOptionsMitra === undefined) return <p>loading...</p>;

  return (
    <Modal opened={isOpen} onClose={closeModal} title="Add User" padding={"xl"}>
      <Flex direction={"column"} gap={24}>
        <Select
          withAsterisk
          label="Role"
          placeholder="Select one"
          searchable
          nothingFound="No options"
          data={selectOptionsRole}
          onChange={(value) => {
            addUserForm.setFieldValue(
              "roleId",
              value !== null ? parseInt(value) : -1
            );
          }}
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
        <Select
          withAsterisk
          label="Mitra"
          placeholder="Select one"
          searchable
          nothingFound="No options"
          data={selectOptionsMitra}
          onChange={(value) => {
            addUserForm.setFieldValue(
              "mitraId",
              value !== null ? parseInt(value) : -1
            );
          }}
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
