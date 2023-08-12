import { DesignatorWithTicketVolumes } from "@api/types/designators";
import useAddVolumeMutation from "@hooks/useAddVolumeMutation";
import useRemoveVolumeMutation from "@hooks/useRemoveVolumeMutation";
import {
  ActionIcon,
  Badge,
  Card,
  Flex,
  Grid,
  Group,
  Highlight,
  Stack,
  Tooltip,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useMemo } from "react";
import { numberWithSeparator } from "src/utils";

interface VolumeDesignatorBrowseItemProps {
  designator: DesignatorWithTicketVolumes;
  search: string;
  volumeId?: number;
  isReadOnly?: boolean;
  addVolumeMutation: ReturnType<typeof useAddVolumeMutation>;
  removeVolumeMutation: ReturnType<typeof useRemoveVolumeMutation>;
}

export default function VolumeDesignatorBrowseItem({
  designator,
  search,
  isReadOnly = false,
  addVolumeMutation,
  volumeId = -1,
  removeVolumeMutation,
}: VolumeDesignatorBrowseItemProps) {
  const hasVolume = useMemo(() => {
    return volumeId !== -1;
  }, [volumeId]);

  return (
    <Card withBorder p={"xl"} mr={"xl"} shadow="sm">
      <Card.Section>
        <Grid columns={12} align="center" justify="space-between">
          <Grid.Col span={9}>
            <Stack spacing={"xs"}>
              <Group spacing={"xl"}>
                <Highlight highlight={search} className="font-medium">
                  {designator.name}
                </Highlight>

                <Group spacing={"sm"}>
                  {designator.isMaterial ? (
                    <Badge color="green">Material</Badge>
                  ) : (
                    <Badge color="blue">Jasa</Badge>
                  )}

                  <Badge variant="light" color="orange" className="w-fit">
                    {numberWithSeparator(designator.pricePerUnit)} /{" "}
                    {designator.unit}
                  </Badge>
                </Group>
              </Group>

              <Highlight highlight={search}>
                {designator.workDescription}
              </Highlight>
            </Stack>
          </Grid.Col>

          {!isReadOnly && (
            <Grid.Col span={3}>
              <Flex justify={"flex-end"}>
                {hasVolume ? (
                  <Tooltip
                    color="red"
                    label="Hapus Designator"
                    position="left-start"
                  >
                    <ActionIcon
                      color="red"
                      variant="light"
                      disabled={isReadOnly || !hasVolume}
                      onClick={() => removeVolumeMutation.mutate(volumeId)}
                    >
                      <IconTrash size={20} />
                    </ActionIcon>
                  </Tooltip>
                ) : (
                  <Tooltip
                    color="blue"
                    label="Tambah Designator"
                    position="left-start"
                  >
                    <ActionIcon
                      color="blue"
                      variant="light"
                      disabled={isReadOnly}
                      onClick={() =>
                        void addVolumeMutation.mutate(designator.id)
                      }
                    >
                      <IconPlus size={20} />
                    </ActionIcon>
                  </Tooltip>
                )}
              </Flex>
            </Grid.Col>
          )}
        </Grid>
      </Card.Section>
    </Card>
  );
}
