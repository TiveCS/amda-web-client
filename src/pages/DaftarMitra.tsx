import { getListMitra } from "@api/mitra";
import { MitraResponsePayload } from "@api/types/mitra";
import ButtonAMDA from "@components/ButtonAMDA";
import AddMitraModal from "@components/pages/DaftarMitra/AddMitraModal";
import EditMitraModal from "@components/pages/DaftarMitra/EditMitraModal";
import MitraItemTable from "@components/pages/DaftarMitra/MitraItemTable";
import RemoveMitraModal from "@components/pages/DaftarMitra/RemoveMitraModal";
import { Container, Flex, Grid, Table } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconCirclePlus } from "@tabler/icons-react";
import { useInfiniteQuery } from "@tanstack/react-query";
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

  const getListMitraQuery = useInfiniteQuery({
    queryKey: ["mitra"],
    queryFn: async ({ pageParam = 0 }) =>
      getListMitra({
        search: searchDebounced,
        cursor: pageParam as number,
        limit: 5,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
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

      <Container className="mt-5 font-poppins" fluid>
        <Flex direction={"column"} gap={12}>
          <p className="font-semibold text-left text-xl text-black">
            Daftar Mitra
          </p>

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
                <ButtonAMDA
                  onClick={openAddMitra}
                  leftIcon={<IconCirclePlus />}
                >
                  Add Mitra
                </ButtonAMDA>
              </Flex>
            </Grid.Col>
          </Grid>
        </Flex>
      </Container>

      <Container fluid mt={24} className="max-h-3/4 overflow-y-scroll">
        <Table striped withBorder withColumnBorders>
          <thead>
            <tr>
              <th className="max-w-lg">Nama Mitra</th>
              <th className="w-40">Action</th>
            </tr>
          </thead>
          <tbody>
            {getListMitraQuery.data?.pages.map((group, i) => (
              <React.Fragment key={i}>
                {group.data.map((mitra) => (
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
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </Container>

      <ButtonAMDA
        className="mt-4 ml-4"
        disabled={!getListMitraQuery.hasNextPage}
        onClick={() => getListMitraQuery.fetchNextPage()}
      >
        Load More
      </ButtonAMDA>
    </>
  );
};

export default DaftarMitra;
