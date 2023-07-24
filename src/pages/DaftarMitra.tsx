import { getListMitra } from "@api/mitra";
import { MitraResponsePayload } from "@api/types/mitra";
import ButtonAMDA from "@components/ButtonAMDA";
import AddMitraModal from "@components/pages/DaftarMitra/AddMitraModal";
import EditMitraModal from "@components/pages/DaftarMitra/EditMitraModal";
import MitraItemTable from "@components/pages/DaftarMitra/MitraItemTable";
import RemoveMitraModal from "@components/pages/DaftarMitra/RemoveMitraModal";
import { Card, Container, Flex, Grid, Table } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconCirclePlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar/SearchBar";

const DaftarMitra: React.FC = () => {
  const searchForm = useForm({
    initialValues: {
      search: "",
    },
  });
  const [searchDebounced] = useDebouncedValue(searchForm.values.search, 500);

  const [isOpenAddMitraModal, { open: openAddMitra, close: closeAddMitra }] =
    useDisclosure(false);

  const [
    isOpenRemoveMitraModal,
    { open: openRemoveMitra, close: closeRemoveMitra },
  ] = useDisclosure(false);

  const [isOpenEditMitraModal, { open: openEditMitra, close: closeEditMitra }] =
    useDisclosure(false);

  const [removeMitra, setRemoveMitra] = useState<MitraResponsePayload | null>(
    null
  );

  const [editMitra, setEditMitra] = useState<MitraResponsePayload | null>(null);
  const editMitraForm = useForm({
    initialValues: {
      nama: "",
    },
    validate: {
      nama: (value) =>
        value.trim().length > 0 ? null : "Nama mitra tidak boleh kosong",
    },
  });

  const getListMitraQuery = useQuery({
    queryKey: ["mitra"],
    queryFn: async () =>
      getListMitra({
        search: searchDebounced,
      }),
  });

  useEffect(() => {
    void getListMitraQuery.refetch();
  }, [searchDebounced, getListMitraQuery]);

  if (getListMitraQuery.isLoading) return <p>Loading...</p>;

  return (
    <>
      <AddMitraModal isOpen={isOpenAddMitraModal} closeModal={closeAddMitra} />

      <RemoveMitraModal
        isOpen={isOpenRemoveMitraModal}
        closeModal={closeRemoveMitra}
        mitra={removeMitra}
        setRemoveMitra={setRemoveMitra}
      />

      <EditMitraModal
        isOpen={isOpenEditMitraModal}
        closeModal={closeEditMitra}
        mitra={editMitra}
        setMitra={setEditMitra}
        editForm={editMitraForm}
      />

      <Container className="mt-8 font-poppins" fluid>
        <p className="font-semibold text-xl text-black">Daftar Mitra</p>
      </Container>

      <Container className="mt-5 font-poppins" fluid>
        <Grid justify="space-between" align="flex-start" columns={12}>
          <Grid.Col span={7}>
            <SearchBar searchForm={searchForm} />
          </Grid.Col>
          <Grid.Col span={4}>
            <Flex
              gap={"md"}
              direction={"row"}
              align={"center"}
              justify={"flex-end"}
            >
              <ButtonAMDA onClick={openAddMitra} leftIcon={<IconCirclePlus />}>
                Add Mitra
              </ButtonAMDA>
            </Flex>
          </Grid.Col>
        </Grid>
      </Container>

      <Container fluid>
        <Card withBorder className="mt-4 overflow-y-scroll max-h-96">
          <Table striped withBorder withColumnBorders>
            <thead>
              <tr>
                <th className="max-w-lg">Nama Mitra</th>
                <th className="w-40">Action</th>
              </tr>
            </thead>
            <tbody>
              {getListMitraQuery.data?.data?.map((mitra) => (
                <MitraItemTable
                  key={mitra.id}
                  mitra={mitra}
                  editMitraForm={editMitraForm}
                  setRemoveMitra={setRemoveMitra}
                  setEditMitra={setEditMitra}
                  openRemoveMitraModal={openRemoveMitra}
                  openEditMitraModal={openEditMitra}
                />
              ))}
            </tbody>
          </Table>
        </Card>
      </Container>
    </>
  );
};

export default DaftarMitra;
