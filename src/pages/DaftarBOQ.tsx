import ButtonAMDA from "@components/ButtonAMDA";
import TableDaftarBOQ from "@components/TableDaftarBOQ";
import { Container, Grid, Table } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconFilter } from "@tabler/icons-react";
import SearchBar from "../components/SearchBar/SearchBar";

const DaftarBOQ: React.FC = () => {
  const searchForm = useForm({
    initialValues: { search: "" },
  });

  return (
    <>
      <Container className="mt-8 font-poppins" fluid>
        <p className="font-semibold text-xl text-black">Daftar BOQ</p>
      </Container>

      <Container className="mt-5" fluid>
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

      <Container className="max-h-1/2 overflow-y-scroll" fluid>
        <Table striped withBorder withColumnBorders>
          <thead>
            <tr>
              <th>Tiket Insident</th>
              <th>Work Desc</th>
              <th>Status Volume</th>
              <th>Detail Volume</th>
              <th>Status Evidence</th>
              <th>Evidence</th>
              <th>Catatan UT</th>
              <th>Status Acc</th>
            </tr>
          </thead>
          <tbody>
            <TableDaftarBOQ
              noTiket="IN12345678"
              workDesc="Jl. Kelud"
              statusVolume="belum lengkap"
              catatan="Tidak ada catatan"
            ></TableDaftarBOQ>
            <TableDaftarBOQ
              noTiket="IN12345678"
              workDesc="Jl. Kelud"
              statusVolume="sudah lengkap"
              statusEvidence="belum upload"
              catatan="Tidak ada catatan"
            ></TableDaftarBOQ>
            <TableDaftarBOQ
              noTiket="IN12345678"
              workDesc="Jl. Kelud"
              statusVolume="sudah lengkap"
              statusEvidence="sudah upload"
              catatan="Tidak ada catatan"
              statusAcc="belum acc"
            ></TableDaftarBOQ>
            <TableDaftarBOQ
              noTiket="IN12345678"
              workDesc="Jl. Kelud"
              statusVolume="sudah lengkap"
              statusEvidence="sudah upload"
              catatan="Tidak ada catatan"
              statusAcc="sudah acc"
            ></TableDaftarBOQ>
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default DaftarBOQ;
