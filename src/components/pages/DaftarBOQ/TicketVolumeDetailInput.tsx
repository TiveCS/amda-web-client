import { LopTicket } from "@api/types/tickets";
import { Flex, TextInput } from "@mantine/core";

interface TicketVolumeDetailInputProps {
  ticket: LopTicket | null;
}

export default function TicketVolumeDetailInput({
  ticket,
}: TicketVolumeDetailInputProps) {
  return (
    <>
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
    </>
  );
}
