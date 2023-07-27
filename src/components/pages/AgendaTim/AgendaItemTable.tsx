import { AgendaResponsePayload } from "@api/types/agenda";
import ButtonAMDA from "@components/ButtonAMDA";
import { Flex } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconEdit, IconTrash } from "@tabler/icons-react";

interface AgendaItemTableProps {
  agenda: AgendaResponsePayload;
  setRemoveAgenda: React.Dispatch<
    React.SetStateAction<AgendaResponsePayload | null>
  >;
  setEditAgenda: React.Dispatch<
    React.SetStateAction<AgendaResponsePayload | null>
  >;
  openRemoveAgendaModal: () => void;
  openEditAgendaModal: () => void;
  editAgendaForm: UseFormReturnType<
    {
      title: string;
      basisOfAgenda: string;
      currentDate: Date;
      time: string;
      note: string;
      picId: number;
    },
    (values: {
      title: string;
      basisOfAgenda: string;
      currentDate: Date;
      time: string;
      note: string;
      picId: number;
    }) => {
      title: string;
      basisOfAgenda: string;
      currentDate: Date;
      time: string;
      note: string;
      picId: number;
    }
  >;
}

export default function UserItemTable({
  agenda,
  setRemoveAgenda: setRemoveAgenda,
  setEditAgenda: setEditAgenda,
  editAgendaForm: editAgendaForm,
  openRemoveAgendaModal: openRemoveAgendaModal,
  openEditAgendaModal: openEditAgendaModal,
}: AgendaItemTableProps) {
  return (
    <tr>
      <td>{agenda.time.toString()}</td>
      <td>{agenda.title}</td>
      <td className="w-40">
        <Flex direction={"row"} justify={"space-between"}>
          <ButtonAMDA
            variant="white"
            onClick={() => {
              setEditAgenda(agenda);
              editAgendaForm.setValues({
                title: agenda.title,
                basisOfAgenda: agenda.basisOfAgenda,
                currentDate: agenda.time,
                time: `${agenda.time.getHours
                  .toString()
                  .padStart(2, "0")}:${agenda.time.getMinutes
                  .toString()
                  .padStart(2, "0")}:`,
                note: agenda.note,
                picId: agenda.picId,
              });
              openEditAgendaModal();
            }}
          >
            <IconEdit></IconEdit>
          </ButtonAMDA>
          <ButtonAMDA
            variant="white"
            onClick={() => {
              setRemoveAgenda(agenda);
              openRemoveAgendaModal();
            }}
          >
            <IconTrash></IconTrash>
          </ButtonAMDA>
        </Flex>
      </td>
    </tr>
  );
}
