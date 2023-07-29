import { LopTicket } from "@api/types/tickets";
import { Flex } from "@mantine/core";
import { IconEdit, IconEye } from "@tabler/icons-react";
import StatusAccTiket from "./StatusAccTiket";
import StatusEvidenceTiket from "./StatusEvidenceTiket";
import StatusVolumeTiket from "./StatusVolumeTiket";

interface TicketTableItemProps {
  ticket: LopTicket;
  openModal: (ticket: LopTicket) => void;
  openEvidenceDrawer: (ticket: LopTicket) => void;
}

export default function TicketTableItem({
  ticket,
  openModal,
  openEvidenceDrawer,
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
        <StatusEvidenceTiket ticket={ticket} />
      </td>
      <td>
        <Flex justify={"center"} className="group">
          <IconEye
            onClick={() => openEvidenceDrawer(ticket)}
            className="w-5 h-5 group-hover:text-sky-800 group-hover:cursor-pointer"
          />
        </Flex>
      </td>
      <td>Catatan UT</td>
      <td>
        <StatusAccTiket ticket={ticket} />
      </td>
    </tr>
  );
}
