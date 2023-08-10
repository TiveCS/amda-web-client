import { addActivity } from "@api/activities";
import { LopActivityForm } from "@api/types/lops";
import { UseFormReturnType } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { amdaDayJs } from "../utils";

export default function useAddActivityMutation(
  form: UseFormReturnType<
    LopActivityForm,
    (values: LopActivityForm) => LopActivityForm
  >,
  closeModal: () => void
) {
  const notificationId = useMemo(() => Math.random().toString(), []);

  const dayjs = amdaDayJs();

  const queryClient = useQueryClient();
  const addKegiatanMutation = useMutation({
    mutationFn: async () => {
      const inputAt = dayjs(form.values.inputDate).utc();
      const split = form.values.inputTime.split(":");
      const hours = parseInt(split[0]);
      const minutes = parseInt(split[1]);

      inputAt.hour(hours).minute(minutes);

      return await addActivity({
        lopId: form.values.lopId,
        stoId: form.values.stoId,
        mitraId: form.values.mitraId,
        ticketIdentifier: form.values.ticketIdentifier,
        ticketLocation: form.values.ticketLocation,
        workType: form.values.workType,
        workDescription: form.values.workDescription,
        isForMitra: form.values.isForMitra,
        inputAt: inputAt.toDate(),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["lops"]);

      notifications.update({
        id: notificationId,
        title: "Success",
        message: "Kegiatan berhasil ditambahkan!",
        color: "green",
        loading: false,
        autoClose: 3000,
        icon: <IconCheck />,
      });

      form.reset();
      closeModal();
    },
    onError: (error) => {
      if (error instanceof Error) {
        notifications.update({
          id: notificationId,
          title: "Error",
          message: error.message ?? "Gagal menambahkan kegiatan!",
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
        message: "Terjadi kesalahan internal",
        color: "red",
        loading: false,
        autoClose: 3000,
        icon: <IconX />,
      });
    },
    onMutate: () => {
      notifications.show({
        id: notificationId,
        title: "Loading",
        message: "Sedang menambahkan kegiatan...",
        color: "blue",
        loading: true,
        withCloseButton: false,
        autoClose: false,
      });
    },
  });

  return addKegiatanMutation;
}
