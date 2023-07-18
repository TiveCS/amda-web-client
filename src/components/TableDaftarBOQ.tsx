import {
  Badge,
  Container,
  Flex,
  Modal,
  NumberInput,
  Text,
  FileInput,
  TextInput,
} from "@mantine/core";
import { PropsWithChildren } from "react";
import ButtonAMDA from "./ButtonAMDA";
import { IconEdit, IconEye } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";

interface Props {
  noTiket: string;
  workDesc: string;
  statusVolume?: string;
  statusEvidence?: string;
  catatan: string;
  statusAcc?: string;
}

const TableDaftarBOQ = ({
  noTiket,
  workDesc,
  statusVolume = "belum lengkap",
  statusEvidence = "belum upload",
  catatan,
  statusAcc = "belum acc",
}: PropsWithChildren<Props>) => {
  const [openedCatatanUT, { open: openCatatanUT, close: closeCatatanUT }] =
    useDisclosure(false);
  const [openedEvidence, { open: openEvidence, close: closeEvidence }] =
    useDisclosure(false);
  const [openedAddVolume, { open: openAddVolume, close: closeAddVolume }] =
    useDisclosure(false);

  const completed = statusVolume === "sudah lengkap";
  const uploaded = statusEvidence === "sudah upload";
  const approved = statusAcc === "sudah acc";

  return (
    <>
      <Modal
        opened={openedCatatanUT}
        onClose={closeCatatanUT}
        title="Catatan Uji Terima"
      >
        <p>{catatan}</p>
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
        <ButtonAMDA onClick={closeEvidence}>Tambah</ButtonAMDA>
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
        <ButtonAMDA onClick={closeAddVolume}>Tambah</ButtonAMDA>
      </Modal>
      <tr>
        <td>{noTiket}</td>
        <td>{workDesc}</td>
        <td>
          <Badge color={completed ? "green" : "red"} variant="outline">
            {statusVolume}
          </Badge>
        </td>
        <td>
          <ButtonAMDA onClick={openAddVolume}>
            <IconEdit />
          </ButtonAMDA>
        </td>
        <td>
          <Badge
            color={completed ? (uploaded ? "green" : "red") : "gray"}
            variant="outline"
          >
            {statusEvidence}
          </Badge>
        </td>
        <td>
          <ButtonAMDA onClick={openEvidence} disabled={!completed}>
            <IconEdit />
          </ButtonAMDA>
        </td>
        <td>
          <ButtonAMDA onClick={openCatatanUT} disabled={!uploaded}>
            <IconEye />
          </ButtonAMDA>
        </td>
        <td>
          <Badge
            color={uploaded ? (approved ? "green" : "red") : "gray"}
            variant="outline"
          >
            {statusAcc}
          </Badge>
        </td>
      </tr>
    </>
  );
};

export default TableDaftarBOQ;
