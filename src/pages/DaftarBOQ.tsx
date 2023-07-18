import { Card, Container, Grid, Table } from "@mantine/core";
import { IconFilter } from "@tabler/icons-react";
import SearchBar from "../components/SearchBar/SearchBar";
import ButtonAMDA from "@components/ButtonAMDA";
import TableDaftarBOQ from "@components/TableDaftarBOQ";

const App: React.FC = () => {
  const handleSearch = (searchTerm: string) => {
    // Perform search logic using the search term
    console.log("Searching for:", searchTerm);
  };

  return (
    <>
      <Container className="mt-8 font-['Poppins']">
        <p className="font-semibold text-xl text-black">Daftar BOQ</p>
      </Container>
      <Container className="mt-5">
        <Grid>
          <Grid.Col span={10}>
            <SearchBar onSearch={handleSearch} />
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
        </Card>
      </Container>
    </>
  );
};

export default App;
