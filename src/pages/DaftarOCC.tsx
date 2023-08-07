import {
  Card,
  Container,
  Grid,
  Modal,
  Select,
  Table,
  TextInput,
} from "@mantine/core";
import {
  IconCirclePlus,
  IconTrash,
  IconEdit,
  IconFilter,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import ButtonAMDA from "@components/ButtonAMDA";
import TableDaftarOCC from "@components/TableDaftarOCC";
import { useForm } from "@mantine/form";
import SearchBar from "@components/SearchBar/SearchBar";

const App: React.FC = () => {
  const searchForm = useForm({
    initialValues: {
      search: "",
    },
  });

  const [openedAddOCC, { open: openAddOCC, close: closeAddOCC }] =
    useDisclosure(false);

  return (
    <>
      <Modal opened={openedAddOCC} onClose={closeAddOCC} title="Add OCC">
        <Select
          label="Regional"
          placeholder="Select one"
          data={[
            { value: "1", label: "Regional 1" },
            { value: "2", label: "Regional 2" },
            { value: "3", label: "Regional 3" },
          ]}
        />
        <TextInput withAsterisk label="Witel" placeholder="" />
        <TextInput withAsterisk label="Datel" placeholder="" />
        <TextInput withAsterisk label="STO" placeholder="" />
        <TextInput label="Cable Sheath Start Locn" placeholder="" />
        <TextInput label="ID Cable Sheath Start Locn" placeholder="" />
        <TextInput label="ID Cable Sheath" placeholder="" />
        <TextInput label="Route Section" placeholder="" />
        <TextInput label="Cable Sheath" placeholder="" />
        <TextInput label="Dist Number" placeholder="" />
        <TextInput label="Cable Sheath Core Total" placeholder="" />
        <TextInput label="Cable Sheath Core Used" placeholder="" />
        <TextInput label="Cable Sheath Core Idle" placeholder="" />
        <br />
        <ButtonAMDA onClick={closeAddOCC}>Tambah</ButtonAMDA>
      </Modal>
      <Container className="mt-8 font-['Poppins']">
        <p className="font-semibold text-xl text-black">Daftar OCC</p>
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
            <ButtonAMDA onClick={openAddOCC} leftIcon={<IconCirclePlus />}>
              Add OCC
            </ButtonAMDA>
          </Grid.Col>
        </Grid>
      </Container>
      <Container>
        <Card
          withBorder
          className="mt-4 overflow-y-scroll overflow-x-scroll"
          style={{ width: 870, height: 380 }}
        >
          <Table striped withBorder withColumnBorders>
            <thead>
              <tr>
                <th>#</th>
                <th>Regional</th>
                <th>Witel</th>
                <th>Datel</th>
                <th>STO</th>
                <th>Cable Sheath Start Locn</th>
                <th>ID Cable Sheath Start Locn</th>
                <th>ID Cable Sheath</th>
                <th>Route Section</th>
                <th>Cable Sheath</th>
                <th>Dist Number</th>
                <th>Cable Sheath Core Total</th>
                <th>Cable Sheath Core User</th>
                <th>Cable Sheath Core Idle</th>
              </tr>
            </thead>
            <tbody>
              <TableDaftarOCC
                regional="Regional 4"
                datel="Solo"
                witel="Klaten"
                sto="BYL"
                CSStartLocn="ODC-BI1-FB"
                idCSStartLocn="195799076"
                routeSection="DS-BI1-FE-01-01-00/01"
                CS="DS-BI1-FE-01-01-00/01.01.00"
                distNumber="DIST 01"
                CSCoreTotal="24"
                CSCoreUser="24"
                CSCoreIdle="0"
              ></TableDaftarOCC>
              <TableDaftarOCC
                regional="Regional 4"
                datel="Solo"
                witel="Klaten"
                sto="BYL"
              ></TableDaftarOCC>
            </tbody>
          </Table>
        </Card>
      </Container>
    </>
  );
};

export default App;
