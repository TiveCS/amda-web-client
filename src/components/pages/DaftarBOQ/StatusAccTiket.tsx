import { LopTicket } from "@api/types/tickets";
import { Badge, DefaultMantineColor } from "@mantine/core";

interface StatusAccTiketProps {
  ticket: LopTicket;
}

export default function StatusAccTiket({ ticket }: StatusAccTiketProps) {
  const isPending = ticket.acceptStatus === "PENDING";
  const isAccepted = ticket.acceptStatus === "ACCEPTED";
  const isRejected = ticket.acceptStatus === "REJECTED";

  const color: DefaultMantineColor = isPending
    ? "blue"
    : isAccepted
    ? "green"
    : "red";

  return (
    <Badge fullWidth variant="outline" color={color}>
      {isPending && "Menunggu"}
      {isAccepted && "Diterima"}
      {isRejected && "Ditolak"}
    </Badge>
  );
}
