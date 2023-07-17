import {
  Button,
  Card,
  Container,
  Grid,
  Modal,
  Table,
  TextInput,
  Flex,
  Checkbox,
  Select,
  Radio,
  Group,
} from "@mantine/core";
import {
  IconEdit,
  IconTrash,
  IconCirclePlus,
  IconDownload,
  IconFilter,
} from "@tabler/icons-react";
import SearchBar from "../components/SearchBar/SearchBar";
import { useDisclosure } from "@mantine/hooks";
import { DateInput, TimeInput } from "@mantine/dates";
import ButtonWithIcon from "@components/ButtonWithIcon";

const App: React.FC = () => {
  const handleSearch = (searchTerm: string) => {
    // Perform search logic using the search term
    console.log("Searching for:", searchTerm);
  };

  const [
    openedAddKegiatan,
    { open: openAddKegiatan, close: closeAddKegiatan },
  ] = useDisclosure(false);
  const [openedAddLOP, { open: openAddLOP, close: closeAddLOP }] =
    useDisclosure(false);

  return (
    <>
      <Modal opened={openedAddLOP} onClose={closeAddLOP} title="Add LOP">
        <TextInput withAsterisk label="Nama LOP" placeholder="" />
        <br />
        <ButtonWithIcon onClick={closeAddLOP}>Tambah</ButtonWithIcon>
      </Modal>
      <Modal
        opened={openedAddKegiatan}
        onClose={closeAddKegiatan}
        title="Add Kegiatan"
      >
        <Select
          withAsterisk
          label="Nama LOP"
          placeholder="Select one"
          data={[
            { value: "1", label: "LOP 1" },
            { value: "2", label: "LOP 2" },
            { value: "3", label: "LOP 3" },
          ]}
        />
        <TextInput label="STO" placeholder="" withAsterisk />
        <Select
          withAsterisk
          label="Jenis Pekerjaan"
          placeholder="Select one"
          data={[
            { value: "recov", label: "Recovery" },
            { value: "reloc", label: "Relokasi" },
          ]}
        />
        <TextInput label="Nomor Tiket" placeholder="" withAsterisk />
        <DateInput label="Tanggal Input Tiket" withAsterisk />
        <TimeInput label="Tanggal Input Tiket" withAsterisk />
        <TextInput label="Uraian Pekerjaan" placeholder="" withAsterisk />
        <TextInput label="Work Desc" placeholder="" withAsterisk />
        <Select
          withAsterisk
          label="Mitra"
          placeholder="Select one"
          data={[
            { value: "1", label: "PT. A" },
            { value: "2", label: "PT. B" },
            { value: "3", label: "PT. C" },
          ]}
        />
        <Radio.Group label="Ditujukan untuk" withAsterisk>
          <Group mt="xs">
            <Radio value="TAAdmin" label="TA Admin" />
            <Radio value="AdminMitra" label="Admin Mitra" />
          </Group>
        </Radio.Group>
        <br />
        <ButtonWithIcon onClick={closeAddKegiatan}>Tambah</ButtonWithIcon>
      </Modal>
      <Container className="mt-8 font-['Poppins']">
        <p className="font-semibold text-xl text-black">Daftar BOQ</p>
      </Container>
      <Container className="mt-5">
        <Grid>
          <Grid.Col span={7}>
            <SearchBar onSearch={handleSearch} />
          </Grid.Col>
          <Grid.Col span={5}>
            <ButtonWithIcon variant="outline">
              <IconFilter></IconFilter>
            </ButtonWithIcon>{" "}
            <ButtonWithIcon variant="outline">
              <IconEdit></IconEdit>
            </ButtonWithIcon>{" "}
            <ButtonWithIcon variant="outline">
              <IconTrash></IconTrash>
            </ButtonWithIcon>{" "}
            <ButtonWithIcon
              onClick={openAddKegiatan}
              leftIcon={<IconCirclePlus />}
            >
              Add Keg
            </ButtonWithIcon>
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
                <th>Nama LOP</th>
                <th>#</th>
                <th>STO</th>
                <th>Jenis Pekerjaan</th>
                <th>No Tiket</th>
                <th>Work Desc</th>
                <th>Mitra</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowSpan={2} style={{ width: 200 }}>
                  SLO-QE RECOV-SRG DISTRIBUSI KEDAWUNG JAN 23
                </td>
                <td>
                  <Checkbox></Checkbox>
                </td>
                <td>Boyolali</td>
                <td>Recovery</td>
                <td>IN12345678</td>
                <td>Jl. Kelud</td>
                <td>PT. A</td>
              </tr>
              <tr>
                <td>
                  <Checkbox></Checkbox>
                </td>
                <td>Boyolali</td>
                <td>Recovery</td>
                <td>IN12345678</td>
                <td>Jl. Kelud</td>
                <td>PT. A</td>
              </tr>
              <tr>
                <td rowSpan={2} style={{ width: 200 }}>
                  SLO-QE RECOV-SRG DISTRIBUSI KEDAWUNG JAN 23
                </td>
                <td>
                  <Checkbox></Checkbox>
                </td>
                <td>Boyolali</td>
                <td>Recovery</td>
                <td>IN12345678</td>
                <td>Jl. Kelud</td>
                <td>PT. A</td>
              </tr>
              <tr>
                <td>
                  <Checkbox></Checkbox>
                </td>
                <td>Boyolali</td>
                <td>Recovery</td>
                <td>IN12345678</td>
                <td>Jl. Kelud</td>
                <td>PT. A</td>
              </tr>
              <tr>
                <td rowSpan={2} style={{ width: 200 }}>
                  SLO-QE RECOV-SRG DISTRIBUSI KEDAWUNG JAN 23
                </td>
                <td>
                  <Checkbox></Checkbox>
                </td>
                <td>Boyolali</td>
                <td>Recovery</td>
                <td>IN12345678</td>
                <td>Jl. Kelud</td>
                <td>PT. A</td>
              </tr>
              <tr>
                <td>
                  <Checkbox></Checkbox>
                </td>
                <td>Boyolali</td>
                <td>Recovery</td>
                <td>IN12345678</td>
                <td>Jl. Kelud</td>
                <td>PT. A</td>
              </tr>
              <tr>
                <td rowSpan={2} style={{ width: 200 }}>
                  SLO-QE RECOV-SRG DISTRIBUSI KEDAWUNG JAN 23
                </td>
                <td>
                  <Checkbox></Checkbox>
                </td>
                <td>Boyolali</td>
                <td>Recovery</td>
                <td>IN12345678</td>
                <td>Jl. Kelud</td>
                <td>PT. A</td>
              </tr>
              <tr>
                <td>
                  <Checkbox></Checkbox>
                </td>
                <td>Boyolali</td>
                <td>Recovery</td>
                <td>IN12345678</td>
                <td>Jl. Kelud</td>
                <td>PT. A</td>
              </tr>
              <tr>
                <td rowSpan={2} style={{ width: 200 }}>
                  SLO-QE RECOV-SRG DISTRIBUSI KEDAWUNG JAN 23
                </td>
                <td>
                  <Checkbox></Checkbox>
                </td>
                <td>Boyolali</td>
                <td>Recovery</td>
                <td>IN12345678</td>
                <td>Jl. Kelud</td>
                <td>PT. A</td>
              </tr>
              <tr>
                <td>
                  <Checkbox></Checkbox>
                </td>
                <td>Boyolali</td>
                <td>Recovery</td>
                <td>IN12345678</td>
                <td>Jl. Kelud</td>
                <td>PT. A</td>
              </tr>
            </tbody>
          </Table>
        </Card>
        <Flex>
          <Container className="mt-4 p-0" style={{ width: 435 }}>
            <ButtonWithIcon onClick={openAddLOP} leftIcon={<IconCirclePlus />}>
              Add LOP
            </ButtonWithIcon>
          </Container>
          <Container className="mt-4" style={{ width: 435 }}>
            <ButtonWithIcon leftIcon={<IconDownload />}>
              Download .xlsx
            </ButtonWithIcon>
          </Container>
        </Flex>
      </Container>
    </>
  );
};

export default App;
