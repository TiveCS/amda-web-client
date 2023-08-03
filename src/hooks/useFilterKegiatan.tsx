import { ActivitiesWorkType } from "@api/types/activities";
import { useForm } from "@mantine/form";

export default function useFilterKegiatan() {
  const form = useForm<{
    sto: string[];
    mitra: string[];
    workType: ActivitiesWorkType | null;
  }>({
    initialValues: {
      sto: [],
      mitra: [],
      workType: null,
    },
  });

  return { form };
}
