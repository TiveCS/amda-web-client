import { editDesignator } from "@api/designators";
import { Designator, DesignatorFormData } from "@api/types/designators";
import { UseFormReturnType } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface EditDesignatorFormProps {
  form: UseFormReturnType<DesignatorFormData>;
  selectedDesignator: Designator | null;
  setSelectedDesignators: React.Dispatch<React.SetStateAction<Designator[]>>;
  closeModal: () => void;
}

export default function useEditDesignatorMutation({
  form,
  selectedDesignator,
  setSelectedDesignators,
  closeModal,
}: EditDesignatorFormProps) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (selectedDesignator === null)
        throw new Error("Designator tidak ditemukan");

      return editDesignator(selectedDesignator.id, form.values);
    },
    onMutate: () => {
      showNotification({
        title: "Loading",
        message: "Sedang mengubah designator...",
        color: "blue",
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["designators"]);
      showNotification({
        title: "Sukses",
        message: "Berhasil mengubah designator",
        color: "green",
      });
      setSelectedDesignators([]);
      closeModal();
    },
    onError: (error) => {
      if (error instanceof Error) {
        showNotification({
          title: "Error",
          message: error.message ?? "Gagal mengubah designator",
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
