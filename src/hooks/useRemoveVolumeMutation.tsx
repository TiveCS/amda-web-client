import { LopTicket } from "@api/types/tickets";
import { deleteVolume } from "@api/volumes";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import useVolumeDetailsForm from "./useVolumeDetailsForm";

interface RemoveVolumeMutationHooksProps {
  ticket: LopTicket | null;
  volumeDetailsForm: ReturnType<typeof useVolumeDetailsForm>;
}

export default function useRemoveVolumeMutation({
  ticket,
  volumeDetailsForm,
}: RemoveVolumeMutationHooksProps) {
  const notificationId = useMemo(
    () => `remove-volume-details-${Math.random()}`,
    []
  );
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (volumeId: number) => {
      if (!ticket) throw new Error("Ticket is null");

      const result = await deleteVolume(ticket?.identifier, volumeId);
      return result;
    },
    onMutate: () => {
      notifications.show({
        id: notificationId,
        title: "Loading",
        message: "Sedang menghapus volume",
        color: "blue",
        loading: true,
        withCloseButton: false,
      });
    },
    onSuccess: async (result) => {
      await queryClient.invalidateQueries(["tickets"]);
      await queryClient.invalidateQueries([
        "volume_designator_browser_designators",
      ]);

      if (ticket !== null) {
        volumeDetailsForm.removeVolume(result.data.id);
        volumeDetailsForm.form.setDirty({ volumes: false });
      }

      notifications.update({
        id: notificationId,
        title: "Success",
        message: "Berhasil menghapus volume",
        color: "green",
        autoClose: 3000,
        loading: false,
        icon: <IconCheck />,
      });
    },
    onError: (error) => {
      volumeDetailsForm.form.setDirty({ volumes: false });
      if (error instanceof Error) {
        notifications.update({
          id: notificationId,
          title: "Error",
          message: error.message ?? "Gagal menghapus volume",
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
  });

  return mutation;
}
