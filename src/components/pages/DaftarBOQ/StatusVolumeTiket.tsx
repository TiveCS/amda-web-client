import { LopTicket } from "@api/types/tickets";
import { Badge } from "@mantine/core";

interface StatusVolumeTiketProps {
  ticket: LopTicket;
}

export default function StatusVolumeTiket({ ticket }: StatusVolumeTiketProps) {
  const isCompleted =
    ticket.volumes.length > 0 &&
    ticket.volumes.every((volume) => volume.value > 0);

  return (
    <Badge fullWidth color={isCompleted ? "green" : "red"} variant="outline">
      {isCompleted ? "Lengkap" : "Belum Dilengkapi"}
    </Badge>
  );
}
