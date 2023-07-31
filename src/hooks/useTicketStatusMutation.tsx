import { useMutation, useQueryClient } from "@tanstack/react-query";
import useTicketStatusUpdateForm from "./useTicketStatusUpdateForm";
import { acceptTicket, rejectTicket } from "@api/tickets";
import { notifications } from "@mantine/notifications";
import { useMemo } from "react";
import { IconCheck, IconX } from "@tabler/icons-react";

interface TicketStatusUpdateFormProps {
  closeConfirmModal: () => void;
  identifier: string | undefined;
  form: ReturnType<typeof useTicketStatusUpdateForm>;
}

export default function useTicketStatusMutation({
  form,
  identifier,
  closeConfirmModal,
}: TicketStatusUpdateFormProps) {
  const notificationId = useMemo(() => {
    return `notification-update-status-${identifier ?? ""}`;
  }, [identifier]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!identifier) throw new Error("Identifier is null");
      if (form.validate().hasErrors) {
        throw new Error("Form tidak valid");
      }

      if (form.values.status === "ACCEPTED") {
        return acceptTicket(identifier, {
          note: form.values.note,
        });
      } else if (form.values.status === "REJECTED") {
        return rejectTicket(identifier, {
          note: form.values.note,
        });
      }
    },
    onMutate: () => {
      notifications.show({
        id: notificationId,
        title: "Loading",
        message: "Mengubah status BOQ...",
        loading: true,
        autoClose: false,
        color: "blue",
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["tickets"]);

      notifications.update({
        id: notificationId,
        title: "Berhasil",
        message: `Status tiket berhasil diubah menjadi ${form.values.status!}`,
        autoClose: 3000,
        color: "green",
        icon: <IconCheck />,
      });

      closeConfirmModal();
    },
    onError: (error) => {
      if (error instanceof Error) {
        notifications.update({
          id: notificationId,
          title: "Error",
          message: error.message ?? "Gagal mengubah status tiket",
          autoClose: 3000,
          color: "red",
          icon: <IconX />,
        });
        return;
      }
      notifications.update({
        id: notificationId,
        title: "Error",
        message: "Terjadi kesalahan internal",
        autoClose: 3000,
        color: "red",
        icon: <IconX />,
      });
    },
  });

  return mutation;
}
