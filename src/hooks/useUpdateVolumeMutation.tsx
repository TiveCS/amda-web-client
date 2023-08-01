import { LopTicket } from "@api/types/tickets";
import { updateVolume } from "@api/volumes";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import useVolumeDetailsForm from "./useVolumeDetailsForm";

interface UpdateVolumeMutationHooksProps {
  ticket: LopTicket | null;
  volumeDetailsForm: ReturnType<typeof useVolumeDetailsForm>;
}

export default function useUpdateVolumeMutation({
  ticket,
  volumeDetailsForm,
}: UpdateVolumeMutationHooksProps) {
  const queryClient = useQueryClient();

  const [isMutating, setIsMutating] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!ticket) throw new Error("Ticket is null");

      return Promise.all(
        volumeDetailsForm.form.values.volumes.map((volume) => {
          return updateVolume(ticket.identifier, volume.id, {
            value: volume.value,
          });
        })
      );
    },
    onMutate: () => {
      setIsMutating(true);
      showNotification({
        title: "Loading",
        message: "Sedang mengubah volume...",
        color: "blue",
        loading: isMutating,
      });
    },
    onSuccess: async (result) => {
      await queryClient.invalidateQueries(["tickets"]);

      if (ticket !== null) {
        const newVolumes = result.map((res) => res.data);
        ticket.volumes = newVolumes;
      }

      setIsMutating(false);
      volumeDetailsForm.form.setDirty({ volumes: false });
      showNotification({
        title: "Success",
        message: "Berhasil mengubah volume",
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
          message: error.message ?? "Gagal mengubah volume",
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
