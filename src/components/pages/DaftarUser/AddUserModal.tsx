import { addUser } from "@api/users";
import ButtonAMDA from "@components/ButtonAMDA";
import { Flex, Modal, PasswordInput, Select, TextInput } from "@mantine/core";
import { matches, useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebouncedValue } from "@mantine/hooks";
import { getListRole } from "@api/role";
import { getListMitra } from "@api/mitra";
import { useEffect, useMemo, useState } from "react";
import { RoleSelectOption } from "@api/types/role";
import { MitraSelectOption } from "@api/types/mitra";
import { useProfileStore } from "@zustand/profileStore";
import { RoleType } from "../../../types";

interface AddUserModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

export default function AddUserModal({
  closeModal,
  isOpen,
}: AddUserModalProps) {
  const { profile } = useProfileStore();
  const role: RoleType = profile?.role.slug as unknown as RoleType;
  const isAdminMitra = useMemo(() => {
    return role === "admin-mitra";
  }, [role]);

  const [searchMitra] = useState("");
  const [searchMitraDebounced] = useDebouncedValue(searchMitra, 500);

  const addUserForm = useForm({
    initialValues: {
      username: "",
      password: "",
      name: "",
      mitraId: profile?.mitra.id ?? -1,
      roleId: profile?.role.id ?? -1,
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
    queryKey: ["add_user_modal_role"],
    queryFn: async () => {
      const result = await getListRole();

      return result.data.map((role) => ({
        value: role.id.toString(),
        label: role.name,
      }));
    },
  });

  //Mitra
  const getListMitraQuery = useQuery({
    queryKey: ["add_user_modal_mitra"],
    queryFn: async () => {
      const result = await getListMitra({
        search: searchMitraDebounced,
        limit: 30,
      });

      return result.data.map((mitra) => ({
        value: mitra.id.toString(),
        label: mitra.name,
      }));
    },
  });

  useEffect(() => {
    void getListMitraQuery.refetch();
  }, [getListMitraQuery, searchMitraDebounced]);

  if (getListRoleQuery.isLoading) return <p>Loading...</p>;

  if (getListMitraQuery.isLoading) return <p>Loading...</p>;

  const selectOptionsRole: RoleSelectOption[] | undefined =
    getListRoleQuery.data?.map((role) => ({
      value: String(role.value),
      label: role.label,
      disabled:
        profile?.role.slug !== "super-admin" && role.label === "Super Admin",
    }));

  const selectOptionsMitra: MitraSelectOption[] | undefined =
    getListMitraQuery.data?.map((mitra) => ({
      value: String(mitra.value),
      label: mitra.label,
    }));

  if (selectOptionsRole === undefined) return <p>loading...</p>;
  if (selectOptionsMitra === undefined) return <p>loading...</p>;

  return (
    <Modal opened={isOpen} onClose={closeModal} title="Add User" padding={"xl"}>
      <Flex direction={"column"} gap={24}>
        {!isAdminMitra && (
          <Select
            withAsterisk
            label="Role"
            placeholder="Select one"
            searchable
            nothingFound="No options"
            data={selectOptionsRole}
            readOnly={isAdminMitra}
            autoComplete="off"
            value={
              addUserForm.values.roleId !== -1
                ? addUserForm.values.roleId.toString()
                : undefined
            }
            onChange={(value) => {
              addUserForm.setFieldValue(
                "roleId",
                value !== null ? parseInt(value) : -1
              );
            }}
          />
        )}

        <TextInput
          withAsterisk
          label="Username"
          autoComplete="off"
          placeholder="Contoh: telkom atau telkom123"
          {...addUserForm.getInputProps("username")}
        />

        <TextInput
          withAsterisk
          label="Nama"
          placeholder="contoh: Ahmad Adi"
          autoComplete="off"
          {...addUserForm.getInputProps("name")}
        />

        {!isAdminMitra && (
          <Select
            withAsterisk
            label="Mitra"
            placeholder="Select one"
            searchable
            nothingFound="No options"
            autoComplete="off"
            data={selectOptionsMitra}
            readOnly={isAdminMitra}
            value={
              addUserForm.values.mitraId != -1
                ? addUserForm.values.mitraId.toString()
                : undefined
            }
            onChange={(value) => {
              addUserForm.setFieldValue(
                "mitraId",
                value !== null ? parseInt(value) : -1
              );
            }}
          />
        )}

        <PasswordInput
          withAsterisk
          label="Password"
          placeholder="Password akun ini"
          autoComplete="off"
          autoSave="off"
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
