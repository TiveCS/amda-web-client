import { getListTickets } from "@api/tickets";
import { LopTicket } from "@api/types/tickets";
import ButtonAMDA from "@components/ButtonAMDA";
import FilterDaftarBOQModal from "@components/pages/DaftarBOQ/FilterDaftarBOQModal";
import TicketTableItem from "@components/pages/DaftarBOQ/TicketTableItem";
import TicketVolumeDetailsModal from "@components/pages/DaftarBOQ/TicketVolumeDetailsModal";
import useFilterForm from "@hooks/useFilterForm";
import useVolumeDetailsForm from "@hooks/useVolumeDetailsForm";
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
import { IconDownload, IconFilter } from "@tabler/icons-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo } from "react";
import SearchBar from "../components/SearchBar/SearchBar";
import ExportConfirmModal from "@components/pages/DaftarBOQ/ExportConfirmModal";

const DaftarBOQ: React.FC = () => {
  const searchForm = useForm({
    initialValues: { search: "" },
  });

  const [searchDebounced] = useDebouncedValue(searchForm.values.search, 500);

  const [selectedTicket, setSelectedTicket] = React.useState<LopTicket | null>(
    null
  );

  const filterForm = useFilterForm();

  const {
    refetch: refetchListTicketQuery,
    isFetching: isFetchingListTicketQuery,
    isLoading: isLoadingListTicketQuery,
    data: listTicketQueryData,
    ...getListTicketQuery
  } = useInfiniteQuery({
    queryKey: ["tickets"],
    queryFn: async ({ pageParam = 0 }) =>
      getListTickets({
        cursor: pageParam as number,
        take: 20,
        search: searchDebounced,
        identifier: filterForm.form.values.identifier,
        location: filterForm.form.values.location,
        statusAcc: filterForm.form.values.accStatus,
        evidenceStatus: filterForm.form.values.evidenceStatus,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  useEffect(() => {
    const refetch = async () => {
      await refetchListTicketQuery();
    };

    void refetch();
  }, [refetchListTicketQuery, searchDebounced]);

  const [
    isVolumeDetailsModalOpen,
    { open: openVolumeDetailsModal, close: closeVolumeDetailsModal },
  ] = useDisclosure(false);

  const [
    isFilterModalOpen,
    { open: openFilterModal, close: closeFilterModal },
  ] = useDisclosure(false);

  const [
    isExportModalOpen,
    { open: openExportModal, close: closeExportModal },
  ] = useDisclosure(false);

  const volumeDetailsForm = useVolumeDetailsForm();

  const filter = () => {
    void refetchListTicketQuery();
    closeFilterModal();
  };

  const totalTickets = useMemo(() => {
    if (listTicketQueryData?.pages) {
      return listTicketQueryData.pages.reduce(
        (acc, page) => acc + page.data.length,
        0
      );
    }
    return 0;
  }, [listTicketQueryData?.pages]);

  const handleExportTicket = () => {
    openExportModal();
  };

  return (
    <>
      <ExportConfirmModal
        opened={isExportModalOpen}
        onClose={closeExportModal}
        ticketIdentifiers={
          listTicketQueryData?.pages.flatMap((page) =>
            page.data.map((ticket) => ticket.identifier)
          ) || []
        }
      />

      <TicketVolumeDetailsModal
        selectedTicket={selectedTicket}
        setSelectedTicket={setSelectedTicket}
        isOpen={isVolumeDetailsModalOpen}
        onClose={closeVolumeDetailsModal}
        volumeDetailsForm={volumeDetailsForm}
      />

      <FilterDaftarBOQModal
        isOpen={isFilterModalOpen}
        onClose={closeFilterModal}
        filter={filter}
        filterForm={filterForm.form}
      />

      <Container className="mt-8 font-poppins" fluid>
        <p className="font-semibold text-xl text-black">Daftar BOQ</p>
      </Container>

      <Container className="my-5" fluid>
        <Grid justify="space-between">
          <Grid.Col span={6}>
            <SearchBar searchForm={searchForm} />
          </Grid.Col>

          <Grid.Col span={6}>
            <Flex justify={"flex-start"}>
              <ButtonAMDA
                variant="outline"
                leftIcon={<IconFilter />}
                onClick={openFilterModal}
              >
                Filter
              </ButtonAMDA>
            </Flex>
          </Grid.Col>
        </Grid>
      </Container>

      <ScrollArea.Autosize offsetScrollbars className="max-h-1/2 mx-4">
        <Skeleton
          visible={isFetchingListTicketQuery || isLoadingListTicketQuery}
        >
          <Table striped withBorder withColumnBorders>
            <thead>
              <tr>
                <th className="w-32">ID Tiket</th>
                <th className="w-36">Lokasi Tiket</th>
                <th className="w-36">Status Volume</th>
                <th className="w-8">Detail Volume</th>
                <th className="w-36">Status Evidence</th>
                <th className="w-20">Evidence</th>
                <th>Catatan UT</th>
                <th className="w-24">Status Acc</th>
              </tr>
            </thead>
            <tbody>
              {totalTickets === 0 && (
                <tr>
                  <td colSpan={8}>
                    <Text align="center">Data tiket tidak ditemukan.</Text>
                  </td>
                </tr>
              )}

              {listTicketQueryData?.pages.map((group, i) => (
                <React.Fragment key={i}>
                  {group.data.map((ticket) => (
                    <TicketTableItem
                      key={ticket.id}
                      ticket={ticket}
                      openModal={(ticket: LopTicket) => {
                        setSelectedTicket(ticket);
                        volumeDetailsForm.form.setFieldValue(
                          "volumes",
                          ticket.volumes
                        );
                        volumeDetailsForm.form.setDirty({
                          volumes: false,
                        });

                        openVolumeDetailsModal();
                      }}
                    />
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        </Skeleton>
      </ScrollArea.Autosize>

      <Flex
        direction={"row"}
        justify={"space-between"}
        align={"center"}
        className="mt-4 mx-4"
      >
        <Flex direction={"row"} gap={"xl"} align={"center"}>
          <ButtonAMDA
            disabled={!getListTicketQuery.hasNextPage}
            loading={isFetchingListTicketQuery}
            onClick={getListTicketQuery.fetchNextPage}
          >
            Load More
          </ButtonAMDA>

          <Text>
            Menampilkan <strong>{totalTickets}</strong> tiket
          </Text>
        </Flex>

        <ButtonAMDA
          disabled={totalTickets === 0}
          leftIcon={<IconDownload />}
          onClick={handleExportTicket}
        >
          Export XLSX
        </ButtonAMDA>
      </Flex>
    </>
  );
};

export default DaftarBOQ;
