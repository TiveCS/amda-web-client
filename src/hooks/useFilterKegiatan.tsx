import { ActivitiesWorkType } from "@api/types/activities";
import { useForm } from "@mantine/form";

interface FilterKegiatanFormProps {
  mitraIds?: string[];
  stoIds?: string[];
  workType?: ActivitiesWorkType | null;
}

export default function useFilterKegiatan({
  mitraIds,
  stoIds,
  workType,
}: FilterKegiatanFormProps) {
  const form = useForm<{
    sto: string[];
    mitra: string[];
    workType: ActivitiesWorkType | null;
  }>({
    initialValues: {
      sto: stoIds ?? [],
      mitra: mitraIds ?? [],
      workType: workType ?? null,
    },
  });

  return { form };
}
