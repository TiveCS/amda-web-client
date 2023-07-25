import { editUser } from "@api/users";
import { UserResponsePayload } from "@api/types/users";
import ButtonAMDA from "@components/ButtonAMDA";
import { Flex, Modal, Select, TextInput } from "@mantine/core";
import { UseFormReturnType, useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { RoleSelectOption } from "@api/types/role";
import { MitraSelectOption } from "@api/types/mitra";
import { getListMitra } from "@api/mitra";
import { getListRole } from "@api/role";

interface EditUserModalProps {
  user: UserResponsePayload | null;
  setUser: (user: UserResponsePayload | null) => void;
  isOpen: boolean;
  closeModal: () => void;
  editForm: UseFormReturnType<
    {
      name: string;
      mitraId: number;
      roleId: number;
    },
    (values: { name: string; mitraId: number; roleId: number }) => {
      name: string;
      mitraId: number;
      roleId: number;
    }
  >;
}

export default function EditUserModal({
  user,
  setUser,
  editForm,
  isOpen,
  closeModal,
}: EditUserModalProps) {
  const queryClient = useQueryClient();
  const editUserMutation = useMutation({
    mutationFn: async () => {
      if (user === null) return;

      return await editUser({
        userId: user.id,
        payload: {
          name: editForm.values.name,
          roleId: editForm.values.roleId,
          mitraId: editForm.values.mitraId,
        },
      });
    },
    onMutate: () => {
      showNotification({
        title: "Loading",
        message: "Sedang mengedit user...",
        color: "blue",
      });
    },
    onSuccess: async (data) => {
      if (data === undefined) return;

      await queryClient.invalidateQueries(["user"]);
      showNotification({
        title: "Success",
        message: "User berhasil diedit!",
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
        message: error.message ?? "Gagal mengubah data user!",
        color: "red",
      });
    },
  });

  const handleEditUser = () => {
    if (user === null) {
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

    editUserMutation.mutate();
  };

  const searchForm = useForm({
    initialValues: {
      search: "",
    },
  });
  const [searchDebounced] = useDebouncedValue(searchForm.values.search, 500);

  //Role
  const getListRoleQuery = useQuery({
    queryKey: ["role"],
    queryFn: async () => getListRole(),
  });

  useEffect(() => {
    void getListRoleQuery.refetch();
  }, [searchDebounced, getListRoleQuery]);

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

  // Option
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
    <Modal
      onClose={() => {
        setUser(null);
        closeModal();
      }}
      opened={isOpen}
      title="Edit User"
      padding={"xl"}
    >
      <Flex direction={"column"} gap={"md"}>
        <Select
          label="Role"
          searchable
          nothingFound="No options"
          data={selectOptionsRole}
          {...editForm.getInputProps("roleId")}
          defaultValue={user?.roleId.toString()}
        />
        <TextInput readOnly label="Username" value={user?.username} />
        <TextInput label="Nama" {...editForm.getInputProps("name")} />
        <Select
          label="Mitra"
          searchable
          nothingFound="No options"
          data={selectOptionsMitra}
          {...editForm.getInputProps("mitraId")}
          defaultValue={user?.mitraId.toString()}
        />

        <ButtonAMDA onClick={handleEditUser}>Simpan</ButtonAMDA>
      </Flex>
    </Modal>
  );
}
