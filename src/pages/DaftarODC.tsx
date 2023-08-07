import ButtonAMDA from "@components/ButtonAMDA";
import SearchBar from "@components/SearchBar/SearchBar";
import {
  Card,
  Container,
  Grid,
  Modal,
  Select,
  Table,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import {
  IconCirclePlus,
  IconEdit,
  IconFilter,
  IconTrash,
} from "@tabler/icons-react";

const App: React.FC = () => {
  const searchForm = useForm({
    initialValues: {
      search: "",
    },
  });

  const [openedAddODC, { open: openAddODC, close: closeAddODC }] =
    useDisclosure(false);

  return (
    <>
      <Modal opened={openedAddODC} onClose={closeAddODC} title="Add ODC">
        <TextInput withAsterisk label="Datel" placeholder="" />
        <TextInput withAsterisk label="STO" placeholder="" />
        <TextInput label="Location" placeholder="" />
        <TextInput label="Latitude" placeholder="" />
        <TextInput label="Longitude" placeholder="" />
        <Select
          label="Inventory Status"
          placeholder="Select one"
          data={[
            { value: "active", label: "Active" },
            { value: "deleted", label: "Deleted" },
          ]}
        />
        <TextInput label="KAP ODC" placeholder="" />
        <TextInput label="Mini OLT" placeholder="" />
        <br />
        <ButtonAMDA onClick={closeAddODC}>Tambah</ButtonAMDA>
      </Modal>
      <Container className="mt-8 font-['Poppins']">
        <p className="font-semibold text-xl text-black">Daftar ODC</p>
      </Container>
      <Container className="mt-5">
        <Grid>
          <Grid.Col span={7}>
            <SearchBar searchForm={searchForm} />
          </Grid.Col>
          <Grid.Col span={5}>
            <ButtonAMDA variant="outline">
              <IconFilter></IconFilter>
            </ButtonAMDA>{" "}
            <ButtonAMDA variant="outline">
              <IconEdit></IconEdit>
            </ButtonAMDA>{" "}
            <ButtonAMDA variant="outline">
              <IconTrash></IconTrash>
            </ButtonAMDA>{" "}
            <ButtonAMDA onClick={openAddODC} leftIcon={<IconCirclePlus />}>
              Add ODC
            </ButtonAMDA>
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
                <th>Datel</th>
                <th>STO</th>
                <th>Location</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Inventory Status</th>
                <th>Kap ODC</th>
                <th>Mini OLT</th>
              </tr>
            </thead>
            <tbody></tbody>
          </Table>
        </Card>
      </Container>
    </>
  );
};

export default App;
