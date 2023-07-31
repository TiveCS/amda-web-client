import {
  LopTicketAcceptanceStatus,
  LopTicketEvidenceStatus,
} from "@api/types/tickets";
import { useForm } from "@mantine/form";

export default function useFilterForm() {
  const form = useForm<{
    location: string[];
    identifier: string[];
    volumeStatus: boolean | null;
    evidenceStatus: LopTicketEvidenceStatus | null;
    acceptStatus: LopTicketAcceptanceStatus | null;
  }>({
    initialValues: {
      location: [],
      identifier: [],
      volumeStatus: null,
      evidenceStatus: null,
      acceptStatus: null,
    },
  });

  return { form };
}
