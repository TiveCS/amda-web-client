import { Card, Checkbox, Container, Grid, Table } from "@mantine/core";
import SearchBar from "../components/SearchBar/SearchBar";
import { useForm } from "@mantine/form";

const DaftarRole: React.FC = () => {
  const searchForm = useForm({
    initialValues: {
      search: "",
    },
  });

  return (
    <>
      <Container className="mt-8 font-['Poppins']">
        <p className="font-semibold text-xl text-black">Daftar Role</p>
      </Container>
      <Container className="mt-5 font-['Poppins']">
        <Grid>
          <Grid.Col span={12}>
            <SearchBar searchForm={searchForm} />
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
                <th>#</th>
                <th>Nama Role</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Checkbox></Checkbox>
                </td>
                <td>Telkom Akses Admin</td>
              </tr>
              <tr>
                <td>
                  <Checkbox></Checkbox>
                </td>
                <td>Telkom Akses Maintenance</td>
              </tr>
              <tr>
                <td>
                  <Checkbox></Checkbox>
                </td>
                <td>Telkom Akses Uji Terima</td>
              </tr>
              <tr>
                <td>
                  <Checkbox></Checkbox>
                </td>
                <td>Admin Mitra</td>
              </tr>
            </tbody>
          </Table>
        </Card>
      </Container>
    </>
  );
};

export default DaftarRole;
