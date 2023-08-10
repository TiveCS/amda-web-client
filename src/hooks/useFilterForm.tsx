import {
  LopTicketAcceptanceStatus,
  LopTicketEvidenceStatus,
} from "@api/types/tickets";
import { useForm } from "@mantine/form";

type FilterFormValues = {
  inputDate: Date | null;
  location: string[];
  identifier: string[];
  volumeStatus: boolean | null;
  evidenceStatus: LopTicketEvidenceStatus | null;
  acceptStatus: LopTicketAcceptanceStatus | null;
  mitraIds?: number[] | null;
};

interface FilterFormProps {
  values?: {
    inputDate?: Date | null;
    location?: string[];
    identifier?: string[];
    volumeStatus?: boolean | null;
    evidenceStatus?: LopTicketEvidenceStatus | null;
    acceptStatus?: LopTicketAcceptanceStatus | null;
    mitraIds?: number[] | null;
  };
}

export default function useFilterForm({ values }: FilterFormProps) {
  const form = useForm<FilterFormValues>({
    initialValues: {
      inputDate: values?.inputDate ?? null,
      location: values?.location ?? [],
      identifier: values?.identifier ?? [],
      volumeStatus: values?.volumeStatus ?? null,
      evidenceStatus: values?.evidenceStatus ?? null,
      acceptStatus: values?.acceptStatus ?? null,
      mitraIds: values?.mitraIds ?? null,
    },
  });

  return { form };
}
