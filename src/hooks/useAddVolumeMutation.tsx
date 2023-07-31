import { LopTicket } from "@api/types/tickets";
import { addVolumeToTicket } from "@api/volumes";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import useVolumeDetailsForm from "./useVolumeDetailsForm";

interface TicketVolumeDetailsModalProps {
  ticket: LopTicket | null;
  volumeDetailsForm: ReturnType<typeof useVolumeDetailsForm>;
  setSelectedDesignator: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function useAddVolumeMutation({
  setSelectedDesignator,
  ticket,
  volumeDetailsForm,
}: TicketVolumeDetailsModalProps) {
  const queryClient = useQueryClient();

  const [isMutating, setIsMutating] = useState(false);

  const addVolumeMutation = useMutation({
    mutationFn: async (designatorId: number) => {
      if (ticket === null) return;
      return addVolumeToTicket(ticket.identifier, { designatorId });
    },
    onMutate: () => {
      setIsMutating(true);
      showNotification({
        title: "Loading",
        message: "Sedang menambahkan volume",
        color: "blue",
        loading: isMutating,
      });
    },
    onSuccess: async (result) => {
      setSelectedDesignator(null);

      await queryClient.invalidateQueries(["tickets"]);
      await queryClient.invalidateQueries([
        "ticket_volume_details_modal_designators",
      ]);

      const newVolume = result?.data;
      if (ticket !== null && newVolume !== undefined) {
        volumeDetailsForm.addVolume(newVolume);
        ticket.volumes.push(newVolume);
      }

      setIsMutating(false);
      volumeDetailsForm.form.setDirty({ volumes: false });
      showNotification({
        title: "Success",
        message: "Berhasil menambahkan volume",
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
          message: error.message ?? "Gagal menambahkan volume",
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

  return addVolumeMutation;
}
