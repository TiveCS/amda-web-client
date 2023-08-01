import { LopTicket } from "@api/types/tickets";
import { deleteVolume } from "@api/volumes";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import useVolumeDetailsForm from "./useVolumeDetailsForm";

interface RemoveVolumeMutationHooksProps {
  ticket: LopTicket | null;
  volumeDetailsForm: ReturnType<typeof useVolumeDetailsForm>;
}

export default function useRemoveVolumeMutation({
  ticket,
  volumeDetailsForm,
}: RemoveVolumeMutationHooksProps) {
  const queryClient = useQueryClient();

  const [isMutating, setIsMutating] = useState(false);

  const mutation = useMutation({
    mutationFn: async (volumeId: number) => {
      if (!ticket) throw new Error("Ticket is null");

      const result = await deleteVolume(ticket?.identifier, volumeId);
      return result;
    },
    onMutate: () => {
      setIsMutating(true);
      showNotification({
        title: "Loading",
        message: "Sedang menghapus volume",
        color: "blue",
        loading: isMutating,
      });
    },
    onSuccess: async (result) => {
      await queryClient.invalidateQueries(["tickets"]);
      await queryClient.invalidateQueries([
        "ticket_volume_details_modal_designators",
      ]);

      if (ticket !== null) {
        volumeDetailsForm.removeVolume(result.data.id);
        ticket.volumes = ticket.volumes.filter(
          (volume) => volume.id !== result.data.id
        );
      }

      setIsMutating(false);
      volumeDetailsForm.form.setDirty({ volumes: false });
      showNotification({
        title: "Success",
        message: "Berhasil menghapus volume",
        color: "green",
        icon: <IconCheck />,
      });
    },
    onError: (error) => {
      setIsMutating(false);
      volumeDetailsForm.form.setDirty({ volumes: false });
      if (error instanceof Error) {
        showNotification({
          title: "Error",
          message: error.message ?? "Gagal menghapus volume",
          color: "red",
          icon: <IconX />,
        });
        return;
      }
      showNotification({
        title: "Error",
        message: "Terjadi kesalahan internal",
        color: "red",
        icon: <IconX />,
      });
    },
  });

  return mutation;
}
