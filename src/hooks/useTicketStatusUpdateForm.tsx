import { LopTicketAcceptanceStatus } from "@api/types/tickets";
import { isNotEmpty, useForm } from "@mantine/form";

export default function useTicketStatusUpdateForm() {
  return useForm<{
    status: LopTicketAcceptanceStatus | null;
    note: string | null;
  }>({
    initialValues: {
      note: null,
      status: null,
    },
    validate: {
      note: isNotEmpty("Catatan tidak boleh kosong"),
      status: isNotEmpty("Status tidak boleh kosong"),
    },
  });
}
