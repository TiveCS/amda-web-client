import { LopVolume } from "@api/types/volumes";
import { useForm } from "@mantine/form";

export type VolumeDetailsFormValues = {
  volumes: VolumesFormType;
};

type VolumesFormType = { [key: number]: LopVolume };

export default function useVolumeDetailsForm() {
  const form = useForm<VolumeDetailsFormValues>({
    initialValues: {
      volumes: {},
    },
  });

  const setVolumes = (volumes: LopVolume[]) => {
    const newVolumes: VolumesFormType = {};

    volumes.forEach((volume) => {
      newVolumes[volume.id] = volume;
    });

    form.setFieldValue("volumes", newVolumes);
  };

  const addVolume = (volume: LopVolume) => {
    const volumes = form.values.volumes;

    volumes[volume.id] = volume;

    form.setFieldValue("volumes", volumes);
  };

  const updateVolume = (volume: LopVolume) => {
    const volumes = form.values.volumes;

    const oldVolume = volumes[volume.id];

    if (!oldVolume) return;

    oldVolume.value = volume.value;

    volumes[volume.id] = oldVolume;

    form.setFieldValue("volumes", volumes);
  };

  const removeVolume = (volumeId: number) => {
    const volumes = form.values.volumes;

    delete volumes[volumeId];

    form.setFieldValue("volumes", volumes);
  };

  return { form, addVolume, removeVolume, updateVolume, setVolumes };
}
