import { isNotEmpty, useForm } from "@mantine/form";

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
    password: string;
  }>({
    initialValues: {
      name: "",
      mitraId: mitraId ?? -1,
      roleId: roleId ?? -1,
      password: "",
    },
    validate: {
      name: (value) => (value.trim().length > 0 ? null : "Nama wajib diisi"),
      password: (value) => {
        if (value) {
          const pass = value.trim();

          if (pass.length === 0)
            return "Password wajib diisi jika ingin ganti password";
          if (pass.length < 8) return "Password baru minimal 8 karakter";
        }
        return null;
      },
    },
  });
}
