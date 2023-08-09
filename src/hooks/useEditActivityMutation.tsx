import { editActivity } from "@api/activities";
import { LopActivity, LopActivityForm } from "@api/types/lops";
import { UseFormReturnType } from "@mantine/form";
import { notifications, showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
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
  const notificationId = "edit-kegiatan-notification";
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
        workDescription: form.values.workDescription,
        isForMitra: form.values.isForMitra,
        inputAt,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["lops"]);

      notifications.update({
        id: notificationId,
        title: "Success",
        message: "Kegiatan berhasil diubah!",
        color: "green",
        autoClose: 3000,
        icon: <IconCheck />,
      });

      form.reset();
      closeModal();
      setEditActivity(null);
      setSelectedActivities([]);
    },
    onError: (error) => {
      if (error instanceof Error) {
        notifications.update({
          id: notificationId,
          title: "Error",
          message: error.message ?? "Gagal mengubah kegiatan!",
          color: "red",
          autoClose: 3000,
          icon: <IconX />,
        });
        throw error;
      }
      showNotification({
        title: "Error",
        message: "Terjadi kesalahan internal",
        color: "red",
        autoClose: 3000,
        icon: <IconX />,
      });
      throw error;
    },
    onMutate: () => {
      notifications.show({
        id: notificationId,
        title: "Loading",
        color: "blue",
        message: "Kegiatan sedang diubah...",
        loading: true,
        autoClose: false,
        withCloseButton: false,
      });
    },
  });

  return editKegiatanMutation;
}
