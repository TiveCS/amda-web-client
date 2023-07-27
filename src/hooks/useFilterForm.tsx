import { useForm } from "@mantine/form";

export default function useFilterForm() {
  const filterForm = useForm<{
    location: string[];
    volumeStatus: boolean | null;
    evidenceStatus: boolean | null;
    accStatus: boolean | null;
  }>({
    initialValues: {
      location: [],
      volumeStatus: null,
      evidenceStatus: null,
      accStatus: null,
    },
  });

  return { form: filterForm };
}
