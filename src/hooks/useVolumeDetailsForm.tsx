import { LopVolume } from "@api/types/volumes";
import { useForm } from "@mantine/form";

export default function useVolumeDetailsForm() {
  const form = useForm<{ volumes: LopVolume[] }>({
    initialValues: {
      volumes: [],
    },
  });

  const addVolume = (volume: LopVolume) => {
    form.setFieldValue("volumes", [...form.values.volumes, volume]);
  };

  const updateVolume = (volume: LopVolume) => {
    form.setFieldValue(
      "volumes",
      form.values.volumes.map((v) => (v.id === volume.id ? volume : v))
    );
  };

  const removeVolume = (volumeId: number) => {
    form.setFieldValue(
      "volumes",
      form.values.volumes.filter((volume) => volume.id !== volumeId)
    );
  };

  return { form, addVolume, removeVolume, updateVolume };
}
