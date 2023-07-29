import { LopTicket } from "@api/types/tickets";
import { Badge } from "@mantine/core";

interface StatusAccTiketProps {
  ticket: LopTicket;
}

export default function StatusAccTiket({ ticket }: StatusAccTiketProps) {
  const isAccepted = ticket.acceptedAt !== null;

  return (
    <Badge variant="outline" color={isAccepted ? "blue" : "red"}>
      {isAccepted ? "Sudah Acc" : "Belum Acc"}
    </Badge>
  );
}
