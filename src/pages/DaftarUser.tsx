import {
  Card,
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
} from "@tabler/icons-react";
import SearchBar from "../components/SearchBar/SearchBar";
import { useDisclosure } from "@mantine/hooks";
import ButtonAMDA from "@components/ButtonAMDA";
import TableDaftarUser from "@components/TableDaftarUser";

const App: React.FC = () => {
  const handleSearch = (searchTerm: string) => {
    // Perform search logic using the search term
    console.log("Searching for:", searchTerm);
  };

  const [openedAddUser, { open: openAddUser, close: closeAddUser }] =
    useDisclosure(false);

  return (
    <>
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
        <ButtonAMDA onClick={closeAddUser}>Tambah</ButtonAMDA>
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
            <ButtonAMDA variant="outline">
              <IconFilter></IconFilter>
            </ButtonAMDA>{" "}
            <ButtonAMDA variant="outline">
              <IconEdit></IconEdit>
            </ButtonAMDA>{" "}
            <ButtonAMDA variant="outline">
              <IconTrash></IconTrash>
            </ButtonAMDA>{" "}
            <ButtonAMDA onClick={openAddUser} leftIcon={<IconCirclePlus />}>
              Add User
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
                <th>Role</th>
                <th>Username</th>
                <th>Nama</th>
                <th>Perusahaan</th>
                <th>Password</th>
              </tr>
            </thead>
            <tbody>
              <TableDaftarUser
                role="TA Admin"
                username="aufamutia"
                name="Aufa Mutia"
                mitra="Telkom University"
                password="aufmut"
              ></TableDaftarUser>
              <TableDaftarUser
                role="Admin Mitra"
                username="fathan"
                name="Fathan"
                mitra="Telkom Solo"
                password="inipassword"
              ></TableDaftarUser>
            </tbody>
          </Table>
        </Card>
      </Container>
    </>
  );
};

export default App;