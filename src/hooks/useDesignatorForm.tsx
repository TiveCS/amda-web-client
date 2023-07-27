import { Designator, DesignatorFormData } from "@api/types/designators";
import { isInRange, isNotEmpty, useForm } from "@mantine/form";

interface DesignatorFormProps {
  designator?: Designator | null;
}

export default function useDesignatorForm({
  designator = null,
}: DesignatorFormProps) {
  const form = useForm<DesignatorFormData>({
    initialValues: {
      name: designator?.name ?? "",
      isMaterial: designator?.isMaterial ?? false,
      pricePerUnit: designator?.pricePerUnit ?? 0,
      unit: designator?.unit ?? "",
      workDescription: designator?.workDescription ?? "",
    },
    validate: {
      name: isNotEmpty("Nama Designator tidak boleh kosong"),
      pricePerUnit: isInRange({ min: 1 }, "Harga Satuan harus lebih dari 0"),
      unit: isNotEmpty("Satuan tidak boleh kosong"),
      workDescription: isNotEmpty("Jenis Pekerjaan tidak boleh kosong"),
    },
  });

  const updateForm = (designator: Designator) => {
    form.setValues({
      name: designator.name,
      isMaterial: designator.isMaterial,
      pricePerUnit: designator.pricePerUnit,
      unit: designator.unit,
      workDescription: designator.workDescription,
    });
  };

  return { form, updateForm };
}
