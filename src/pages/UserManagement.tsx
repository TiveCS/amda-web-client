import {
  Button,
  Card,
  Checkbox,
  Container,
  Grid,
  Modal,
  PasswordInput,
  Select,
  Table,
  TextInput,
} from "@mantine/core";
import {
  IconCirclePlus,
  IconTrash,
  IconEdit,
  IconFilter,
  IconEye,
} from "@tabler/icons-react";
import SearchBar from "../components/SearchBar/SearchBar";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import ButtonWithIcon from "@components/ButtonWithIcon";

const App: React.FC = () => {
  const handleSearch = (searchTerm: string) => {
    // Perform search logic using the search term
    console.log("Searching for:", searchTerm);
  };

  const [openedPassword, { open: openPassword, close: closePassword }] =
    useDisclosure(false);
  const [openedAddUser, { open: openAddUser, close: closeAddUser }] =
    useDisclosure(false);

  const form = useForm({
    initialValues: {
      username: "",
      name: "",
      password: "",
    },
  });

  return (
    <>
      <Modal opened={openedPassword} onClose={closePassword} title="Password">
        <p>!n!p4sw0rd</p>
      </Modal>
      <Modal opened={openedAddUser} onClose={closeAddUser} title="Add User">
        <Select
          withAsterisk
          label="Role"
          placeholder="Select one"
          data={[
            { value: "SuperAdmin", label: "Super Admin" },
            { value: "TAAdmin", label: "TA Admin" },
            { value: "TAMaintenance", label: "TA Maintenance" },
            { value: "TAUjiTerima", label: "TA Uji Terima" },
            { value: "AdminMitra", label: "Admin Mitra" },
          ]}
        />
        <TextInput withAsterisk label="Username" placeholder="" />
        <TextInput withAsterisk label="Nama" placeholder="" />
        <Select
          withAsterisk
          label="Perusahaan"
          placeholder="Select one"
          data={[
            { value: "1", label: "Telkom Witel Solo" },
            { value: "2", label: "PT. A" },
            { value: "3", label: "PT. B" },
            { value: "4", label: "PT. C" },
          ]}
        />
        <PasswordInput withAsterisk label="Password" placeholder="Password" />
        <br />
        <ButtonWithIcon onClick={closeAddUser}>Tambah</ButtonWithIcon>
      </Modal>
      <Container className="mt-8 font-['Poppins']">
        <p className="font-semibold text-xl text-black">Daftar User</p>
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
            <ButtonWithIcon onClick={openAddUser} leftIcon={<IconCirclePlus />}>
              Add User
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
                <th>#</th>
                <th>Role</th>
                <th>Username</th>
                <th>Nama</th>
                <th>Perusahaan</th>
                <th>Password</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Checkbox></Checkbox>
                </td>
                <td>TA Admin</td>
                <td>aufamutia</td>
                <td>Aufa Mutia</td>
                <td>Telkom Witel Solo</td>
                <td>
                  <ButtonWithIcon onClick={openPassword} variant="subtle">
                    <IconEye></IconEye>
                  </ButtonWithIcon>
                </td>
              </tr>
              <tr>
                <td>
                  <Checkbox></Checkbox>
                </td>
                <td>TA Admin</td>
                <td>aufamutia</td>
                <td>Aufa Mutia</td>
                <td>Telkom Witel Solo</td>
                <td>
                  <ButtonWithIcon onClick={openPassword} variant="subtle">
                    <IconEye></IconEye>
                  </ButtonWithIcon>
                </td>
              </tr>
              <tr>
                <td>
                  <Checkbox></Checkbox>
                </td>
                <td>TA Admin</td>
                <td>aufamutia</td>
                <td>Aufa Mutia</td>
                <td>Telkom Witel Solo</td>
                <td>
                  <ButtonWithIcon onClick={openPassword} variant="subtle">
                    <IconEye></IconEye>
                  </ButtonWithIcon>
                </td>
              </tr>
              <tr>
                <td>
                  <Checkbox></Checkbox>
                </td>
                <td>TA Admin</td>
                <td>aufamutia</td>
                <td>Aufa Mutia</td>
                <td>Telkom Witel Solo</td>
                <td>
                  <ButtonWithIcon onClick={openPassword} variant="subtle">
                    <IconEye></IconEye>
                  </ButtonWithIcon>
                </td>
              </tr>
              <tr>
                <td>
                  <Checkbox></Checkbox>
                </td>
                <td>TA Admin</td>
                <td>aufamutia</td>
                <td>Aufa Mutia</td>
                <td>Telkom Witel Solo</td>
                <td>
                  <ButtonWithIcon onClick={openPassword} variant="subtle">
                    <IconEye></IconEye>
                  </ButtonWithIcon>
                </td>
              </tr>
              <tr>
                <td>
                  <Checkbox></Checkbox>
                </td>
                <td>TA Admin</td>
                <td>aufamutia</td>
                <td>Aufa Mutia</td>
                <td>Telkom Witel Solo</td>
                <td>
                  <ButtonWithIcon onClick={openPassword} variant="subtle">
                    <IconEye></IconEye>
                  </ButtonWithIcon>
                </td>
              </tr>
              <tr>
                <td>
                  <Checkbox></Checkbox>
                </td>
                <td>TA Admin</td>
                <td>aufamutia</td>
                <td>Aufa Mutia</td>
                <td>Telkom Witel Solo</td>
                <td>
                  <ButtonWithIcon onClick={openPassword} variant="subtle">
                    <IconEye></IconEye>
                  </ButtonWithIcon>
                </td>
              </tr>
              <tr>
                <td>
                  <Checkbox></Checkbox>
                </td>
                <td>TA Admin</td>
                <td>aufamutia</td>
                <td>Aufa Mutia</td>
                <td>Telkom Witel Solo</td>
                <td>
                  <ButtonWithIcon onClick={openPassword} variant="subtle">
                    <IconEye></IconEye>
                  </ButtonWithIcon>
                </td>
              </tr>
              <tr>
                <td>
                  <Checkbox></Checkbox>
                </td>
                <td>TA Admin</td>
                <td>aufamutia</td>
                <td>Aufa Mutia</td>
                <td>Telkom Witel Solo</td>
                <td>
                  <ButtonWithIcon onClick={openPassword} variant="subtle">
                    <IconEye></IconEye>
                  </ButtonWithIcon>
                </td>
              </tr>
              <tr>
                <td>
                  <Checkbox></Checkbox>
                </td>
                <td>TA Admin</td>
                <td>aufamutia</td>
                <td>Aufa Mutia</td>
                <td>Telkom Witel Solo</td>
                <td>
                  <ButtonWithIcon onClick={openPassword} variant="subtle">
                    <IconEye></IconEye>
                  </ButtonWithIcon>
                </td>
              </tr>
              <tr>
                <td>
                  <Checkbox></Checkbox>
                </td>
                <td>TA Admin</td>
                <td>aufamutia</td>
                <td>Aufa Mutia</td>
                <td>Telkom Witel Solo</td>
                <td>
                  <ButtonWithIcon onClick={openPassword} variant="subtle">
                    <IconEye></IconEye>
                  </ButtonWithIcon>
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
