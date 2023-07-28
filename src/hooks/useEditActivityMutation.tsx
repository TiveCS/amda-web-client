import { editActivity } from "@api/activities";
import { LopActivity, LopActivityForm } from "@api/types/lops";
import { UseFormReturnType } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useEditActivityMutation(
  form: UseFormReturnType<
    LopActivityForm,
    (values: LopActivityForm) => LopActivityForm
  >,
  closeModal: () => void,
  currentActivity: LopActivity | null,
  setEditActivity: React.Dispatch<React.SetStateAction<LopActivity | null>>,
  setSelectedActivities: React.Dispatch<React.SetStateAction<LopActivity[]>>
) {
  const queryClient = useQueryClient();

  const editKegiatanMutation = useMutation({
    mutationFn: async () => {
      if (!currentActivity) return;

      const inputAt = form.values.inputDate;
      inputAt.setHours(parseInt(form.values.inputTime.split(":")[0]));
      inputAt.setMinutes(parseInt(form.values.inputTime.split(":")[1]));

      return await editActivity(currentActivity.id, {
        lopId: form.values.lopId,
        stoId: form.values.stoId,
        mitraId: form.values.mitraId,
        ticketIdentifier: form.values.ticketIdentifier,
        ticketLocation: form.values.ticketLocation,
        workType: form.values.workType,
        isForMitra: form.values.isForMitra,
        inputAt,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["lops"]);
      showNotification({
        title: "Success",
        message: "Kegiatan berhasil diubah!",
        color: "green",
      });
      form.reset();
      closeModal();
      setEditActivity(null);
      setSelectedActivities([]);
    },
    onError: (error) => {
      if (error instanceof Error) {
        showNotification({
          title: "Error",
          message: error.message ?? "Gagal mengubah kegiatan!",
          color: "red",
        });
        throw error;
      }
      showNotification({
        title: "Error",
        message: "Terjadi kesalahan internal",
        color: "red",
      });
      throw error;
    },
    onMutate: () => {
      showNotification({
        title: "Loading",
        message: "Kegiatan sedang diubah...",
      });
    },
  });

  return editKegiatanMutation;
}
