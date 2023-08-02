import { useForm } from "@mantine/form";

export default function useImportDesignatorForm() {
  const importForm = useForm<{
    file: File | null;
    mode: "preview" | "full_import";
    firstValueRow: number;
    designatorHeaderAddress: string;
    workDescriptionHeaderAddress: string;
    unitHeaderAddress: string;
    materialPriceHeaderAddress: string;
    servicePriceHeaderAddress: string;
  }>({
    initialValues: {
      file: null,
      mode: "preview",
      firstValueRow: 1,
      designatorHeaderAddress: "",
      workDescriptionHeaderAddress: "",
      unitHeaderAddress: "",
      materialPriceHeaderAddress: "",
      servicePriceHeaderAddress: "",
    },
  });
  return importForm;
}
