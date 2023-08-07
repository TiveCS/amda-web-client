import { getLops } from "@api/lops";
import { Lop, LopActivity } from "@api/types/lops";
import ButtonAMDA from "@components/ButtonAMDA";
import AddKegiatanModal from "@components/pages/DaftarKegiatan/AddKegiatanModal";
import AddLopModal from "@components/pages/DaftarKegiatan/AddLopModal";
import EditKegiatanModal from "@components/pages/DaftarKegiatan/EditKegiatanModal";
import FilterKegiatanModal from "@components/pages/DaftarKegiatan/FilterKegiatanModal";
import LopTableItem from "@components/pages/DaftarKegiatan/LopTableItem";
import RemoveActivityModal from "@components/pages/DaftarKegiatan/RemoveActivityModal";
import RemoveLopModal from "@components/pages/DaftarKegiatan/RemoveLopModal";
import useActivityForm from "@hooks/useActivityForm";
import {
  Container,
  Flex,
  Grid,
  ScrollArea,
  Skeleton,
  Table,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import {
  IconCirclePlus,
  IconEdit,
  IconFilter,
  IconTrash,
} from "@tabler/icons-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo } from "react";
import SearchBar from "../components/SearchBar/SearchBar";
import useFilterKegiatan from "@hooks/useFilterKegiatan";
import { checkRoleAllowed } from "src/utils";
import { useProfileStore } from "@zustand/profileStore";
import { RoleType } from "../types";

const DaftarKegiatan: React.FC = () => {
  const searchForm = useForm({
    initialValues: {
      search: "",
    },
  });
  const [searchDebounced] = useDebouncedValue(searchForm.values.search, 500);

  const { profile } = useProfileStore();
  const role = profile?.role.slug as unknown as RoleType;
  const isAllowCRUD = useMemo(() => {
    return checkRoleAllowed(role, {
      whiteListedRoles: ["ta-maintenance"],
    });
  }, [role]);
  const isAdminMitra = useMemo(() => {
    return role === "admin-mitra";
  }, [role]);

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

  const { refetch: refetchListLopQuery, ...getListLopQuery } = useInfiniteQuery(
    {
      queryKey: ["lops"],
      queryFn: async ({ pageParam = 0 }) => {
        const { mitra, sto, workType } = filterForm.form.values;

        let mitraIds = mitra.map((m) => parseInt(m));
        const stoIds = sto.map((s) => parseInt(s));

        if (isAdminMitra) {
          mitraIds = [profile?.mitra.id ?? 0];
        }

        const lops = await getLops({
          search: searchDebounced,
          cursor: pageParam as number,
          take: 5,
          filter: {
            mitraIds,
            stoIds,
            workType: workType ? workType : undefined,
          },
        });

        return { nextCursor: lops.nextCursor, lops: lops.data };
      },
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  useEffect(() => {
    void refetchListLopQuery();
  }, [refetchListLopQuery, searchDebounced]);

  const lopsTotal = useMemo(() => {
    return getListLopQuery.data?.pages.reduce(
      (acc, curr) => acc + curr.lops.length,
      0
    );
  }, [getListLopQuery.data?.pages]);

  const filterForm = useFilterKegiatan({
    mitraIds:
      isAdminMitra && profile?.mitra.id
        ? [profile.mitra.id.toString()]
        : undefined,
  });

  const [
    isFilterModalOpen,
    { open: openFilterModal, close: closeFilterModal },
  ] = useDisclosure(false);

  const filter = () => {
    void refetchListLopQuery();
    closeFilterModal();
  };

  const activityTotal = useMemo(() => {
    return getListLopQuery.data?.pages.reduce(
      (acc, curr) =>
        acc +
        curr.lops.reduce(
          (acc2, curr2) => acc2 + (curr2.activities?.length ?? 0),
          0
        ),
      0
    );
  }, [getListLopQuery.data?.pages]);

  return (
    <>
      <FilterKegiatanModal
        isAdminMitra={isAdminMitra}
        isOpen={isFilterModalOpen}
        closeModal={closeFilterModal}
        filter={filter}
        filterForm={filterForm.form}
      />

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
              <ButtonAMDA variant="outline" onClick={openFilterModal}>
                <IconFilter></IconFilter>
              </ButtonAMDA>{" "}
              {isAllowCRUD && (
                <>
                  <ButtonAMDA
                    variant="outline"
                    onClick={() => {
                      if (selectedActivities.length !== 1) return;
                      setEditActivity(selectedActivities[0]);
                      updateEditForm(selectedActivities[0]);
                      openEditActivity();
                    }}
                    disabled={selectedActivities.length !== 1 || !isAllowCRUD}
                  >
                    <IconEdit></IconEdit>
                  </ButtonAMDA>
                  <ButtonAMDA
                    variant="outline"
                    onClick={openRemoveActivity}
                    disabled={selectedActivities.length === 0 || !isAllowCRUD}
                  >
                    <IconTrash></IconTrash>
                  </ButtonAMDA>{" "}
                  <ButtonAMDA
                    variant="outline"
                    onClick={openAddLOP}
                    leftIcon={<IconCirclePlus />}
                    disabled={!isAllowCRUD}
                  >
                    Add LOP
                  </ButtonAMDA>
                  <ButtonAMDA
                    onClick={openAddKegiatan}
                    leftIcon={<IconCirclePlus />}
                    disabled={!isAllowCRUD}
                  >
                    Add Kegiatan
                  </ButtonAMDA>
                </>
              )}
            </Flex>
          </Grid.Col>
        </Grid>
      </Container>

      <ScrollArea.Autosize className="max-h-1/2 mt-8 ml-4" offsetScrollbars>
        <Skeleton
          visible={getListLopQuery.isFetching || getListLopQuery.isLoading}
        >
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
              {lopsTotal === 0 && (
                <tr>
                  <td colSpan={7} className="text-center">
                    Tidak ada data
                  </td>
                </tr>
              )}

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
                      hasCRUDAccess={isAllowCRUD}
                    />
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        </Skeleton>
      </ScrollArea.Autosize>

      <Flex justify={"space-between"} className="mt-4 mx-3">
        <Flex gap={16} align={"center"}>
          <ButtonAMDA
            disabled={!getListLopQuery.hasNextPage}
            loading={getListLopQuery.isFetching || getListLopQuery.isLoading}
            onClick={getListLopQuery.fetchNextPage}
          >
            Load More
          </ButtonAMDA>

          <Text>
            Menampilan <strong>{lopsTotal}</strong> LOP dan{" "}
            <strong>{activityTotal}</strong> Kegiatan
          </Text>
        </Flex>
      </Flex>
    </>
  );
};

export default DaftarKegiatan;
