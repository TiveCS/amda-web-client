import { addDesignator } from "@api/designators";
import { DesignatorFormData } from "@api/types/designators";
import { UseFormReturnType } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AddDesignatorFormProps {
  form: UseFormReturnType<DesignatorFormData>;
  closeModal: () => void;
}

export default function useAddDesignatorMutation({
  form,
  closeModal,
}: AddDesignatorFormProps) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return addDesignator(form.values);
    },
    onMutate: () => {
      showNotification({
        title: "Loading",
        message: "Sedang menambahkan designator baru...",
        color: "blue",
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["designators"]);
      showNotification({
        title: "Sukses",
        message: "Berhasil menambahkan designator baru",
        color: "green",
      });
      closeModal();
    },
    onError: (error) => {
      if (error instanceof Error) {
        showNotification({
          title: "Error",
          message: error.message ?? "Gagal menambahkan designator baru",
          color: "red",
        });
        return;
      }
      showNotification({
        title: "Error",
        message: "Terjadi kesalahan internal",
        color: "red",
      });
      throw error;
    },
  });
}
