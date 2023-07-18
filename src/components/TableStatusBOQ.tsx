import {
  Badge,
  Container,
  Flex,
  Modal,
  Text,
  TextInput,
  Image,
  Textarea,
  Group,
  NumberInput,
} from "@mantine/core";
import { PropsWithChildren } from "react";
import ButtonAMDA from "./ButtonAMDA";
import { IconEdit, IconEye } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";

interface Props {
  noTiket: string;
  workDesc: string;
  statusAcc?: string;
}

const TableStatusBOQ = ({
  noTiket,
  workDesc,
  statusAcc = "belum acc",
}: PropsWithChildren<Props>) => {
  const [openedCatatanUT, { open: openCatatanUT, close: closeCatatanUT }] =
    useDisclosure(false);
  const [openedEvidence, { open: openEvidence, close: closeEvidence }] =
    useDisclosure(false);
  const [openedAddVolume, { open: openAddVolume, close: closeAddVolume }] =
    useDisclosure(false);
  const [openedButtonAcc, { open: openButtonAcc, close: closeButtonAcc }] =
    useDisclosure(false);

  const approved = statusAcc === "sudah acc";

  return (
    <>
      <Modal
        opened={openedButtonAcc}
        onClose={closeButtonAcc}
        title="Acc Kegiatan"
      >
        <p>Pastikan dokumen kegiatan sudah lengkap dan sesuai!</p>
        <br />
        <ButtonAMDA onClick={closeButtonAcc}>Acc</ButtonAMDA>
      </Modal>
      <Modal
        opened={openedCatatanUT}
        onClose={closeCatatanUT}
        title="Catatan Uji Terima"
      >
        <Textarea placeholder="Tambahkan catatan" withAsterisk />
        <br />
        <ButtonAMDA onClick={closeCatatanUT}>Tambah</ButtonAMDA>
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
      <tr>
        <td>{noTiket}</td>
        <td>{workDesc}</td>
        <td>
          <ButtonAMDA onClick={openAddVolume}>
            <IconEye />
          </ButtonAMDA>
        </td>
        <td>
          <ButtonAMDA onClick={openEvidence}>
            <IconEye />
          </ButtonAMDA>
        </td>
        <td>
          <ButtonAMDA onClick={openCatatanUT}>
            <IconEdit />
          </ButtonAMDA>
        </td>
        <td>
          <Badge color={approved ? "green" : "red"} variant="outline">
            {statusAcc}
          </Badge>
        </td>
        <td>
          <ButtonAMDA onClick={openButtonAcc}>Acc</ButtonAMDA>
        </td>
      </tr>
    </>
  );
};

export default TableStatusBOQ;
