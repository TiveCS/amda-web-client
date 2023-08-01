import { LopTicket } from "@api/types/tickets";
import ButtonAMDA from "@components/ButtonAMDA";
import useTicketStatusMutation from "@hooks/useTicketStatusMutation";
import useTicketStatusUpdateForm from "@hooks/useTicketStatusUpdateForm";
import { Alert, Flex, Modal, Stack, Text, Textarea } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

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

        <Textarea
          label="Catatan Uji Terima"
          placeholder="Catatan uji terima"
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
