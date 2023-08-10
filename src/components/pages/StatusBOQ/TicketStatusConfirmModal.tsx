import { LopTicket } from "@api/types/tickets";
import ButtonAMDA from "@components/ButtonAMDA";
import useTicketStatusMutation from "@hooks/useTicketStatusMutation";
import useTicketStatusUpdateForm from "@hooks/useTicketStatusUpdateForm";
import {
  ActionIcon,
  Alert,
  Flex,
  Group,
  Modal,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";
import { IconAlertCircle, IconCheck, IconX } from "@tabler/icons-react";
import { useMemo } from "react";

interface TicketStatusConfirmModalProps {
  ticket: LopTicket | null;
  isOpen: boolean;
  onClose: () => void;
  form: ReturnType<typeof useTicketStatusUpdateForm>;
  ticketStatusMutation: ReturnType<typeof useTicketStatusMutation>;
}

export default function TicketStatusConfirmModal({
  ticket,
  isOpen,
  onClose,
  form,
  ticketStatusMutation,
}: TicketStatusConfirmModalProps) {
  const isVolumeSizeAllowed = useMemo(() => {
    if (!ticket) return false;
    return ticket.volumes.length > 0;
  }, [ticket]);

  const isEvidenceAllowed = useMemo(() => {
    if (!ticket) return false;
    return (
      ticket.evidence.afterKey &&
      ticket.evidence.beforeKey &&
      ticket.evidence.onProgressKey
    );
  }, [ticket]);

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title="Ubah Status Tiket"
      centered
      size={"lg"}
    >
      <Stack spacing={"md"}>
        <Alert icon={<IconAlertCircle />}>
          <Text>
            Ubah status tiket <strong>{ticket?.identifier}</strong> dari{" "}
            <strong>{ticket?.acceptStatus}</strong> menjadi{" "}
            <strong>{form.values.status}</strong>?
          </Text>
          <br />
          <Text>
            <strong>Perhatian:</strong> Mohon pastikan kembali tiket yang akan
            diubah.
          </Text>
        </Alert>

        <Alert variant="outline" title="Kelengkapan Tiket" color="blue">
          <Stack spacing={"md"}>
            <Group spacing={"md"}>
              <ActionIcon
                variant="outline"
                size={"sm"}
                color={isVolumeSizeAllowed ? "green" : "red"}
              >
                {isVolumeSizeAllowed ? (
                  <IconCheck size={"1.25rem"} />
                ) : (
                  <IconX size={"1.25rem"} />
                )}
              </ActionIcon>
              <Text>Jumlah detail volume lebih dari 0</Text>
            </Group>

            <Group spacing={"md"}>
              <ActionIcon
                variant="outline"
                size={"sm"}
                color={isEvidenceAllowed ? "green" : "red"}
              >
                {isEvidenceAllowed ? (
                  <IconCheck size={"1.25rem"} />
                ) : (
                  <IconX size={"1.25rem"} />
                )}
              </ActionIcon>
              <Text>Terdapat evidence before, on progress dan after</Text>
            </Group>
          </Stack>
        </Alert>

        <Textarea
          label="Catatan Uji Terima"
          placeholder="Catatan uji terima"
          disabled={form.values.status === "PENDING"}
          {...form.getInputProps("note")}
        />

        <Flex direction={"row-reverse"} gap={"lg"} mt={"sm"}>
          <ButtonAMDA
            loading={ticketStatusMutation.isLoading}
            onClick={() => {
              void ticketStatusMutation.mutateAsync();
            }}
          >
            Ubah Status
          </ButtonAMDA>

          <ButtonAMDA variant="white" onClick={onClose}>
            Batal
          </ButtonAMDA>
        </Flex>
      </Stack>
    </Modal>
  );
}
