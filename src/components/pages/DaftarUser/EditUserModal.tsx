import { getListMitra } from "@api/mitra";
import { getListRole } from "@api/role";
import { MitraSelectOption } from "@api/types/mitra";
import { RoleSelectOption } from "@api/types/role";
import { UserResponsePayload } from "@api/types/users";
import { editUser } from "@api/users";
import ButtonAMDA from "@components/ButtonAMDA";
import useUserEditForm from "@hooks/useUserEditForm";
import {
  Flex,
  List,
  LoadingOverlay,
  Modal,
  PasswordInput,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedValue } from "@mantine/hooks";
import { notifications, showNotification } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useProfileStore } from "@zustand/profileStore";
import { useEffect, useMemo } from "react";
import { RoleType } from "../../../types";
import { IconCheck, IconX } from "@tabler/icons-react";
import { getProfile } from "@api/auth";

interface EditUserModalProps {
  user: UserResponsePayload | null;
  setUser: (user: UserResponsePayload | null) => void;
  isOpen: boolean;
  closeModal: () => void;
  editForm: ReturnType<typeof useUserEditForm>;
}

export default function EditUserModal({
  user,
  setUser,
  editForm,
  isOpen,
  closeModal,
}: EditUserModalProps) {
  const notificationId = useMemo(() => Math.random().toString(), []);

  const { profile, setProfile } = useProfileStore();
  const role = profile?.role.slug as unknown as RoleType;
  const isAdminMitra = useMemo(() => {
    return role === "admin-mitra";
  }, [role]);

  const queryClient = useQueryClient();
  const editUserMutation = useMutation({
    mutationFn: async () => {
      if (user === null) return;

      const editResult = await editUser({
        userId: user.id,
        payload: {
          name: editForm.values.name,
          roleId: editForm.values.roleId,
          mitraId: editForm.values.mitraId,
          newPassword: editForm.values.password,
        },
      });

      if (profile?.id === user.id) {
        const updatedProfile = await getProfile();
        setProfile(updatedProfile.data);
      }

      return editResult;
    },
    onMutate: () => {
      notifications.show({
        id: notificationId,
        title: "Loading",
        message: "Sedang mengedit user...",
        color: "blue",
        loading: true,
        autoClose: false,
        withCloseButton: false,
      });
    },
    onSuccess: async (data) => {
      if (data === undefined) return;

      await queryClient.invalidateQueries(["user"]);

      notifications.update({
        id: notificationId,
        title: "Success",
        message: "User berhasil diedit!",
        color: "green",
        loading: false,
        autoClose: 3000,
        icon: <IconCheck />,
      });

      editForm.reset();
      closeModal();
    },
    onError: (error) => {
      if (error === undefined) return;
      if (!(error instanceof Error)) {
        notifications.update({
          id: notificationId,
          title: "Error",
          message: "Terjadi kesalahan internal!",
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
        message: error.message ?? "Gagal mengubah data user!",
        color: "red",
        loading: false,
        autoClose: 3000,
        icon: <IconX />,
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

    const validate = editForm.validate();

    if (validate.hasErrors) {
      showNotification({
        title: "Invalid",
        message: (
          <List>
            {Object.keys(validate.errors).map((key) => (
              <List.Item key={key}>
                <Text size={"sm"}>{validate.errors[key]}</Text>
              </List.Item>
            ))}
          </List>
        ),
        color: "red",
      });
      return;
    }

    editUserMutation.mutate();
  };

  const searchForm = useForm({
    initialValues: {
      search: "",
    },
  });

  const [searchMitraDebounced] = useDebouncedValue(
    searchForm.values.search,
    500
  );

  //Role
  const getListRoleQuery = useQuery({
    queryKey: ["edit_user_modal_role"],
    queryFn: async () => getListRole(),
  });

  //Mitra
  const getListMitraQuery = useQuery({
    queryKey: ["edit_user_modal_mitra"],
    queryFn: async () =>
      getListMitra({
        search: searchMitraDebounced,
        limit: 30,
      }),
  });

  const isFormDirty = useMemo(() => {
    return (
      editForm.isDirty("mitraId") ||
      editForm.isDirty("name") ||
      editForm.isDirty("roleId") ||
      editForm.isDirty("password")
    );
  }, [editForm]);

  useEffect(() => {
    void getListMitraQuery.refetch();
  }, [searchMitraDebounced, getListMitraQuery]);

  if (getListRoleQuery.isLoading) return <p>Loading...</p>;

  if (getListMitraQuery.isLoading) return <p>Loading...</p>;

  // Option
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
        editForm.reset();
        setUser(null);
        closeModal();
      }}
      opened={isOpen}
      title="Edit User"
      padding={"xl"}
    >
      <LoadingOverlay visible={editUserMutation.isLoading} />

      <Flex direction={"column"} gap={"md"}>
        {!isAdminMitra && (
          <Select
            label="Role"
            searchable
            nothingFound="No options"
            data={selectOptionsRole}
            disabled={isAdminMitra}
            value={
              editForm.values.roleId !== -1
                ? editForm.values.roleId.toString()
                : undefined
            }
            onChange={(value: string) =>
              editForm.setFieldValue("roleId", parseInt(value))
            }
          />
        )}

        <TextInput readOnly label="Username" value={user?.username} />

        <TextInput label="Nama" {...editForm.getInputProps("name")} />

        {!isAdminMitra && (
          <Select
            label="Mitra"
            searchable
            nothingFound="No options"
            data={selectOptionsMitra}
            disabled={isAdminMitra}
            value={
              editForm.values.mitraId
                ? editForm.values.mitraId.toString()
                : undefined
            }
            onChange={(value: string) =>
              editForm.setFieldValue("mitraId", parseInt(value))
            }
          />
        )}

        <PasswordInput
          label="Password"
          disabled={isAdminMitra && user?.mitraId !== profile?.mitra.id}
          value={editForm.values.password}
          onChange={(event) => {
            if (event.currentTarget.value.trim() === "") {
              editForm.setFieldValue("password", "");
              return;
            }
            editForm.setFieldValue("password", event.currentTarget.value);
          }}
        />

        <ButtonAMDA
          onClick={handleEditUser}
          loading={editUserMutation.isLoading}
          disabled={!isFormDirty}
        >
          Simpan
        </ButtonAMDA>
      </Flex>
    </Modal>
  );
}
