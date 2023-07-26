import { getListTickets } from "@api/tickets";
import ButtonAMDA from "@components/ButtonAMDA";
import TicketTableItem from "@components/pages/DaftarBOQ/TicketTableItem";
import { Container, Grid, Table } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedValue } from "@mantine/hooks";
import { IconFilter } from "@tabler/icons-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import SearchBar from "../components/SearchBar/SearchBar";

const DaftarBOQ: React.FC = () => {
  const searchForm = useForm({
    initialValues: { search: "" },
  });

  const [searchDebounced] = useDebouncedValue(searchForm.values.search, 500);

  const { refetch: refetchListTicketQuery, ...getListTicketQuery } =
    useInfiniteQuery({
      queryKey: ["tickets"],
      queryFn: async ({ pageParam = 0 }) =>
        getListTickets({
          search: searchDebounced,
          cursor: pageParam as number,
        }),
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  useEffect(() => {
    void refetchListTicketQuery;
  }, [refetchListTicketQuery, searchDebounced]);

  return (
    <>
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

            <ButtonAMDA onClick={() => void getListTickets({})}>
              Get Volumes
            </ButtonAMDA>
          </Grid.Col>
        </Grid>
      </Container>

      <Container className="max-h-1/2 overflow-y-scroll" fluid>
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
            {getListTicketQuery.data?.pages.map((group, i) => (
              <React.Fragment key={i}>
                {group.data.map((ticket) => (
                  <TicketTableItem key={ticket.id} ticket={ticket} />
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default DaftarBOQ;
