import { LopTicket } from "@api/types/tickets";
import StatusVolumeTiket from "./StatusVolumeTiket";
import ButtonAMDA from "@components/ButtonAMDA";
import { IconEdit } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import TicketDetailModalContent from "./TicketDetailModalContent";

interface TicketTableItemProps {
  ticket: LopTicket;
}

export default function TicketTableItem({ ticket }: TicketTableItemProps) {
  return (
    <tr>
      <td>{ticket.identifier}</td>
      <td>{ticket.location}</td>
      <td>
        <StatusVolumeTiket />
      </td>
      <td className="w-20">
        <ButtonAMDA
          variant="white"
          onClick={() =>
            modals.open({
              title: "Detail Tiket",
              size: "lg",
              children: <TicketDetailModalContent ticket={ticket} />,
            })
          }
        >
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
