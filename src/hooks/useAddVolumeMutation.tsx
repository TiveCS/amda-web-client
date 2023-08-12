import { LopTicket } from "@api/types/tickets";
import { addVolumeToTicket } from "@api/volumes";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import useVolumeDetailsForm from "./useVolumeDetailsForm";

interface TicketVolumeDetailsModalProps {
  ticket: LopTicket | null;
  volumeDetailsForm: ReturnType<typeof useVolumeDetailsForm>;
}

export default function useAddVolumeMutation({
  ticket,
  volumeDetailsForm,
}: TicketVolumeDetailsModalProps) {
  const notificationId = useMemo(
    () => `add-volume-details-${Math.random()}`,
    []
  );
  const queryClient = useQueryClient();

  const addVolumeMutation = useMutation({
    mutationFn: async (designatorId: number) => {
      if (ticket === null) return;
      return addVolumeToTicket(ticket.identifier, { designatorId });
    },
    onMutate: () => {
      notifications.show({
        id: notificationId,
        title: "Loading",
        message: "Sedang menambahkan volume",
        color: "blue",
        loading: true,
      });
    },
    onSuccess: async (result) => {
      await queryClient.invalidateQueries(["tickets"]);
      await queryClient.invalidateQueries([
        "volume_designator_browser_designators",
      ]);

      if (result?.data) {
        volumeDetailsForm.addVolume(result?.data);
        volumeDetailsForm.form.setDirty({ volumes: false });
      }

      notifications.update({
        id: notificationId,
        title: "Success",
        message: "Berhasil menambahkan volume",
        color: "green",
        loading: false,
        icon: <IconCheck />,
        autoClose: 3000,
      });
    },
    onError: (error) => {
      volumeDetailsForm.form.setDirty({ volumes: false });
      if (error instanceof Error) {
        notifications.update({
          id: notificationId,
          title: "Error",
          message: error.message ?? "Gagal menambahkan volume",
          color: "red",
          loading: false,
          icon: <IconX />,
          autoClose: 3000,
        });
        return;
      }
      notifications.update({
        id: notificationId,
        title: "Error",
        message: "Terjadi kesalahan internal",
        color: "red",
        loading: false,
        icon: <IconX />,
        autoClose: 3000,
      });
    },
  });

  return addVolumeMutation;
}
