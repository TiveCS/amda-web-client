import { useForm } from "@mantine/form";

interface EditUserFormValues {
  mitraId?: number;
  roleId?: number;
}

export default function useUserEditForm({
  mitraId,
  roleId,
}: EditUserFormValues) {
  return useForm<{
    name: string;
    mitraId: number;
    roleId: number;
    password: string | undefined;
  }>({
    initialValues: {
      name: "",
      mitraId: mitraId ?? -1,
      roleId: roleId ?? -1,
      password: undefined,
    },
    validate: {
      name: (value) => (value.trim().length > 0 ? null : "Nama wajib diisi"),
      password: (value) =>
        value && value?.trim().length > 0
          ? "Password wajib diisi jika ingin ganti password"
          : null,
    },
    transformValues: (values) => {
      return {
        ...values,
        password:
          values.password && values.password?.trim().length > 0
            ? values.password
            : undefined,
      };
    },
  });
}
