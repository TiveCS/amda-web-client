import { addMitra, getListMitra } from "@api/mitra";
import { MitraResponsePayload } from "@api/types/mitra";
import ButtonAMDA from "@components/ButtonAMDA";
import {
  Card,
  Checkbox,
  Container,
  Flex,
  Grid,
  Modal,
  Table,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import {
  IconCirclePlus,
  IconEdit,
  IconFilter,
  IconTrash,
} from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SearchBar from "../components/SearchBar/SearchBar";

const DaftarMitra: React.FC = () => {
  const addMitraForm = useForm({
    initialValues: {
      name: "",
    },
  });

  const queryClient = useQueryClient();
  const { data: getMitraData, isLoading } = useQuery({
    queryKey: ["mitra"],
    queryFn: async () => getListMitra(),
  });

  const addMitraMutation = useMutation({
    mutationFn: async () => addMitra(addMitraForm.values),
    onSuccess: async () => {
      addMitraForm.reset();
      closeAddMitra();
      await queryClient.invalidateQueries(["mitra"]);

      showNotification({
        title: "Success",
        message: "Mitra berhasil ditambahkan",
        color: "green",
      });
    },
    onError: (error) => {
      if (error instanceof Error) {
        showNotification({
          title: "Error",
          message: error.message ?? "Gagal menambahkan mitra",
          color: "red",
        });

        return;
      }

      showNotification({
        title: "Error",
        message: "Terjadi kesalahan internal",
        color: "red",
      });
    },
    onMutate: () => {
      showNotification({
        title: "Loading",
        message: "Sedang menambahkan mitra...",
        color: "blue",
      });
    },
  });

  const handleSearch = (searchTerm: string) => {
    // Perform search logic using the search term
    console.log("Searching for:", searchTerm);
  };

  const [openedAddMitra, { open: openAddMitra, close: closeAddMitra }] =
    useDisclosure(false);

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <Modal
        opened={openedAddMitra}
        onClose={closeAddMitra}
        title="Add Mitra"
        padding={"xl"}
      >
        <Flex direction={"column"} gap={24}>
          <TextInput
            withAsterisk
            label="Nama Mitra"
            placeholder="Contoh: Telkom Indonesia"
            {...addMitraForm.getInputProps("name")}
          />

          <ButtonAMDA
            type="button"
            loading={addMitraMutation.isLoading}
            onClick={() => {
              addMitraMutation.mutate();
            }}
          >
            Tambah
          </ButtonAMDA>
        </Flex>
      </Modal>
      <Container className="mt-8 font-poppins" fluid>
        <p className="font-semibold text-xl text-black">Daftar Mitra</p>
      </Container>
      <Container className="mt-5 font-poppins" fluid>
        <Grid justify="space-between" align="flex-start" columns={12}>
          <Grid.Col span={7}>
            <SearchBar onSearch={handleSearch} />
          </Grid.Col>
          <Grid.Col span={4}>
            <Flex justify={"space-between"}>
              <ButtonAMDA variant="outline">
                <IconFilter></IconFilter>
              </ButtonAMDA>{" "}
              <ButtonAMDA variant="outline">
                <IconEdit></IconEdit>
              </ButtonAMDA>{" "}
              <ButtonAMDA variant="outline">
                <IconTrash></IconTrash>
              </ButtonAMDA>{" "}
              <ButtonAMDA onClick={openAddMitra} leftIcon={<IconCirclePlus />}>
                Add Mitra
              </ButtonAMDA>
            </Flex>
          </Grid.Col>
        </Grid>
      </Container>
      <Container fluid>
        <Card withBorder className="mt-4 overflow-y-scroll max-h-96">
          <Table striped withBorder withColumnBorders>
            <thead>
              <tr>
                <th>#</th>
                <th>Nama Mitra</th>
              </tr>
            </thead>
            <tbody>
              {getMitraData?.data?.map((mitra) => (
                <MitraItemComponent key={mitra.id} mitra={mitra} />
              ))}
            </tbody>
          </Table>
        </Card>
      </Container>
    </>
  );
};

function MitraItemComponent(props: { mitra: MitraResponsePayload }) {
  return (
    <tr>
      <td>
        <Checkbox name="selectedMitra[]" value={props.mitra.id}></Checkbox>
      </td>
      <td>{props.mitra.name}</td>
    </tr>
  );
}

export default DaftarMitra;
