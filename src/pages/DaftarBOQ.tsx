import {
  Badge,
  Button,
  Card,
  Container,
  FileInput,
  Grid,
  Modal,
  Text,
  Table,
  TextInput,
  Flex,
  NumberInput,
} from "@mantine/core";
import { IconEdit, IconFilter, IconEye } from "@tabler/icons-react";
import SearchBar from "./SearchBar";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";

const App: React.FC = () => {
  const handleSearch = (searchTerm: string) => {
    // Perform search logic using the search term
    console.log("Searching for:", searchTerm);
  };

  const [openedCatatanUT, { open: openCatatanUT, close: closeCatatanUT }] =
    useDisclosure(false);
  const [openedEvidence, { open: openEvidence, close: closeEvidence }] =
    useDisclosure(false);
  const [openedAddVolume, { open: openAddVolume, close: closeAddVolume }] =
    useDisclosure(false);

  const form = useForm({
    initialValues: {
      tiketInsident: "",
      workDesc: "",
    },
  });

  return (
    <>
      <Modal
        opened={openedCatatanUT}
        onClose={closeCatatanUT}
        title="Catatan Uji Terima"
      >
        <p>Tidak ada catatan</p>
      </Modal>
      <Modal
        opened={openedEvidence}
        onClose={closeEvidence}
        title="Upload Evidence"
      >
        <FileInput
          placeholder="Pilih file"
          label="Sebelum"
          description="File berupa gambar (.png/.jpeg/.jpg)"
          withAsterisk
        />
        <FileInput
          placeholder="Pilih file"
          label="Proses"
          description="File berupa gambar (.png/.jpeg/.jpg)"
          withAsterisk
        />
        <FileInput
          placeholder="Pilih file"
          label="Sesudah"
          description="File berupa gambar (.png/.jpeg/.jpg)"
          withAsterisk
        />
        <br />
        <Button onClick={closeEvidence} color="dark" radius="xl">
          Tambah
        </Button>
      </Modal>
      <Modal opened={openedAddVolume} onClose={closeAddVolume} title="Volume">
        <TextInput disabled label="Tiket Insident" placeholder="IN12345678" />
        <TextInput disabled label="Work Desc" placeholder="Jl. Kelud" />

        <TextInput label="Tambah Designator" placeholder="Cari designator" />

        <Container className="mt-6 max-h-32 overflow-y-scroll">
          <Flex justify={"space-between"}>
            <Text>K-ABCD-123</Text>
            <NumberInput />
          </Flex>
          <Flex justify={"space-between"}>
            <Text>K-ABCD-123</Text>
            <NumberInput />
          </Flex>
          <Flex justify={"space-between"}>
            <Text>K-ABCD-123</Text>
            <NumberInput />
          </Flex>
          <Flex justify={"space-between"}>
            <Text>K-ABCD-123</Text>
            <NumberInput />
          </Flex>
        </Container>
        <br />
        <Button onClick={closeAddVolume} color="dark" radius="xl">
          Tambah
        </Button>
      </Modal>
      <Container className="mt-8 font-['Poppins']">
        <p className="font-semibold text-xl text-black">Daftar BOQ</p>
      </Container>
      <Container className="mt-5">
        <Grid>
          <Grid.Col span={10}>
            <SearchBar onSearch={handleSearch} />
          </Grid.Col>
          <Grid.Col span={2}>
            <Button variant="outline" color="dark" radius="xl">
              <IconFilter></IconFilter>
            </Button>{" "}
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
              <tr>
                <td>IN12345678</td>
                <td>Jl. Kelud</td>
                <td>
                  <Badge color="green" variant="outline">
                    sudah lengkap
                  </Badge>
                </td>
                <td>
                  <Button
                    onClick={openAddVolume}
                    radius="xl"
                    variant="filled"
                    color="primary"
                  >
                    <IconEdit></IconEdit>
                  </Button>
                </td>
                <td>
                  <Badge color="red" variant="outline">
                    belum diupload
                  </Badge>
                </td>
                <td>
                  <Button
                    onClick={openEvidence}
                    radius="xl"
                    variant="filled"
                    color="primary"
                  >
                    <IconEdit></IconEdit>
                  </Button>
                </td>
                <td>
                  <Button
                    onClick={openCatatanUT}
                    radius="xl"
                    variant="filled"
                    color="primary"
                  >
                    <IconEye></IconEye>
                  </Button>
                </td>
                <td>
                  <Badge color="red" variant="outline">
                    belum acc
                  </Badge>
                </td>
              </tr>
            </tbody>
          </Table>
        </Card>
      </Container>
    </>
  );
};

export default App;
