import { LopTicket } from "@api/types/tickets";
import { Badge } from "@mantine/core";

interface StatusEvidenceTiketProps {
  ticket: LopTicket;
}

export default function StatusEvidenceTiket({
  ticket,
}: StatusEvidenceTiketProps) {
  const { afterKey, beforeKey, onProgressKey } = ticket.evidence;

  const isComplete = afterKey && beforeKey && onProgressKey;

  return (
    <Badge fullWidth color={isComplete ? "green" : "red"} variant="outline">
      {isComplete ? "Lengkap" : "Belum Lengkap"}
    </Badge>
  );
}
