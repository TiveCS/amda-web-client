import { LopTicket } from "@api/types/tickets";
import { Flex, Text, Tooltip } from "@mantine/core";
import { IconEdit, IconEye } from "@tabler/icons-react";
import StatusAccTiket from "./StatusAccTiket";
import StatusEvidenceTiket from "./StatusEvidenceTiket";
import StatusVolumeTiket from "./StatusVolumeTiket";
import { useMemo } from "react";

interface TicketTableItemProps {
  ticket: LopTicket;
  openModal: (ticket: LopTicket) => void;
  openEvidenceDrawer: (ticket: LopTicket) => void;
  hasCRUDAccess: boolean;
  isAdminMitra: boolean;
  isAdminTA: boolean;
}

export default function TicketTableItem({
  ticket,
  openModal,
  openEvidenceDrawer,
  hasCRUDAccess,
  isAdminMitra,
  isAdminTA,
}: TicketTableItemProps) {
  const isAccepted = useMemo(() => {
    return ticket?.acceptStatus === "ACCEPTED";
  }, [ticket?.acceptStatus]);

  const isCanEdit = useMemo(() => {
    return !isAccepted && hasCRUDAccess;
  }, [hasCRUDAccess, isAccepted]);

  const isMitraCanEdit = useMemo(() => {
    return isAdminMitra && ticket?.activity.isForMitra;
  }, [isAdminMitra, ticket?.activity.isForMitra]);

  const isTACanEdit = useMemo(() => {
    return isAdminTA && !ticket?.activity.isForMitra;
  }, [isAdminTA, ticket?.activity.isForMitra]);

  const isAllowEdit = useMemo(() => {
    if (isAdminMitra) return isCanEdit && isMitraCanEdit;
    if (isAdminTA) return isCanEdit && isTACanEdit;

    return isCanEdit;
  }, [isAdminMitra, isAdminTA, isCanEdit, isMitraCanEdit, isTACanEdit]);

  return (
    <tr>
      <td>{ticket.identifier}</td>
      <td>{ticket.location}</td>
      <td>
        <StatusVolumeTiket ticket={ticket} />
      </td>
      <td>
        <Flex justify={"center"} className="group">
          {isAccepted || !isAllowEdit ? (
            <Tooltip label={"Lihat Detail Volume"}>
              <IconEye
                className="w-5 h-5 group-hover:text-sky-800 group-hover:cursor-pointer"
                onClick={() => openModal(ticket)}
              />
            </Tooltip>
          ) : (
            <Tooltip label={"Edit Volume"}>
              <IconEdit
                className="w-5 h-5 group-hover:text-sky-800 group-hover:cursor-pointer"
                onClick={() => openModal(ticket)}
              />
            </Tooltip>
          )}
        </Flex>
      </td>
      <td>
        <StatusEvidenceTiket ticket={ticket} />
      </td>
      <td>
        <Flex justify={"center"} className="group">
          {isAccepted || !isAllowEdit ? (
            <Tooltip label="Lihat Evidence">
              <IconEye
                onClick={() => openEvidenceDrawer(ticket)}
                className="w-5 h-5 group-hover:text-sky-800 group-hover:cursor-pointer"
              />
            </Tooltip>
          ) : (
            <Tooltip label={"Edit Evidence"}>
              <IconEdit
                onClick={() => openEvidenceDrawer(ticket)}
                className="w-5 h-5 group-hover:text-sky-800 group-hover:cursor-pointer"
              />
            </Tooltip>
          )}
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
