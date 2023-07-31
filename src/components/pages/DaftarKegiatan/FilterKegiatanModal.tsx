import ButtonAMDA from "@components/ButtonAMDA";
import { Flex, Grid, Modal, Select } from "@mantine/core";
import { useForm } from "@mantine/form";

interface FilterModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

type FilterFormValues = {
  sto: string | null;
  workType: string | null;
  ticketLocation: string | null;
  mitra: string | null;
};

export default function FilterModal({ closeModal, isOpen }: FilterModalProps) {
  const filterForm = useForm<FilterFormValues>({
    validateInputOnChange: false,
  });

  return (
    <Modal
      opened={isOpen}
      onClose={closeModal}
      title="Filter Kegiatan"
      centered
      padding={"xl"}
    >
      <Flex direction={"column"} gap={"md"}>
        <Select
          id="filter-sto"
          data={[]}
          label="STO"
          nothingFound="STO tidak ditemukan."
          {...filterForm.getInputProps("sto")}
          onChange={(value) => {
            filterForm.setFieldValue("sto", value);
          }}
        />

        <Select
          id="filter-mitra"
          data={[]}
          label="Mitra"
          nothingFound="Mitra tidak ditemukan."
          {...filterForm.getInputProps("mitra")}
          onChange={(value) => {
            filterForm.setFieldValue("mitra", value);
          }}
        />

        <Select
          id="filter-work-type"
          data={["Recovery", "Relokasi"]}
          label="Jenis Pekerjaan"
          {...filterForm.getInputProps("workType")}
        />
      </Flex>

      <Flex direction={"row"} justify={"space-between"} className="mt-8">
        <ButtonAMDA
          variant="white"
          onClick={() => {
            filterForm.reset();
            closeModal();
          }}
        >
          Batal
        </ButtonAMDA>
        <ButtonAMDA>Filter</ButtonAMDA>
      </Flex>
    </Modal>
  );
}
