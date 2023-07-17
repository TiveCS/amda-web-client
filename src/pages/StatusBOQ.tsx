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
  Group,
  Image,
  Textarea,
} from "@mantine/core";
import { IconEdit, IconFilter, IconEye } from "@tabler/icons-react";
import SearchBar from "../components/SearchBar/SearchBar";
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
  const [openedButtonAcc, { open: openButtonAcc, close: closeButtonAcc }] =
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
        opened={openedButtonAcc}
        onClose={closeButtonAcc}
        title="Acc Kegiatan"
      >
        <p>Pastikan dokumen kegiatan sudah lengkap dan sesuai!</p>
        <br />
        <Button onClick={closeButtonAcc} color="dark" radius="xl">
          Acc
        </Button>
      </Modal>
      <Modal
        opened={openedCatatanUT}
        onClose={closeCatatanUT}
        title="Catatan Uji Terima"
      >
        <Textarea placeholder="Tambahkan catatan" withAsterisk />
        <br />
        <Button onClick={closeCatatanUT} color="dark" radius="xl">
          Tambah
        </Button>
      </Modal>
      <Modal opened={openedEvidence} onClose={closeEvidence} title="Evidence">
        <Text fz="sm" fw={500}>
          Sebelum
        </Text>
        <Image
          maw={240}
          radius="md"
          src="../../public/assets/img/gambar.jpg"
          alt="Random image"
          withPlaceholder
        />
        <Text fz="sm" fw={500}>
          Proses
        </Text>
        <Image
          maw={240}
          radius="md"
          src="../../public/assets/img/gambar.jpg"
          alt="Random image"
          withPlaceholder
        />
        <Text fz="sm" fw={500}>
          Sesudah
        </Text>
        <Image
          maw={240}
          radius="md"
          src="../../public/assets/img/gambar.jpg"
          alt="Random image"
          withPlaceholder
        />
      </Modal>
      <Modal opened={openedAddVolume} onClose={closeAddVolume} title="Volume">
        <TextInput disabled label="Tiket Insident" placeholder="IN12345678" />
        <TextInput disabled label="Work Desc" placeholder="Jl. Kelud" />
        <TextInput label="Tambah Designator" placeholder="Cari designator" />
        <Container className="mt-6 max-h-40 overflow-y-scroll">
          <Group>
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
          </Group>
        </Container>
      </Modal>
      <Container className="mt-8 font-['Poppins']">
        <p className="font-semibold text-xl text-black">Status BOQ</p>
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
                <th>Detail Volume</th>
                <th>Evidence</th>
                <th>Catatan Uji Terima</th>
                <th>Status</th>
                <th>Button Acc</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>IN12345678</td>
                <td>Jl. Kelud</td>
                <td>
                  <Button
                    onClick={openAddVolume}
                    radius="xl"
                    variant="filled"
                    color="primary"
                  >
                    <IconEye></IconEye>
                  </Button>
                </td>
                <td>
                  <Button
                    onClick={openEvidence}
                    radius="xl"
                    variant="filled"
                    color="primary"
                  >
                    <IconEye></IconEye>
                  </Button>
                </td>
                <td>
                  <Button
                    onClick={openCatatanUT}
                    radius="xl"
                    variant="filled"
                    color="primary"
                  >
                    <IconEdit></IconEdit>
                  </Button>
                </td>
                <td>
                  <Badge color="red" variant="outline">
                    belum acc
                  </Badge>
                </td>
                <td>
                  <Button
                    onClick={openButtonAcc}
                    radius="xl"
                    variant="filled"
                    color="primary"
                  >
                    Acc
                  </Button>
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
