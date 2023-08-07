import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Card,
  Table,
  Flex,
  Skeleton,
  ScrollArea,
  Indicator,
  createStyles,
  rem,
} from "@mantine/core";
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

const useStyles = createStyles((theme) => ({
  header: {
    position: "sticky",
    top: 0,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "box-shadow 150ms ease",

    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `${rem(1)} solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[2]
      }`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

const AgendaTim: React.FC = () => {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);

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
    void refetchListAgenda();
  }, [refetchListAgenda, selected]);

  const agendaTotal = useMemo(() => {
    if (!getListAgendaQuery.data?.data) return 0;
    return getListAgendaQuery.data?.data.length;
  }, [getListAgendaQuery.data?.data]);

  const agendaDates = useMemo(() => {
    return (
      getListAgendaQuery.data?.data.map((agenda) => new Date(agenda.time)) || []
    );
  }, [getListAgendaQuery.data?.data]);

  const hasAgenda = (date: Date) => {
    return agendaDates.some(
      (agendaDate) => agendaDate.toDateString() === date.toDateString()
    );
  };

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

      <Container mt={24} fluid>
        <Flex justify={"space-between"}>
          <Flex direction={"column"}>
            <Card withBorder>
              <Calendar
                locale="id-ID"
                getDayProps={(date) => ({
                  selected: selected?.toDateString() === date.toDateString(),
                  onClick: () => handleSelect(date),
                })}
                static
                renderDay={(date) => {
                  const day = date.getDate();
                  const isActive = hasAgenda(date);
                  return (
                    <Indicator
                      size={6}
                      color="red"
                      offset={-2}
                      disabled={!isActive}
                    >
                      <div>{day}</div>
                    </Indicator>
                  );
                }}
              />
            </Card>
            <ButtonAMDA
              className="mt-4 w-fit"
              onClick={openAddAgenda}
              leftIcon={<IconCirclePlus />}
            >
              Add Agenda
            </ButtonAMDA>
          </Flex>

          <ScrollArea.Autosize
            className="max-h-[50%]"
            h={400}
            onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
          >
            <Skeleton
              visible={
                getListAgendaQuery.isLoading || getListAgendaQuery.isFetching
              }
            >
              <Table striped withBorder withColumnBorders>
                <thead
                  className={cx(classes.header, {
                    [classes.scrolled]: scrolled,
                  })}
                >
                  <tr>
                    <th className="w-32">Waktu</th>
                    <th className="w-40">Agenda</th>
                    <th className="w-40">PIC</th>
                    <th className="w-40">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {agendaTotal === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center">
                        <p>Tidak ada agenda</p>
                      </td>
                    </tr>
                  )}

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
            </Skeleton>
          </ScrollArea.Autosize>
        </Flex>
      </Container>
    </>
  );
};

export default AgendaTim;
