import { getListDesignator } from "@api/designators";
import { Designator } from "@api/types/designators";
import ButtonAMDA from "@components/ButtonAMDA";
import SearchBar from "@components/SearchBar/SearchBar";
import AddDesignatorModal from "@components/pages/DaftarDesignator/AddDesignatorModal";
import EditDesignatorModal from "@components/pages/DaftarDesignator/EditDesignatorModal";
import ImportDesignatorModal from "@components/pages/DaftarDesignator/ImportDesignatorModal";
import TableDesignatorItem from "@components/pages/DaftarDesignator/TableDesignatorItem";
import useDesignatorForm from "@hooks/useDesignatorForm";
import useRemoveDesignatorMutation from "@hooks/useRemoveDesignatorMutation";
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
import { modals } from "@mantine/modals";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useProfileStore } from "@zustand/profileStore";
import React, { useEffect, useMemo, useState } from "react";
import { checkRoleAllowed } from "../utils";
import { RoleType } from "../types";

const DaftarDesignator = () => {
  const searchForm = useForm({ initialValues: { search: "" } });
  const [searchDebounced] = useDebouncedValue(searchForm.values.search, 500);

  const { profile } = useProfileStore();
  const role = profile?.role.slug as unknown as RoleType;
  const isAllowCRUD = checkRoleAllowed(role, {
    whiteListedRoles: ["ta-maintenance"],
  });

  const [selectedDesignators, setSelectedDesignators] = useState<Designator[]>(
    []
  );

  const removeDesignatorMutation = useRemoveDesignatorMutation({
    selectedDesignators,
    setSelectedDesignators,
  });

  const { form: editDesignatorForm, updateForm: updateEditDesignatorForm } =
    useDesignatorForm({});

  const [
    openedAddDesignator,
    { open: openAddDesignator, close: closeAddDesignator },
  ] = useDisclosure(false);

  const [
    openedEditDesignator,
    { open: openEditDesignator, close: closeEditDesignator },
  ] = useDisclosure(false);

  const [
    openedImportModal,
    { open: openImportModal, close: closeImportModal },
  ] = useDisclosure(false);

  const {
    data: designatorList,
    refetch: refetchDesignatorList,
    ...getListDesingatorQuery
  } = useInfiniteQuery({
    queryKey: ["designators"],
    queryFn: async ({ pageParam = 0 }) =>
      getListDesignator({
        search: searchDebounced,
        cursor: pageParam as number,
        take: 30,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  useEffect(() => {
    void refetchDesignatorList();
  }, [searchDebounced, refetchDesignatorList]);

  const designatorTotal = useMemo(() => {
    if (!designatorList) return 0;
    return designatorList.pages.reduce(
      (acc, page) => acc + page.data.length,
      0
    );
  }, [designatorList]);

  return (
    <>
      <ImportDesignatorModal
        onClose={closeImportModal}
        opened={openedImportModal}
      />

      <AddDesignatorModal
        onClose={closeAddDesignator}
        opened={openedAddDesignator}
      />

      <EditDesignatorModal
        form={editDesignatorForm}
        onClose={closeEditDesignator}
        opened={openedEditDesignator}
        designator={selectedDesignators[0]}
        setSelectedDesignators={setSelectedDesignators}
      />

      <Container className="mt-8 mb-4" fluid>
        <p className="font-semibold text-xl ">Daftar Designator</p>
      </Container>

      <Container className="my-4" fluid>
        <Grid justify="space-between">
          <Grid.Col span={6}>
            <SearchBar searchForm={searchForm} />
          </Grid.Col>

          <Grid.Col span={4}>
            <Flex justify={"space-between"} gap={32}>
              {isAllowCRUD && (
                <>
                  <ButtonAMDA
                    variant="outline"
                    disabled={selectedDesignators.length !== 1 || !isAllowCRUD}
                    onClick={openEditDesignator}
                  >
                    <IconEdit />
                  </ButtonAMDA>
                  <ButtonAMDA
                    variant="outline"
                    disabled={selectedDesignators.length === 0 || !isAllowCRUD}
                    onClick={() =>
                      modals.openConfirmModal({
                        title: "Hapus Designator?",
                        labels: { confirm: "Hapus", cancel: "Batal" },
                        confirmProps: { color: "red" },
                        cancelProps: { variant: "white", color: "dark" },
                        centered: true,
                        children: (
                          <>
                            <Text>
                              Apakah anda yakin ingin menghapus{" "}
                              <strong>{selectedDesignators.length}</strong>{" "}
                              Designator?
                            </Text>
                          </>
                        ),
                        onConfirm: () => removeDesignatorMutation.mutate(),
                      })
                    }
                  >
                    <IconTrash />
                  </ButtonAMDA>
                  <ButtonAMDA
                    leftIcon={<IconPlus />}
                    onClick={openAddDesignator}
                    disabled={!isAllowCRUD}
                  >
                    Add Designator
                  </ButtonAMDA>
                </>
              )}
            </Flex>
          </Grid.Col>
        </Grid>
      </Container>

      <ScrollArea.Autosize className="max-h-[60%] px-4 w-full">
        <Skeleton visible={getListDesingatorQuery.isFetching}>
          <Table striped withColumnBorders withBorder verticalSpacing={"sm"}>
            <thead>
              <tr>
                <th>Designator</th>
                {isAllowCRUD && <th className="w-8">#</th>}
                <th>Jenis Pekerjaan</th>
                <th>Tipe</th>
                <th>Satuan</th>
                <th>Harga Satuan</th>
              </tr>
            </thead>
            <tbody>
              {designatorTotal === 0 && (
                <tr>
                  <td colSpan={6} className="text-center">
                    <Text>Tidak ditemukan data</Text>
                  </td>
                </tr>
              )}

              {designatorList?.pages.map((page, index) => (
                <React.Fragment key={index}>
                  {page.data.map((designator) => (
                    <TableDesignatorItem
                      key={designator.id}
                      designator={designator}
                      updateEditDesignatorForm={updateEditDesignatorForm}
                      setSelectedDesignators={setSelectedDesignators}
                      isSelected={selectedDesignators.includes(designator)}
                      hasCRUDAccess={isAllowCRUD}
                    />
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        </Skeleton>
      </ScrollArea.Autosize>

      <Flex
        className="mx-4 mt-6"
        align={"center"}
        direction={"row"}
        justify={"space-between"}
      >
        <Flex align={"center"} gap={"lg"}>
          <ButtonAMDA
            disabled={!getListDesingatorQuery.hasNextPage}
            onClick={getListDesingatorQuery.fetchNextPage}
            loading={getListDesingatorQuery.isFetching}
          >
            Load More
          </ButtonAMDA>

          <Text>
            Menampilkan <strong>{designatorTotal}</strong> designator
          </Text>
        </Flex>

        {isAllowCRUD && (
          <ButtonAMDA
            variant="outline"
            onClick={openImportModal}
            disabled={!isAllowCRUD}
          >
            Import Designator
          </ButtonAMDA>
        )}
      </Flex>
    </>
  );
};

export default DaftarDesignator;
