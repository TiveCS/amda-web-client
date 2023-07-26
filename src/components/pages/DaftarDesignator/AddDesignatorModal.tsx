import ButtonAMDA from "@components/ButtonAMDA";
import useAddDesignatorMutation from "@hooks/useAddDesignatorMutation";
import useDesignatorForm from "@hooks/useDesignatorForm";
import { Checkbox, Flex, Modal, NumberInput, TextInput } from "@mantine/core";

interface AddDesignatorModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function AddDesignatorModal(props: AddDesignatorModalProps) {
  const { form } = useDesignatorForm({});
  const addMutation = useAddDesignatorMutation({
    form,
    closeModal: props.onClose,
  });

  return (
    <Modal
      title="Add Designator"
      opened={props.opened}
      onClose={props.onClose}
      padding={"xl"}
    >
      <Flex direction={"column"} gap={"md"}>
        <TextInput
          label="Nama Designator"
          placeholder="Nama Designator"
          withAsterisk
          {...form.getInputProps("name")}
        />

        <Flex gap={"md"}>
          <TextInput
            label="Satuan"
            placeholder="Contoh: Mtr, Core"
            withAsterisk
            {...form.getInputProps("unit")}
          />

          <NumberInput
            label="Harga Satuan"
            placeholder="100"
            defaultValue={0}
            min={1}
            withAsterisk
            {...form.getInputProps("pricePerUnit")}
          />
        </Flex>

        <TextInput
          label="Jenis Pekerjaan"
          placeholder="Contoh: Instalasi, Pengadaan"
          withAsterisk
          {...form.getInputProps("workDescription")}
        />

        <Checkbox
          label="Designator bertipe Material"
          className="mt-4"
          {...form.getInputProps("isMaterial", { type: "checkbox" })}
        />

        <Flex direction={"column"} gap={"md"} className="mt-4">
          <ButtonAMDA
            loading={addMutation.isLoading}
            onClick={() => {
              if (form.validate().hasErrors) return;
              addMutation.mutate();
            }}
          >
            Tambah
          </ButtonAMDA>
          <ButtonAMDA variant="white" onClick={props.onClose}>
            Batal
          </ButtonAMDA>
        </Flex>
      </Flex>
    </Modal>
  );
}
