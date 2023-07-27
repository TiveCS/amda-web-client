import { LopTicket } from "@api/types/tickets";
import ButtonAMDA from "@components/ButtonAMDA";
import { IconEdit } from "@tabler/icons-react";
import StatusVolumeTiket from "./StatusVolumeTiket";

interface TicketTableItemProps {
  ticket: LopTicket;
  openModal: (ticket: LopTicket) => void;
}

export default function TicketTableItem({
  ticket,
  openModal,
}: TicketTableItemProps) {
  return (
    <tr>
      <td>{ticket.identifier}</td>
      <td>{ticket.location}</td>
      <td>
        <StatusVolumeTiket ticket={ticket} />
      </td>
      <td className="w-20">
        <ButtonAMDA variant="white" onClick={() => openModal(ticket)}>
          <IconEdit size={20} />
        </ButtonAMDA>
      </td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  );
}
