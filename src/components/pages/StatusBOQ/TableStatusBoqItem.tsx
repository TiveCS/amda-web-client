import { LopTicket } from "@api/types/tickets";
import useTicketStatusUpdateForm from "@hooks/useTicketStatusUpdateForm";
import { ActionIcon, Flex, Text, Tooltip } from "@mantine/core";
import { IconCheck, IconEye, IconPhoto, IconX } from "@tabler/icons-react";
import StatusAccTiket from "../DaftarBOQ/StatusAccTiket";

interface TableStatusBoqItemProps {
  ticket: LopTicket;
  updateStatusForm: ReturnType<typeof useTicketStatusUpdateForm>;
  openEvidenceDrawer: () => void;
  openDetailModal: () => void;
  openConfirmModal: () => void;
}

export default function TableStatusBoqItem({
  ticket,
  updateStatusForm,
  openEvidenceDrawer,
  openDetailModal,
  openConfirmModal,
}: TableStatusBoqItemProps) {
  const handleAccept = () => {
    updateStatusForm.setFieldValue("status", "ACCEPTED");
    updateStatusForm.setFieldValue("note", ticket.note ?? null);
    openConfirmModal();
  };

  const handleReject = () => {
    updateStatusForm.setFieldValue("status", "REJECTED");
    updateStatusForm.setFieldValue("note", ticket.note ?? null);
    openConfirmModal();
  };

  return (
    <tr>
      <td>{ticket.identifier}</td>
      <td>{ticket.location}</td>
      <td>
        <Flex justify={"center"} className="group">
          <Tooltip label={`Lihat Volume`}>
            <IconEye
              className="w-5 h-5 group-hover:text-sky-800 group-hover:cursor-pointer"
              onClick={() => openDetailModal()}
            />
          </Tooltip>
        </Flex>
      </td>
      <td>
        <Flex justify={"center"} className="group">
          <Tooltip label={`Lihat Evidence`}>
            <IconPhoto
              className="w-5 h-5 group-hover:text-sky-800 group-hover:cursor-pointer"
              onClick={() => openEvidenceDrawer()}
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
      <td>
        <Flex
          direction={"row"}
          justify={"space-around"}
          align={"center"}
          gap={"lg"}
        >
          <Tooltip label="Terima">
            <ActionIcon
              color="blue"
              variant="light"
              disabled={ticket.acceptStatus === "ACCEPTED"}
              onClick={handleAccept}
            >
              <IconCheck size={"1.25rem"} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Tolak" color="pink">
            <ActionIcon
              color="pink"
              variant="light"
              disabled={ticket.acceptStatus === "REJECTED"}
              onClick={handleReject}
            >
              <IconX size={"1.25rem"} />
            </ActionIcon>
          </Tooltip>
        </Flex>
      </td>
    </tr>
  );
}
