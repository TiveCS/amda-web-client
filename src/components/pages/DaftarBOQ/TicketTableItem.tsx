import { LopTicket } from "@api/types/tickets";
import { Badge, Flex } from "@mantine/core";
import { IconEdit, IconEye } from "@tabler/icons-react";
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
      <td>
        <Flex justify={"center"} className="group">
          <IconEdit
            className="w-5 h-5 group-hover:text-sky-800 group-hover:cursor-pointer"
            onClick={() => openModal(ticket)}
          />
        </Flex>
      </td>
      <td>
        <Badge fullWidth color="red" variant="outline">
          Belum Lengkap
        </Badge>
      </td>
      <td>
        <Flex justify={"center"} className="group">
          <IconEye className="w-5 h-5 group-hover:text-sky-800 group-hover:cursor-pointer" />
        </Flex>
      </td>
      <td>Catatan UT</td>
      <td>
        <Badge fullWidth color="red" variant="outline">
          Belum Acc
        </Badge>
      </td>
    </tr>
  );
}
