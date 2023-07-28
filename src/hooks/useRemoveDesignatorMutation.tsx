import { removeDesignatorById } from "@api/designators";
import { Designator } from "@api/types/designators";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface RemoveDesignatorFormProps {
  selectedDesignators: Designator[];
  setSelectedDesignators: React.Dispatch<React.SetStateAction<Designator[]>>;
}

export default function useRemoveDesignatorMutation({
  selectedDesignators,
  setSelectedDesignators,
}: RemoveDesignatorFormProps) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return Promise.all(
        selectedDesignators.map((designator) =>
          removeDesignatorById(designator.id)
        )
      );
    },
    onMutate: () => {
      showNotification({
        title: "Loading",
        message: "Sedang menghapus designator...",
        color: "blue",
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["designators"]);
      showNotification({
        title: "Sukses",
        message: "Berhasil menghapus designator",
        color: "green",
      });
      setSelectedDesignators([]);
    },
    onError: (error) => {
      if (error instanceof Error) {
        showNotification({
          title: "Error",
          message: error.message ?? "Gagal menghapus designator",
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
