import { getListSto } from "@api/sto";
import { StoResponsePayload } from "@api/types/sto";
import ButtonAMDA from "@components/ButtonAMDA";
import AddStoModal from "@components/pages/DaftarSTO/AddStoModal";
import EditStoModal from "@components/pages/DaftarSTO/EditStoModal";
import StoItemTable from "@components/pages/DaftarSTO/StoItemTable";
import RemoveStoModal from "@components/pages/DaftarSTO/RemoveStoModal";
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
import { checkRoleAllowed } from "src/utils";

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

const DaftarSto: React.FC = () => {
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
  const isAllowCRUD = checkRoleAllowed(role, {
    whiteListedRoles: ["ta-maintenance"],
  });

  const [isOpenAddStoModal, { open: openAddSto, close: closeAddSto }] =
    useDisclosure(false);

  const [isOpenRemoveStoModal, { open: openRemoveSto, close: closeRemoveSto }] =
    useDisclosure(false);

  const [isOpenEditStoModal, { open: openEditSto, close: closeEditSto }] =
    useDisclosure(false);

  const [removeSto, setRemoveSto] = useState<StoResponsePayload | null>(null);

  const [editSto, setEditSto] = useState<StoResponsePayload | null>(null);
  const editStoForm = useForm({
    initialValues: {
      nama: "",
    },
    validate: {
      nama: (value) =>
        value.trim().length > 0 ? null : "Nama STO tidak boleh kosong",
    },
  });

  const { refetch: refetchListStoQuery, ...getListStoQuery } = useInfiniteQuery(
    {
      queryKey: ["sto"],
      queryFn: async ({ pageParam = 0 }) =>
        getListSto({
          search: searchDebounced,
          cursor: pageParam as number,
          take: 15,
        }),
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  useEffect(() => {
    void refetchListStoQuery();
  }, [searchDebounced, refetchListStoQuery]);

  const stoTotal = useMemo(() => {
    return getListStoQuery.data?.pages.reduce(
      (acc, curr) => acc + curr.data.length,
      0
    );
  }, [getListStoQuery.data?.pages]);

  return (
    <>
      <AddStoModal isOpen={isOpenAddStoModal} closeModal={closeAddSto} />

      <RemoveStoModal
        isOpen={isOpenRemoveStoModal}
        closeModal={closeRemoveSto}
        sto={removeSto}
        setRemoveSto={setRemoveSto}
      />

      <EditStoModal
        isOpen={isOpenEditStoModal}
        closeModal={closeEditSto}
        sto={editSto}
        setSto={setEditSto}
        editForm={editStoForm}
      />

      <Container className="mt-5 font-poppins" fluid>
        <Flex direction={"column"} gap={12}>
          <p className="font-semibold text-left text-xl text-black">
            Daftar STO
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
                {isAllowCRUD && (
                  <ButtonAMDA
                    onClick={openAddSto}
                    leftIcon={<IconCirclePlus />}
                    disabled={!isAllowCRUD}
                  >
                    Add STO
                  </ButtonAMDA>
                )}
              </Flex>
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
          visible={getListStoQuery.isFetching || getListStoQuery.isLoading}
        >
          <Table striped withBorder withColumnBorders>
            <thead
              className={cx(classes.header, { [classes.scrolled]: scrolled })}
            >
              <tr>
                <th className="max-w-lg">Nama STO</th>
                <th className="max-w-sm">Jumlah Kegiatan</th>
                {isAllowCRUD && <th className="w-40">Action</th>}
              </tr>
            </thead>
            <tbody>
              {stoTotal === 0 && (
                <tr>
                  <td colSpan={2} className="text-center">
                    <p>Tidak ada STO</p>
                  </td>
                </tr>
              )}

              {getListStoQuery.data?.pages.map((group, i) => (
                <React.Fragment key={i}>
                  {group.data.map((sto) => (
                    <StoItemTable
                      key={sto.id}
                      sto={sto}
                      editStoForm={editStoForm}
                      setRemoveSto={setRemoveSto}
                      setEditSto={setEditSto}
                      openRemoveStoModal={openRemoveSto}
                      openEditStoModal={openEditSto}
                      hasCRUDAccess={isAllowCRUD}
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
          disabled={!getListStoQuery.hasNextPage}
          onClick={() => getListStoQuery.fetchNextPage()}
        >
          Load More
        </ButtonAMDA>

        <Text>
          Menampilkan <strong>{stoTotal}</strong> STO
        </Text>
      </Flex>
    </>
  );
};

export default DaftarSto;
