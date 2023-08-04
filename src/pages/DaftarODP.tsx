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
import { DateInput } from "@mantine/dates";
import TableDaftarODP from "@components/TableDaftarODP";
import { useForm } from "@mantine/form";
import SearchBar from "@components/SearchBar/SearchBar";

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
      <Modal opened={openedAddODC} onClose={closeAddODC} title="Add ODP">
        <TextInput label="Noss ID" placeholder="" />
        <TextInput label="ODP Index" placeholder="" />
        <TextInput label="ODP Name" placeholder="" />
        <TextInput label="Latitude" placeholder="" />
        <TextInput label="Longitude" placeholder="" />
        <TextInput label="Clusname" placeholder="" />
        <TextInput label="Cluster Status" placeholder="" />
        <TextInput label="Avai" placeholder="" />
        <TextInput label="Used" placeholder="" />
        <TextInput label="Rsvs" placeholder="" />
        <TextInput label="Rsk" placeholder="" />
        <Select
          label="Regional"
          placeholder="Select one"
          data={[
            { value: "1", label: "Regional 1" },
            { value: "2", label: "Regional 2" },
            { value: "3", label: "Regional 3" },
          ]}
        />
        <TextInput label="Datel" placeholder="" />
        <TextInput label="STO" placeholder="" />
        <TextInput label="STO Desc" placeholder="" />
        <TextInput label="ODP Info" placeholder="" />
        <DateInput label="Update Date" placeholder="" />
        <DateInput label="Tanggal Golive" placeholder="" />
        <Select
          label="Kategori"
          placeholder="Select one"
          data={[{ value: "1", label: "Non Tito" }]}
        />
        <TextInput label="Nama Proyek" placeholder="" />
        <Select
          label="Kabupaten/Kota"
          placeholder="Select one"
          data={[{ value: "1", label: "Solo" }]}
        />
        <Select
          label="Provinsi"
          placeholder="Select one"
          data={[{ value: "1", label: "Jawa Tengah" }]}
        />
        <TextInput label="OCC 1" placeholder="" />
        <TextInput label="OCC 2" placeholder="" />
        <TextInput label="Validasi STO" placeholder="" />
        <TextInput label="Validasi ODP" placeholder="" />
        <TextInput label="Jarak ODP ke ODC" placeholder="" />
        <TextInput label="Jarak ODC ke STO" placeholder="" />
        <TextInput label="Jarak ODP ke STO" placeholder="" />
        <Select
          label="Validasi Provinsi"
          placeholder="Select one"
          data={[{ value: "1", label: "Jawa Tengah" }]}
        />
        <Select
          label="Validasi Kab/Kota"
          placeholder="Select one"
          data={[{ value: "1", label: "Solo" }]}
        />
        <Select
          label="Validasi Kecamatan"
          placeholder="Select one"
          data={[{ value: "1", label: "Pasar Kliwon" }]}
        />
        <Select
          label="Validasi Kelurahan"
          placeholder="Select one"
          data={[{ value: "1", label: "Gladag" }]}
        />
        <br />
        <ButtonAMDA onClick={closeAddODC}>Tambah</ButtonAMDA>
      </Modal>
      <Container className="mt-8 font-['Poppins']">
        <p className="font-semibold text-xl text-black">Daftar ODP</p>
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
              Add ODP
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
                <th>Noss ID</th>
                <th>ODP Index</th>
                <th>ODP Name</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Clusname</th>
                <th>Cluster Status</th>
                <th>Avai</th>
                <th>Used</th>
                <th>Rsv</th>
                <th>Rsk</th>
                <th>Regional</th>
                <th>Witel</th>
                <th>Datel</th>
                <th>STO</th>
                <th>STO Desc</th>
                <th>ODP Info</th>
                <th>Update Date</th>
                <th>Tanggal Golive</th>
                <th>Kategori</th>
                <th>Nama Proyek</th>
                <th>Kabupaten/Kota</th>
                <th>Provinsi</th>
                <th>OCC 1</th>
                <th>OCC 2</th>
                <th>Validasi STO</th>
                <th>Validasi ODP</th>
                <th>Jarak ODP ke ODC</th>
                <th>Jarak ODC ke STO</th>
                <th>Jarak ODP ke STO</th>
                <th>Validasi Provinsi</th>
                <th>Validasi Kab/Kota</th>
                <th>Validasi Kecamatan</th>
                <th>Validasi Kelurahan</th>
              </tr>
            </thead>
            <tbody>
              <TableDaftarODP
                nossID="2734769685"
                ODPIndex="FF/D01/008.01"
                ODPName="ODP-DLG-FF/008"
                latitude="-7,596593952"
                longitude="-7,596593952"
                avai="2"
                used="22"
                regional="Regional 4"
              ></TableDaftarODP>
            </tbody>
          </Table>
        </Card>
      </Container>
    </>
  );
};

export default App;
