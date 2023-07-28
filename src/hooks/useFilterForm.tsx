import { useForm } from "@mantine/form";

export default function useFilterForm() {
  const filterForm = useForm<{
    location: string[];
    identifier: string[];
    volumeStatus: boolean | null;
    evidenceStatus: boolean | null;
    accStatus: boolean | null;
  }>({
    initialValues: {
      location: [],
      identifier: [],
      volumeStatus: null,
      evidenceStatus: null,
      accStatus: null,
    },
  });

  return { form: filterForm };
}
