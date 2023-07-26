import { getLops } from "@api/lops";
import { Lop, LopActivity } from "@api/types/lops";
import ButtonAMDA from "@components/ButtonAMDA";
import AddKegiatanModal from "@components/pages/DaftarKegiatan/AddKegiatanModal";
import AddLopModal from "@components/pages/DaftarKegiatan/AddLopModal";
import EditKegiatanModal from "@components/pages/DaftarKegiatan/EditKegiatanModal";
import LopTableItem from "@components/pages/DaftarKegiatan/LopTableItem";
import RemoveActivityModal from "@components/pages/DaftarKegiatan/RemoveActivityModal";
import RemoveLopModal from "@components/pages/DaftarKegiatan/RemoveLopModal";
import useActivityForm from "@hooks/useActivityForm";
import { Container, Flex, Grid, Table } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import {
  IconCirclePlus,
  IconDownload,
  IconEdit,
  IconFilter,
  IconTrash,
} from "@tabler/icons-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import SearchBar from "../components/SearchBar/SearchBar";

const DaftarKegiatan: React.FC = () => {
  const searchForm = useForm({
    initialValues: {
      search: "",
    },
  });
  const [searchDebounced] = useDebouncedValue(searchForm.values.search, 500);

  const [selectedActivities, setSelectedActivities] = React.useState<
    LopActivity[]
  >([]);

  const [removeLop, setRemoveLop] = React.useState<Lop | null>(null);

  const [editActivity, setEditActivity] = React.useState<LopActivity | null>(
    null
  );

  const { form: editForm, updateForm: updateEditForm } = useActivityForm({});

  const [
    openedAddKegiatan,
    { open: openAddKegiatan, close: closeAddKegiatan },
  ] = useDisclosure(false);
  const [openedAddLOP, { open: openAddLOP, close: closeAddLOP }] =
    useDisclosure(false);
  const [
    openedRemoveActivity,
    { open: openRemoveActivity, close: closeRemoveActivity },
  ] = useDisclosure(false);
  const [openedRemoveLop, { open: openRemoveLop, close: closeRemoveLop }] =
    useDisclosure(false);

  const [
    openedEditActivity,
    { open: openEditActivity, close: closeEditActivity },
  ] = useDisclosure(false);

  const getListLopQuery = useInfiniteQuery({
    queryKey: ["lops"],
    queryFn: async ({ pageParam = 0 }) => {
      const lops = await getLops({
        search: searchDebounced,
        cursor: pageParam as number,
        take: 5,
      });

      return { nextCursor: lops.nextCursor, lops: lops.data };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  return (
    <>
      <EditKegiatanModal
        isOpen={openedEditActivity}
        closeModal={closeEditActivity}
        currentActivity={editActivity}
        setEditActivity={setEditActivity}
        setSelectedActivities={setSelectedActivities}
        editForm={editForm}
        updateEditForm={updateEditForm}
      />

      <RemoveActivityModal
        isOpen={openedRemoveActivity}
        closeModal={closeRemoveActivity}
        listRemoveActivity={selectedActivities}
        setSelectedActivities={setSelectedActivities}
      />

      <RemoveLopModal
        isOpen={openedRemoveLop}
        closeModal={closeRemoveLop}
        removeLop={removeLop}
        setRemoveLop={setRemoveLop}
      />

      <AddLopModal closeAddLOP={closeAddLOP} openedAddLOP={openedAddLOP} />

      <AddKegiatanModal
        openedAddKegiatan={openedAddKegiatan}
        closeAddKegiatan={closeAddKegiatan}
      />

      <Container className="mt-5" fluid>
        <p className="font-semibold text-xl text-black">Daftar Kegiatan</p>
        <Grid className="mt-2" justify="space-between">
          <Grid.Col span={5}>
            <SearchBar searchForm={searchForm} />
          </Grid.Col>
          <Grid.Col span={6}>
            <Flex justify={"flex-end"} gap={"md"}>
              <ButtonAMDA variant="outline">
                <IconFilter></IconFilter>
              </ButtonAMDA>{" "}
              <ButtonAMDA
                variant="outline"
                onClick={() => {
                  if (selectedActivities.length !== 1) return;
                  setEditActivity(selectedActivities[0]);
                  updateEditForm(selectedActivities[0]);
                  openEditActivity();
                }}
                disabled={selectedActivities.length !== 1}
              >
                <IconEdit></IconEdit>
              </ButtonAMDA>
              <ButtonAMDA
                variant="outline"
                onClick={openRemoveActivity}
                disabled={selectedActivities.length === 0}
              >
                <IconTrash></IconTrash>
              </ButtonAMDA>{" "}
              <ButtonAMDA
                variant="outline"
                onClick={openAddLOP}
                leftIcon={<IconCirclePlus />}
              >
                Add LOP
              </ButtonAMDA>
              <ButtonAMDA
                onClick={openAddKegiatan}
                leftIcon={<IconCirclePlus />}
              >
                Add Kegiatan
              </ButtonAMDA>
            </Flex>
          </Grid.Col>
        </Grid>
      </Container>

      <Container fluid className="overflow-y-scroll max-h-3/4 mt-8">
        <Table striped withBorder withColumnBorders>
          <thead>
            <tr>
              <th>Nama LOP</th>
              <th className="w-10">#</th>
              <th>STO</th>
              <th className="w-48">Jenis Pekerjaan</th>
              <th>No Tiket</th>
              <th>Lokasi Tiket</th>
              <th>Mitra</th>
            </tr>
          </thead>
          <tbody>
            {getListLopQuery.data?.pages.map((group, i) => (
              <React.Fragment key={i}>
                {group.lops.map((lop) => (
                  <LopTableItem
                    key={lop.id}
                    lop={lop}
                    selectedActivities={selectedActivities}
                    openRemoveLop={openRemoveLop}
                    setSelectedActivities={setSelectedActivities}
                    setRemoveLop={setRemoveLop}
                  />
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </Container>

      <Flex justify={"space-between"} className="mt-8 mx-3">
        <Flex gap={16}>
          <ButtonAMDA
            onClick={getListLopQuery.fetchNextPage}
            disabled={!getListLopQuery.hasNextPage}
          >
            Load More
          </ButtonAMDA>
        </Flex>
        <ButtonAMDA leftIcon={<IconDownload />}>Export XLSX</ButtonAMDA>
      </Flex>
    </>
  );
};

export default DaftarKegiatan;
