import React, { useEffect, useState } from "react";
import { Container, Card, Table, Flex } from "@mantine/core";
import { Calendar } from "@mantine/dates";
import ButtonAMDA from "@components/ButtonAMDA";
import AddAgendaModal from "@components/pages/AgendaTim/AddAgendaModal";
import { useDisclosure } from "@mantine/hooks";
import { IconCirclePlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { getListAgenda } from "@api/agenda";
import { useForm } from "@mantine/form";
import AgendaItemTable from "@components/pages/AgendaTim/AgendaItemTable";
import { AgendaResponsePayload } from "@api/types/agenda";
import RemoveAgendaModal from "@components/pages/AgendaTim/RemoveAgendaModal";
import EditAgendaModal from "@components/pages/AgendaTim/EditAgendaModal";

const AgendaTim: React.FC = () => {
  const [isOpenAddAgendaModal, { open: openAddAgenda, close: closeAddAgenda }] =
    useDisclosure(false);

  const [
    isOpenRemoveAgendaModal,
    { open: openRemoveAgenda, close: closeRemoveAgenda },
  ] = useDisclosure(false);

  const [
    isOpenEditAgendaModal,
    { open: openEditAgenda, close: closeEditAgenda },
  ] = useDisclosure(false);

  const [removeAgenda, setRemoveAgenda] =
    useState<AgendaResponsePayload | null>(null);

  const [editAgenda, setEditAgenda] = useState<AgendaResponsePayload | null>(
    null
  );
  const editAgendaForm = useForm({
    initialValues: {
      title: "",
      basisOfAgenda: "",
      currentDate: new Date(),
      time: "00:00",
      note: "",
      picId: -1,
    },
    validate: {
      title: (value) => (value.trim().length > 0 ? null : "Judul wajib diisi"),
    },
  });

  // Select Date
  const [selected, setSelected] = useState<Date | null>(new Date());

  // Get List Agenda
  const { refetch: refetchListAgenda, ...getListAgendaQuery } = useQuery({
    queryKey: ["agenda"],
    queryFn: async () => {
      if (selected === null) throw new Error("selected kosong");
      const cek = await getListAgenda({
        limit: 5,
        time: selected,
      });
      return cek;
    },
  });

  const handleSelect = (date: Date) => {
    const isSelected = selected?.toDateString() === date.toDateString();
    if (!isSelected) {
      setSelected(date);
    }
  };

  useEffect(() => {
    refetchListAgenda();
  }, [selected]);

  if (getListAgendaQuery.isLoading) return <p>Loading...</p>;

  return (
    <>
      {selected && (
        <AddAgendaModal
          isOpen={isOpenAddAgendaModal}
          closeModal={closeAddAgenda}
          selectedDate={selected}
        />
      )}

      <RemoveAgendaModal
        isOpen={isOpenRemoveAgendaModal}
        closeModal={closeRemoveAgenda}
        agenda={removeAgenda}
        setRemoveAgenda={setRemoveAgenda}
      />

      <EditAgendaModal
        isOpen={isOpenEditAgendaModal}
        closeModal={closeEditAgenda}
        agenda={editAgenda}
        setAgenda={setEditAgenda}
        editForm={editAgendaForm}
      />

      <Container className="mt-5 font-poppins" fluid>
        <p className="font-semibold text-left text-xl text-black">Agenda Tim</p>
      </Container>

      <Container mt={24}>
        <Flex>
          <Container>
            <Card withBorder>
              <Calendar
                getDayProps={(date) => ({
                  selected: selected?.toDateString() === date.toDateString(),
                  onClick: () => handleSelect(date),
                })}
              />
            </Card>
            <ButtonAMDA
              className="mt-4"
              onClick={openAddAgenda}
              leftIcon={<IconCirclePlus />}
            >
              Add Agenda
            </ButtonAMDA>
          </Container>
          <Container fluid className="overflow-y-scroll">
            <Table striped withBorder withColumnBorders>
              <thead>
                <tr>
                  <th className="w-44">Waktu</th>
                  <th className="w-60">Agenda</th>
                  <th className="w-44">Action</th>
                </tr>
              </thead>
              <tbody>
                {getListAgendaQuery.data?.data.map((agenda) => (
                  <AgendaItemTable
                    key={agenda.id}
                    agenda={agenda}
                    editAgendaForm={editAgendaForm}
                    setRemoveAgenda={setRemoveAgenda}
                    setEditAgenda={setEditAgenda}
                    openRemoveAgendaModal={openRemoveAgenda}
                    openEditAgendaModal={openEditAgenda}
                  />
                ))}
              </tbody>
            </Table>
          </Container>
        </Flex>
      </Container>
    </>
  );
};

export default AgendaTim;
