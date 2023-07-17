import {
  Button,
  Card,
  Checkbox,
  Container,
  Grid,
  Modal,
  Table,
  TextInput,
} from "@mantine/core";
import {
  IconCirclePlus,
  IconTrash,
  IconEdit,
  IconFilter,
} from "@tabler/icons-react";
import SearchBar from "./SearchBar";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";

const App: React.FC = () => {
  const handleSearch = (searchTerm: string) => {
    // Perform search logic using the search term
    console.log("Searching for:", searchTerm);
  };

  const [openedAddMitra, { open: openAddMitra, close: closeAddMitra }] =
    useDisclosure(false);

  const form = useForm({
    initialValues: {
      name: "",
    },
  });

  return (
    <>
      <Modal opened={openedAddMitra} onClose={closeAddMitra} title="Add User">
        <TextInput withAsterisk label="Nama Mitra" placeholder="" />
        <Button onClick={closeAddMitra} color="dark" radius="xl">
          Tambah
        </Button>
      </Modal>
      <Container className="mt-8 font-['Poppins']">
        <p className="font-semibold text-xl text-black">Daftar Mitra</p>
      </Container>
      <Container className="mt-5 font-['Poppins']">
        <Grid>
          <Grid.Col span={7}>
            <SearchBar onSearch={handleSearch} />
          </Grid.Col>
          <Grid.Col span={5}>
            <Button variant="outline" color="dark" radius="xl">
              <IconFilter></IconFilter>
            </Button>{" "}
            <Button variant="outline" color="dark" radius="xl">
              <IconEdit></IconEdit>
            </Button>{" "}
            <Button variant="outline" color="dark" radius="xl">
              <IconTrash></IconTrash>
            </Button>{" "}
            <Button
              onClick={openAddMitra}
              leftIcon={<IconCirclePlus />}
              color="dark"
              radius="xl"
            >
              Add Mitra
            </Button>
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
                <th>Nama Mitra</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Checkbox></Checkbox>
                </td>
                <td>Telkom Witel Solo</td>
              </tr>
              <tr>
                <td>
                  <Checkbox></Checkbox>
                </td>
                <td>Telkom University</td>
              </tr>
            </tbody>
          </Table>
        </Card>
      </Container>
    </>
  );
};

export default App;
