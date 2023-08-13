import { getListMitra } from "@api/mitra";
import { MitraResponsePayload } from "@api/types/mitra";
import ButtonAMDA from "@components/ButtonAMDA";
import AddMitraModal from "@components/pages/DaftarMitra/AddMitraModal";
import EditMitraModal from "@components/pages/DaftarMitra/EditMitraModal";
import MitraItemTable from "@components/pages/DaftarMitra/MitraItemTable";
import RemoveMitraModal from "@components/pages/DaftarMitra/RemoveMitraModal";
import {
  Container,
  Flex,
  Grid,
  ScrollArea,
  Skeleton,
  Table,
  Text,
  createStyles,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconCirclePlus } from "@tabler/icons-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import SearchBar from "../components/SearchBar/SearchBar";
import { useProfileStore } from "@zustand/profileStore";
import { RoleType } from "../types";

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

const DaftarMitra: React.FC = () => {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);

  const searchForm = useForm({
    initialValues: {
      search: "",
    },
  });
  const [searchDebounced] = useDebouncedValue(searchForm.values.search, 500);

  const { profile } = useProfileStore();
  const role = profile?.role.slug as unknown as RoleType;
  const isAdminMitra = useMemo(() => {
    return role === "admin-mitra";
  }, [role]);

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

  const { refetch: refetchListMitraQuery, ...getListMitraQuery } =
    useInfiniteQuery({
      queryKey: ["mitra"],
      queryFn: async ({ pageParam = 0 }) => {
        const result = await getListMitra({
          search: searchDebounced,
          cursor: pageParam as number,
          limit: 10,
          mitraId: isAdminMitra ? profile?.mitra.id : undefined,
        });

        return result;
      },
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  useEffect(() => {
    void refetchListMitraQuery();
  }, [searchDebounced, refetchListMitraQuery]);

  const mitraTotal = useMemo(() => {
    return getListMitraQuery.data?.pages.reduce(
      (acc, curr) => acc + curr.data.length,
      0
    );
  }, [getListMitraQuery.data?.pages]);

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
              {!isAdminMitra && (
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
              )}
            </Grid.Col>
          </Grid>
        </Flex>
      </Container>

      <ScrollArea.Autosize
        mt={24}
        className="max-h-1/2 ml-4"
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
        <Skeleton
          visible={getListMitraQuery.isFetching || getListMitraQuery.isLoading}
        >
          <Table striped withBorder withColumnBorders>
            <thead
              className={cx(classes.header, { [classes.scrolled]: scrolled })}
            >
              <tr>
                <th className="max-w-lg">Nama Mitra</th>
                <th className="max-w-sm">Jumlah Users</th>
                <th className="max-w-sm">Jumlah Kegiatan</th>
                {!isAdminMitra && <th className="w-36">Action</th>}
              </tr>
            </thead>
            <tbody>
              {mitraTotal === 0 && (
                <tr>
                  <td colSpan={2} className="text-center">
                    <p>Tidak ada mitra</p>
                  </td>
                </tr>
              )}

              {getListMitraQuery.data?.pages.map((group, i) => (
                <React.Fragment key={i}>
                  {group.data.map((mitra) => (
                    <MitraItemTable
                      key={mitra.id}
                      mitra={mitra}
                      isAdminMitra={isAdminMitra}
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
        </Skeleton>
      </ScrollArea.Autosize>

      <Flex direction={"row"} gap={"lg"} align={"center"} className="mt-4 ml-4">
        <ButtonAMDA
          disabled={!getListMitraQuery.hasNextPage}
          onClick={() => getListMitraQuery.fetchNextPage()}
        >
          Load More
        </ButtonAMDA>

        <Text>
          Menampilkan <strong>{mitraTotal}</strong> mitra
        </Text>
      </Flex>
    </>
  );
};

export default DaftarMitra;
