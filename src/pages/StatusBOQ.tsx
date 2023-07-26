import { Card, Container, Grid, Table } from "@mantine/core";
import { IconFilter } from "@tabler/icons-react";
import SearchBar from "../components/SearchBar/SearchBar";
import ButtonAMDA from "@components/ButtonAMDA";
import TableStatusBOQ from "@components/TableStatusBOQ";
import { useForm } from "@mantine/form";

const StatusBOQ: React.FC = () => {
  const searchForm = useForm({
    initialValues: { search: "" },
  });

  return (
    <>
      <Container className="mt-8 font-['Poppins']">
        <p className="font-semibold text-xl text-black">Status BOQ</p>
      </Container>
      <Container className="mt-5">
        <Grid>
          <Grid.Col span={10}>
            <SearchBar searchForm={searchForm} />
          </Grid.Col>
          <Grid.Col span={2}>
            <ButtonAMDA variant="outline">
              <IconFilter></IconFilter>
            </ButtonAMDA>{" "}
          </Grid.Col>
        </Grid>
      </Container>
      <Container>
        <Card
          withBorder
          className="mt-4 overflow-y-scroll"
          style={{ width: 870, height: 380 }}
        >
          <Table striped withBorder withColumnBorders>
            <thead>
              <tr>
                <th>Tiket Insident</th>
                <th>Work Desc</th>
                <th>Detail Volume</th>
                <th>Evidence</th>
                <th>Catatan Uji Terima</th>
                <th>Status</th>
                <th>Button Acc</th>
              </tr>
            </thead>
            <tbody>
              <TableStatusBOQ
                noTiket="IN12345678"
                workDesc="Jl. Kelud"
              ></TableStatusBOQ>
              <TableStatusBOQ
                noTiket="IN12345678"
                workDesc="Jl. Kelud"
                statusAcc="sudah acc"
              ></TableStatusBOQ>
            </tbody>
          </Table>
        </Card>
      </Container>
    </>
  );
};

export default StatusBOQ;
