import { Designator, DesignatorFormData } from "@api/types/designators";
import ButtonAMDA from "@components/ButtonAMDA";
import useEditDesignatorMutation from "@hooks/useEditDesignatorMutation";
import { Checkbox, Flex, Modal, NumberInput, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

interface EditDesignatorModalProps {
  form: UseFormReturnType<DesignatorFormData>;
  designator: Designator | null;
  onClose: () => void;
  opened: boolean;
  setSelectedDesignators: React.Dispatch<React.SetStateAction<Designator[]>>;
}

export default function EditDesignatorModal({
  form,
  designator,
  onClose,
  opened,
  setSelectedDesignators,
}: EditDesignatorModalProps) {
  const editDesignatorMutation = useEditDesignatorMutation({
    form,
    selectedDesignator: designator,
    setSelectedDesignators,
    closeModal: onClose,
  });

  return (
    <Modal
      title="Add Designator"
      opened={opened}
      onClose={onClose}
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
            min={1}
            withAsterisk
            {...form.getInputProps("pricePerUnit")}
          />
        </Flex>

        <TextInput
          label="Jenis Pekerjaan"
          placeholder="Contoh: Instalasi, Pengadaan"
          min={1}
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
            loading={editDesignatorMutation.isLoading}
            onClick={() => {
              if (form.validate().hasErrors) return;
              editDesignatorMutation.mutate();
            }}
          >
            Ubah
          </ButtonAMDA>
          <ButtonAMDA variant="white" onClick={onClose}>
            Batal
          </ButtonAMDA>
        </Flex>
      </Flex>
    </Modal>
  );
}
