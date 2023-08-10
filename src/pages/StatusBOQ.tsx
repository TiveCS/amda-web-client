import { LopTicket } from "@api/types/tickets";
import ButtonAMDA from "@components/ButtonAMDA";
import EvidenceReadOnly from "@components/pages/StatusBOQ/EvidenceReadOnly";
import FilterDaftarBOQModal from "@components/pages/DaftarBOQ/FilterDaftarBOQModal";
import TableStatusBoqItem from "@components/pages/StatusBOQ/TableStatusBoqItem";
import TicketVolumeDetailsReadOnlyModal from "@components/pages/StatusBOQ/TicketVolumeDetailsReadOnlyModal";
import useFilterForm from "@hooks/useFilterForm";
import useGetListTicketsQuery from "@hooks/useGetListTicketsQuery";
import { Flex, Group, ScrollArea, Skeleton, Table, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconFilter } from "@tabler/icons-react";
import React, { useEffect, useMemo, useState } from "react";
import SearchBar from "../components/SearchBar/SearchBar";
import TicketStatusConfirmModal from "@components/pages/StatusBOQ/TicketStatusConfirmModal";
import useTicketStatusUpdateForm from "@hooks/useTicketStatusUpdateForm";
import useTicketStatusMutation from "@hooks/useTicketStatusMutation";

const StatusBOQ: React.FC = () => {
  const searchForm = useForm({
    initialValues: { search: "" },
  });
  const [searchDebounced] = useDebouncedValue(searchForm.values.search, 500);

  const filterForm = useFilterForm({});

  const [selectedTicket, setSelectedTicket] = useState<LopTicket | null>(null);

  const {
    refetchListTicketQuery,
    isFetchingListTicketQuery,
    isLoadingListTicketQuery,
    listTicketQueryData,
    getListTicketQuery,
  } = useGetListTicketsQuery({
    filterForm,
    searchDebounced,
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

  const [
    isOpenUpdateConfirm,
    { open: openUpdateConfirm, close: closeUpdateConfirm },
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

  const updateStatusForm = useTicketStatusUpdateForm();
  const ticketStatusMutation = useTicketStatusMutation({
    form: updateStatusForm,
    identifier: selectedTicket?.identifier,
    closeConfirmModal: closeUpdateConfirm,
  });

  return (
    <>
      <FilterDaftarBOQModal
        isOpen={isOpenFilterModal}
        onClose={closeFilterModal}
        filterForm={filterForm.form}
        filter={filter}
      />

      <TicketStatusConfirmModal
        isOpen={isOpenUpdateConfirm}
        form={updateStatusForm}
        ticketStatusMutation={ticketStatusMutation}
        onClose={() => {
          setSelectedTicket(null);
          closeUpdateConfirm();
        }}
        ticket={selectedTicket}
      />

      <EvidenceReadOnly
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
                <th className="w-[8.5rem]">Mitra</th>
                <th className="w-28">Status</th>
                <th className="w-28">Actions</th>
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
                      updateStatusForm={updateStatusForm}
                      openConfirmModal={() => {
                        setSelectedTicket(ticket);
                        openUpdateConfirm();
                      }}
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

      <Flex direction={"row"} gap={"xl"} align={"center"} className="mt-6 ml-4">
        <ButtonAMDA
          disabled={!getListTicketQuery.hasNextPage}
          loading={isFetchingListTicketQuery || isLoadingListTicketQuery}
          onClick={getListTicketQuery.fetchNextPage}
        >
          Load More
        </ButtonAMDA>

        <Text>
          Menampilkan <strong>{ticketsTotal}</strong> tiket
        </Text>
      </Flex>
    </>
  );
};

export default StatusBOQ;
