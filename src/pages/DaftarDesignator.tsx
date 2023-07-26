import { getListDesignator } from "@api/designators";
import { Designator } from "@api/types/designators";
import ButtonAMDA from "@components/ButtonAMDA";
import SearchBar from "@components/SearchBar/SearchBar";
import AddDesignatorModal from "@components/pages/DaftarDesignator/AddDesignatorModal";
import EditDesignatorModal from "@components/pages/DaftarDesignator/EditDesignatorModal";
import TableDesignatorItem from "@components/pages/DaftarDesignator/TableDesignatorItem";
import useDesignatorForm from "@hooks/useDesignatorForm";
import useRemoveDesignatorMutation from "@hooks/useRemoveDesignatorMutation";
import { Container, Flex, Grid, ScrollArea, Table, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

const DaftarDesignator = () => {
  const searchForm = useForm({ initialValues: { search: "" } });
  const [searchDebounced] = useDebouncedValue(searchForm.values.search, 500);

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
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  useEffect(() => {
    void refetchDesignatorList();
  }, [searchDebounced, refetchDesignatorList]);

  return (
    <>
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
              <ButtonAMDA
                variant="outline"
                disabled={selectedDesignators.length !== 1}
                onClick={openEditDesignator}
              >
                <IconEdit />
              </ButtonAMDA>
              <ButtonAMDA
                variant="outline"
                disabled={selectedDesignators.length === 0}
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
              <ButtonAMDA leftIcon={<IconPlus />} onClick={openAddDesignator}>
                Add Designator
              </ButtonAMDA>
            </Flex>
          </Grid.Col>
        </Grid>
      </Container>

      <ScrollArea.Autosize className="max-h-[60%] px-4 w-full">
        <Table striped withColumnBorders withBorder verticalSpacing={"sm"}>
          <thead>
            <tr>
              <th>Designator</th>
              <th className="w-8">#</th>
              <th>Jenis Pekerjaan</th>
              <th>Tipe</th>
              <th>Satuan</th>
              <th>Harga Satuan</th>
            </tr>
          </thead>
          <tbody>
            {designatorList?.pages.map((page, index) => (
              <React.Fragment key={index}>
                {page.data.map((designator) => (
                  <TableDesignatorItem
                    key={designator.id}
                    designator={designator}
                    updateEditDesignatorForm={updateEditDesignatorForm}
                    setSelectedDesignators={setSelectedDesignators}
                    isSelected={selectedDesignators.includes(designator)}
                  />
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </ScrollArea.Autosize>

      <ButtonAMDA
        className="ml-4 mt-4"
        disabled={!getListDesingatorQuery.hasNextPage}
        onClick={getListDesingatorQuery.fetchNextPage}
        loading={getListDesingatorQuery.isFetching}
      >
        Load More
      </ButtonAMDA>
    </>
  );
};

export default DaftarDesignator;