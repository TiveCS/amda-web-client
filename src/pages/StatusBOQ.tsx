import { getListTickets } from "@api/tickets";
import { LopTicket } from "@api/types/tickets";
import ButtonAMDA from "@components/ButtonAMDA";
import EvidenceDrawer from "@components/pages/DaftarBOQ/EvidenceDrawer";
import FilterDaftarBOQModal from "@components/pages/DaftarBOQ/FilterDaftarBOQModal";
import TableStatusBoqItem from "@components/pages/StatusBOQ/TableStatusBoqItem";
import TicketVolumeDetailsReadOnlyModal from "@components/pages/StatusBOQ/TicketVolumeDetailsReadOnlyModal";
import useFilterForm from "@hooks/useFilterForm";
import { Group, ScrollArea, Skeleton, Table } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconFilter } from "@tabler/icons-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import SearchBar from "../components/SearchBar/SearchBar";

const StatusBOQ: React.FC = () => {
  const searchForm = useForm({
    initialValues: { search: "" },
  });
  const [searchDebounced] = useDebouncedValue(searchForm.values.search, 500);

  const filterForm = useFilterForm();

  const [selectedTicket, setSelectedTicket] = useState<LopTicket | null>(null);

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
        acceptStatus: filterForm.form.values.acceptStatus,
        evidenceStatus: filterForm.form.values.evidenceStatus,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const [
    isOpenFilterModal,
    { open: openFilterModal, close: closeFilterModal },
  ] = useDisclosure(false);

  const [
    isOpenEvidenceDrawer,
    { open: openEvidenceDrawer, close: closeEvidenceDrawer },
  ] = useDisclosure(false);

  const [
    isOpenVolumeDetailsModal,
    { open: openVolumeDetailsModal, close: closeVolumeDetailsModal },
  ] = useDisclosure(false);

  useEffect(() => {
    const refetch = async () => {
      await refetchListTicketQuery();
    };

    void refetch();
  }, [refetchListTicketQuery, searchDebounced]);

  const ticketsTotal = useMemo(() => {
    return listTicketQueryData?.pages.reduce(
      (acc, page) => acc + page.data.length,
      0
    );
  }, [listTicketQueryData?.pages]);

  const filter = () => {
    void refetchListTicketQuery();
    closeFilterModal();
  };

  return (
    <>
      <FilterDaftarBOQModal
        isOpen={isOpenFilterModal}
        onClose={closeFilterModal}
        filterForm={filterForm.form}
        filter={filter}
      />

      <EvidenceDrawer
        opened={isOpenEvidenceDrawer}
        onClose={() => {
          setSelectedTicket(null);
          closeEvidenceDrawer();
        }}
        ticket={selectedTicket}
      />

      <TicketVolumeDetailsReadOnlyModal
        isOpen={isOpenVolumeDetailsModal}
        onClose={closeVolumeDetailsModal}
        setSelectedTicket={setSelectedTicket}
        ticket={selectedTicket}
      />

      <p className="font-semibold text-xl mt-8 mx-4 text-black">Status BOQ</p>

      <Group grow className="my-2 mx-4">
        <SearchBar searchForm={searchForm} />

        <Group>
          <ButtonAMDA variant="outline" onClick={openFilterModal}>
            <IconFilter></IconFilter>
          </ButtonAMDA>
        </Group>
      </Group>

      <ScrollArea.Autosize className="max-h-1/2 mt-4 mx-4">
        <Skeleton
          visible={isFetchingListTicketQuery || isLoadingListTicketQuery}
        >
          <Table striped withBorder withColumnBorders>
            <thead>
              <tr>
                <th className="w-24">ID Tiket</th>
                <th className="w-36">Lokasi Tiket</th>
                <th className="w-12">Detail Volume</th>
                <th className="w-12">Evidence</th>
                <th>Catatan Uji Terima</th>
                <th className="w-28">Status</th>
                <th className="w-[10%]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ticketsTotal === 0 && (
                <tr>
                  <td colSpan={7}>
                    <p className="text-center">Tidak ada data</p>
                  </td>
                </tr>
              )}

              {listTicketQueryData?.pages.map((page, i) => (
                <React.Fragment key={i}>
                  {page.data.map((ticket, index) => (
                    <TableStatusBoqItem
                      key={index}
                      ticket={ticket}
                      openDetailModal={() => {
                        setSelectedTicket(ticket);
                        openVolumeDetailsModal();
                      }}
                      openEvidenceDrawer={() => {
                        setSelectedTicket(ticket);
                        openEvidenceDrawer();
                      }}
                    />
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        </Skeleton>
      </ScrollArea.Autosize>

      <ButtonAMDA
        disabled={getListTicketQuery.hasNextPage}
        loading={isFetchingListTicketQuery || isLoadingListTicketQuery}
        className="ml-4 mt-4"
      >
        Load More
      </ButtonAMDA>
    </>
  );
};

export default StatusBOQ;
