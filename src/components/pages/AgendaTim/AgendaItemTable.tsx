import { AgendaResponsePayload } from "@api/types/agenda";
import { getListUser } from "@api/users";
import { Flex, Tooltip } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

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
  const waktu = new Date(agenda.time);

  const getListUserQuery = useQuery({
    queryKey: ["agenda_item_table_user"],
    queryFn: async () => {
      const result = await getListUser({
        limit: 30,
      });

      return result.data.map((user) => ({
        value: user.id.toString(),
        label: user.name,
      }));
    },
  });

  const user = getListUserQuery.data?.filter(
    (r) => parseInt(r.value) === agenda.picId
  );

  return (
    <tr>
      <td>{dayjs(waktu).format("DD-MM-YYYY HH:mm A")}</td>
      <td>{agenda.title}</td>
      <td>{user !== undefined ? user[0].label : "??"}</td>
      <td className="w-40">
        <Flex gap="xl" justify="center" align="center" direction="row">
          <Tooltip label={"Edit Agenda"}>
            <IconEdit
              onClick={() => {
                setEditAgenda(agenda);
                editAgendaForm.setValues({
                  title: agenda.title,
                  basisOfAgenda: agenda.basisOfAgenda,
                  currentDate: agenda.time,
                  time: `${waktu.getHours().toString().padStart(2, "0")}:${waktu
                    .getMinutes()
                    .toString()
                    .padStart(2, "0")}`,
                  note: agenda.note,
                  picId: agenda.picId,
                });
                openEditAgendaModal();
              }}
              className="w-5 h-5 group-hover:text-sky-800 group-hover:cursor-pointer"
            />
          </Tooltip>
          <Tooltip label={"Remove Agenda"}>
            <IconTrash
              onClick={() => {
                setRemoveAgenda(agenda);
                openRemoveAgendaModal();
              }}
              className="w-5 h-5 group-hover:text-sky-800 group-hover:cursor-pointer"
            />
          </Tooltip>
        </Flex>
      </td>
    </tr>
  );
}
