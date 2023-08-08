import { getListDesignator } from "@api/designators";
import { LopTicket } from "@api/types/tickets";
import ButtonAMDA from "@components/ButtonAMDA";
import useAddVolumeMutation from "@hooks/useAddVolumeMutation";
import useRemoveVolumeMutation from "@hooks/useRemoveVolumeMutation";
import useUpdateVolumeMutation from "@hooks/useUpdateVolumeMutation";
import useVolumeDetailsForm from "@hooks/useVolumeDetailsForm";
import {
  ActionIcon,
  Alert,
  Flex,
  LoadingOverlay,
  Modal,
  NumberInput,
  ScrollArea,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedValue } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

interface TicketVolumeDetailsModalProps {
  selectedTicket: LopTicket | null;
  isOpen: boolean;
  onClose: () => void;
  setSelectedTicket: React.Dispatch<React.SetStateAction<LopTicket | null>>;
  volumeDetailsForm: ReturnType<typeof useVolumeDetailsForm>;
  hasCRUDAccess: boolean;
  isAdminMitra: boolean;
  isAdminTA: boolean;
}

export default function TicketVolumeDetailsModal({
  selectedTicket: ticket,
  isAdminMitra,
  isOpen,
  onClose,
  setSelectedTicket,
  volumeDetailsForm,
  hasCRUDAccess,
  isAdminTA,
}: TicketVolumeDetailsModalProps) {
  const searchForm = useForm({ initialValues: { search: "" } });
  const [searchDebounced] = useDebouncedValue(searchForm.values.search, 500);

  const isAccepted = useMemo(() => {
    return ticket?.acceptStatus === "ACCEPTED";
  }, [ticket?.acceptStatus]);

  const isCanEdit = useMemo(() => {
    return !isAccepted && hasCRUDAccess;
  }, [hasCRUDAccess, isAccepted]);

  const isMitraCanEdit = useMemo(() => {
    return isAdminMitra && ticket?.activity.isForMitra;
  }, [isAdminMitra, ticket?.activity.isForMitra]);

  const isTACanEdit = useMemo(() => {
    return isAdminTA && !ticket?.activity.isForMitra;
  }, [isAdminTA, ticket?.activity.isForMitra]);

  const isAllowEdit = useMemo(() => {
    if (isAdminMitra) return isCanEdit && isMitraCanEdit;
    if (isAdminTA) return isCanEdit && isTACanEdit;

    return isCanEdit;
  }, [isAdminMitra, isAdminTA, isCanEdit, isMitraCanEdit, isTACanEdit]);

  const [selectedDesignator, setSelectedDesignator] = useState<string | null>(
    null
  );

  const { refetch: refetchListDesignatorQuery, ...getListDesignatorsQuery } =
    useQuery({
      queryKey: ["ticket_volume_details_modal_designators"],
      queryFn: async () => {
        const result = await getListDesignator({
          search: searchDebounced,
        });

        const isTicketNull = ticket === null;

        const list = result.data.map((designator) => {
          const isDesignatorExists =
            !isTicketNull &&
            volumeDetailsForm.form.values.volumes.some(
              (volume) => volume.designator.id === designator.id
            );

          return {
            value: designator.id.toString(),
            label: designator.name,
            disabled: isDesignatorExists,
          };
        });

        return list;
      },
    });

  const addVolumeMutation = useAddVolumeMutation({
    setSelectedDesignator,
    ticket,
    volumeDetailsForm,
  });

  const removeVolumeMutation = useRemoveVolumeMutation({
    ticket,
    volumeDetailsForm,
  });

  const updateVolumeMutation = useUpdateVolumeMutation({
    ticket,
    volumeDetailsForm,
  });

  useEffect(() => {
    if (!isOpen) return;
    void refetchListDesignatorQuery();
  }, [isOpen, refetchListDesignatorQuery]);

  useEffect(() => {
    void refetchListDesignatorQuery();
  }, [searchDebounced, refetchListDesignatorQuery]);

  return (
    <Modal
      opened={isOpen}
      onClose={() => {
        onClose();
        setSelectedTicket(null);
      }}
      title={`Detail ${ticket?.identifier ?? "Tiket"}`}
      scrollAreaComponent={ScrollArea.Autosize}
      closeOnClickOutside={false}
      size={"md"}
    >
      <Stack spacing={"md"}>
        <Flex direction={"column"} gap={"sm"}>
          <TextInput
            label="ID Tiket"
            defaultValue={ticket?.identifier}
            readOnly
          />
          <TextInput
            label="Lokasi Tiket"
            defaultValue={ticket?.location}
            readOnly
          />
        </Flex>

        {isAllowEdit && (
          <Flex direction={"column"}>
            <Select
              label="Designator"
              searchable
              clearable
              placeholder="Cari designator"
              data={getListDesignatorsQuery.data ?? []}
              maxDropdownHeight={192}
              dropdownPosition="bottom"
              value={selectedDesignator}
              disabled={addVolumeMutation.isLoading}
              nothingFound="Designator tidak ditemukan"
              onSearchChange={(value) =>
                searchForm.setFieldValue("search", value)
              }
              onChange={(value) => {
                if (value === null) return;
                const designatorId = parseInt(value);
                setSelectedDesignator(value);
                addVolumeMutation.mutate(designatorId);
              }}
            />
          </Flex>
        )}

        <ScrollArea.Autosize
          offsetScrollbars
          className="max-h-96 mx-auto w-full px-1 mt-2"
        >
          <LoadingOverlay
            visible={
              updateVolumeMutation.isLoading ||
              addVolumeMutation.isLoading ||
              removeVolumeMutation.isLoading
            }
          />

          <Stack spacing={"md"}>
            {ticket?.volumes.length === 0 && (
              <Alert color="pink" title="Volume Kosong" variant="outline">
                <Text>Belum ada volume yang ditambahkan pada tiket ini</Text>
              </Alert>
            )}

            {ticket?.volumes.map((volume, index) => (
              <Flex
                direction={"row"}
                align={"center"}
                justify={"space-between"}
                key={index}
              >
                <Flex
                  align={"center"}
                  justify={"space-between"}
                  gap={"lg"}
                  direction={"row"}
                >
                  {isAllowEdit && (
                    <ActionIcon
                      color="red"
                      onClick={() => removeVolumeMutation.mutate(volume.id)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  )}

                  <Text className="font-medium">{volume.designator.name}</Text>
                </Flex>

                <NumberInput
                  min={1}
                  value={volumeDetailsForm.form.values.volumes[index]?.value}
                  readOnly={!isAllowEdit}
                  onChange={(value) => {
                    if (value === "") return;

                    const newVolume = { ...volume, value };
                    volumeDetailsForm.updateVolume(newVolume);
                  }}
                />
              </Flex>
            ))}
          </Stack>
        </ScrollArea.Autosize>

        <Flex direction={"column"} gap={"xl"} className="mt-1">
          <ButtonAMDA
            loading={updateVolumeMutation.isLoading}
            onClick={() => {
              if (!volumeDetailsForm.form.isDirty("volumes")) {
                onClose();
                return;
              }
              updateVolumeMutation.mutate();
            }}
          >
            {volumeDetailsForm.form.isDirty("volumes")
              ? "Simpan Perubahan"
              : "Tutup"}
          </ButtonAMDA>
          <ButtonAMDA
            variant="white"
            onClick={() => {
              onClose();
              setSelectedTicket(null);
            }}
          >
            Batal
          </ButtonAMDA>
        </Flex>
      </Stack>
    </Modal>
  );
}
