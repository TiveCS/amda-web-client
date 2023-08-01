import { LopTicket } from "@api/types/tickets";
import ButtonAMDA from "@components/ButtonAMDA";
import {
  Alert,
  Flex,
  Modal,
  NumberInput,
  ScrollArea,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";

interface TicketVolumeDetailsReadOnlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: LopTicket | null;
  setSelectedTicket: React.Dispatch<React.SetStateAction<LopTicket | null>>;
}

export default function TicketVolumeDetailsReadOnlyModal({
  ticket,
  isOpen,
  onClose,
  setSelectedTicket,
}: TicketVolumeDetailsReadOnlyModalProps) {
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

        <ScrollArea.Autosize
          offsetScrollbars
          className="max-h-96 mx-auto w-full px-1 mt-2"
        >
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
                  <Text className="font-medium">{volume.designator.name}</Text>
                </Flex>

                <NumberInput min={1} readOnly value={volume.value} />
              </Flex>
            ))}
          </Stack>
        </ScrollArea.Autosize>

        <Flex direction={"column"} gap={"xl"} className="mt-1 mb-4">
          <ButtonAMDA
            variant="filled"
            onClick={() => {
              onClose();
              setSelectedTicket(null);
            }}
          >
            Tutup
          </ButtonAMDA>
        </Flex>
      </Stack>
    </Modal>
  );
}
