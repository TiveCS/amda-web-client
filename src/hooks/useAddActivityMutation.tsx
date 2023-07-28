import { addActivity } from "@api/activities";
import { LopActivityForm } from "@api/types/lops";
import { UseFormReturnType } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useAddActivityMutation(
  form: UseFormReturnType<
    LopActivityForm,
    (values: LopActivityForm) => LopActivityForm
  >,
  closeModal: () => void
) {
  const queryClient = useQueryClient();
  const addKegiatanMutation = useMutation({
    mutationFn: async () => {
      const inputAt = form.values.inputDate;
      inputAt.setHours(parseInt(form.values.inputTime.split(":")[0]));
      inputAt.setMinutes(parseInt(form.values.inputTime.split(":")[1]));

      return await addActivity({
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
        message: "Kegiatan berhasil ditambahkan!",
        color: "green",
      });
      form.reset();
      closeModal();
    },
    onError: (error) => {
      if (error instanceof Error) {
        showNotification({
          title: "Error",
          message: error.message ?? "Gagal menambahkan kegiatan!",
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
        message: "Kegiatan sedang ditambahkan...",
      });
    },
  });

  return addKegiatanMutation;
}
