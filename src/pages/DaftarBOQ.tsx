import { getListTickets } from "@api/tickets";
import { LopTicket } from "@api/types/tickets";
import ButtonAMDA from "@components/ButtonAMDA";
import TicketTableItem from "@components/pages/DaftarBOQ/TicketTableItem";
import TicketVolumeDetailsModal from "@components/pages/DaftarBOQ/TicketVolumeDetailsModal";
import useVolumeDetailsForm from "@hooks/useVolumeDetailsForm";
import {
  Container,
  Grid,
  LoadingOverlay,
  ScrollArea,
  Table,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconFilter } from "@tabler/icons-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import SearchBar from "../components/SearchBar/SearchBar";

const DaftarBOQ: React.FC = () => {
  const searchForm = useForm({
    initialValues: { search: "" },
  });
  const [searchDebounced] = useDebouncedValue(searchForm.values.search, 500);

  const [selectedTicket, setSelectedTicket] = React.useState<LopTicket | null>(
    null
  );

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
        search: searchDebounced,
        cursor: pageParam as number,
        take: 20,
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

  const volumeDetailsForm = useVolumeDetailsForm();

  return (
    <>
      <TicketVolumeDetailsModal
        selectedTicket={selectedTicket}
        setSelectedTicket={setSelectedTicket}
        isOpen={isVolumeDetailsModalOpen}
        onClose={closeVolumeDetailsModal}
        volumeDetailsForm={volumeDetailsForm}
      />

      <Container className="mt-8 font-poppins" fluid>
        <p className="font-semibold text-xl text-black">Daftar BOQ</p>
      </Container>

      <Container className="my-5" fluid>
        <Grid>
          <Grid.Col span={6}>
            <SearchBar searchForm={searchForm} />
          </Grid.Col>
          <Grid.Col span={6}>
            <ButtonAMDA variant="outline">
              <IconFilter></IconFilter>
            </ButtonAMDA>
          </Grid.Col>
        </Grid>
      </Container>

      <ScrollArea.Autosize offsetScrollbars className="max-h-1/2 mx-4">
        {isFetchingListTicketQuery ||
          (isLoadingListTicketQuery && <LoadingOverlay visible={true} />)}

        <Table striped withBorder withColumnBorders>
          <thead>
            <tr>
              <th>ID Tiket</th>
              <th>Lokasi Tiket</th>
              <th className="w-36">Status Volume</th>
              <th>Detail Volume</th>
              <th>Status Evidence</th>
              <th>Evidence</th>
              <th>Catatan UT</th>
              <th>Status Acc</th>
            </tr>
          </thead>
          <tbody>
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
                      console.log(
                        "dirty",
                        volumeDetailsForm.form.isDirty("volumes")
                      );

                      openVolumeDetailsModal();
                    }}
                  />
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </ScrollArea.Autosize>

      <ButtonAMDA
        className="mt-4 ml-4"
        disabled={!getListTicketQuery.hasNextPage}
        loading={isFetchingListTicketQuery}
        onClick={getListTicketQuery.fetchNextPage}
      >
        Load More
      </ButtonAMDA>
    </>
  );
};

export default DaftarBOQ;
