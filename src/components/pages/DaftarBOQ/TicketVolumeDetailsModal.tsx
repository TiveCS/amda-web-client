import { LopTicket } from "@api/types/tickets";
import ButtonAMDA from "@components/ButtonAMDA";
import useAddVolumeMutation from "@hooks/useAddVolumeMutation";
import useRemoveVolumeMutation from "@hooks/useRemoveVolumeMutation";
import useUpdateVolumeMutation from "@hooks/useUpdateVolumeMutation";
import useVolumeDetailsForm from "@hooks/useVolumeDetailsForm";
import {
  Alert,
  Card,
  Grid,
  Group,
  LoadingOverlay,
  Modal,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedValue } from "@mantine/hooks";
import { useMemo } from "react";
import TicketVolumeDetailInput from "./TicketVolumeDetailInput";
import TicketVolumeDetailItem from "./TicketVolumeDetailItem";
import TicketVolumeDesignatorBrowser from "./VolumeDesignatorBrowser";

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

  const addVolumeMutation = useAddVolumeMutation({
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

  const handleClose = () => {
    onClose();
    setSelectedTicket(null);
    volumeDetailsForm.form.reset();
  };

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      title={`Detail ${ticket?.identifier ?? "Tiket"}`}
      padding={"xl"}
      size={"calc(100vw - 4rem)"}
      closeOnClickOutside={false}
    >
      <LoadingOverlay
        visible={
          updateVolumeMutation.isLoading ||
          addVolumeMutation.isLoading ||
          removeVolumeMutation.isLoading
        }
      />

      <Grid columns={12} h={"calc(100vh - 12rem)"}>
        <Grid.Col span={7} className="max-h-[80%]">
          <TicketVolumeDesignatorBrowser
            ticket={ticket}
            isAllowEdit={isAllowEdit}
            searchForm={searchForm}
            searchDebounced={searchDebounced}
            addVolumeMutation={addVolumeMutation}
            removeVolumeMutation={removeVolumeMutation}
          />
        </Grid.Col>

        <Grid.Col span={5}>
          <TicketVolumeDetailInput ticket={ticket} />

          <Text className="font-medium mt-4">Daftar Volume</Text>

          <ScrollArea.Autosize
            offsetScrollbars
            className="max-h-64 mx-auto w-full"
          >
            <Card withBorder>
              <Stack spacing={"md"}>
                {ticket?.volumes.length === 0 && (
                  <Alert color="pink" title="Volume Kosong" variant="outline">
                    <Text>
                      Belum ada volume yang ditambahkan pada tiket ini
                    </Text>
                  </Alert>
                )}

                {ticket?.volumes.map((volume, index) => (
                  <TicketVolumeDetailItem
                    key={index}
                    isAllowEdit={isAllowEdit}
                    volumeDetailsForm={volumeDetailsForm}
                    volume={volume}
                    searchForm={searchForm}
                  />
                ))}
              </Stack>
            </Card>
          </ScrollArea.Autosize>

          <Group grow spacing={"lg"} className="mt-8">
            <ButtonAMDA variant="white" onClick={handleClose}>
              Batal
            </ButtonAMDA>

            <ButtonAMDA
              loading={updateVolumeMutation.isLoading}
              onClick={() => {
                if (!volumeDetailsForm.form.isDirty("volumes")) {
                  handleClose();
                  return;
                }
                void updateVolumeMutation.mutateAsync();
              }}
            >
              {volumeDetailsForm.form.isDirty("volumes")
                ? "Simpan Perubahan"
                : "Tutup"}
            </ButtonAMDA>
          </Group>
        </Grid.Col>
      </Grid>
    </Modal>
  );
}
