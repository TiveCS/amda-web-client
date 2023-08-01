import { LopTicket } from "@api/types/tickets";
import { Flex, Text, Tooltip } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
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
          <Tooltip label={"Edit Volume"}>
            <IconEdit
              className="w-5 h-5 group-hover:text-sky-800 group-hover:cursor-pointer"
              onClick={() => openModal(ticket)}
            />
          </Tooltip>
        </Flex>
      </td>
      <td>
        <StatusEvidenceTiket ticket={ticket} />
      </td>
      <td>
        <Flex justify={"center"} className="group">
          <Tooltip label={"Edit Evidence"}>
            <IconEdit
              onClick={() => openEvidenceDrawer(ticket)}
              className="w-5 h-5 group-hover:text-sky-800 group-hover:cursor-pointer"
            />
          </Tooltip>
        </Flex>
      </td>
      <td>
        {ticket.note ? (
          <Text color="dark" truncate>
            {ticket.note}
          </Text>
        ) : (
          <Text color="gray" truncate>
            Tidak ada catatan.
          </Text>
        )}
      </td>
      <td>
        <StatusAccTiket ticket={ticket} />
      </td>
    </tr>
  );
}
