import { LopVolume } from "@api/types/volumes";
import useVolumeDetailsForm from "@hooks/useVolumeDetailsForm";
import { ActionIcon, Flex, NumberInput, Text, Tooltip } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconInfoCircle } from "@tabler/icons-react";

interface TicketVolumeDetailItemProps {
  volume: LopVolume;
  isAllowEdit?: boolean;
  volumeDetailsForm: ReturnType<typeof useVolumeDetailsForm>;
  searchForm: UseFormReturnType<{ search: string }>;
}

export default function TicketVolumeDetailItem({
  isAllowEdit,
  volume,
  volumeDetailsForm,
  searchForm,
}: TicketVolumeDetailItemProps) {
  return (
    <Flex direction={"row"} align={"center"} justify={"space-between"}>
      <Flex
        align={"center"}
        justify={"space-between"}
        gap={"lg"}
        direction={"row"}
      >
        <Tooltip
          label="Cari Info Designator"
          color="indigo"
          position="right-end"
        >
          <ActionIcon
            color="indigo"
            onClick={() =>
              searchForm.setFieldValue("search", volume.designator.name)
            }
          >
            <IconInfoCircle size={16} />
          </ActionIcon>
        </Tooltip>

        <Text className="font-medium w-full" truncate>
          {volume.designator.name}
        </Text>
      </Flex>

      <NumberInput
        min={1}
        value={volumeDetailsForm.form.values.volumes[volume.id]?.value}
        readOnly={!isAllowEdit}
        onChange={(value) => {
          if (value === "") return;

          const newVolume = { ...volume, value };
          volumeDetailsForm.updateVolume(newVolume);
        }}
      />
    </Flex>
  );
}
