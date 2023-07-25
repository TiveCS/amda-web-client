import ButtonAMDA from "@components/ButtonAMDA";
import { Group, Modal, Radio, Select, TextInput } from "@mantine/core";
import { DateInput, TimeInput } from "@mantine/dates";

interface AddKegiatanModalProps {
  openedAddKegiatan: boolean;
  closeAddKegiatan: () => void;
}

export default function AddKegiatanModal({
  closeAddKegiatan,
  openedAddKegiatan,
}: AddKegiatanModalProps) {
  return (
    <Modal
      opened={openedAddKegiatan}
      onClose={closeAddKegiatan}
      title="Add Kegiatan"
      size={"xl"}
      padding={"xl"}
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
      <ButtonAMDA onClick={closeAddKegiatan}>Tambah</ButtonAMDA>
    </Modal>
  );
}
