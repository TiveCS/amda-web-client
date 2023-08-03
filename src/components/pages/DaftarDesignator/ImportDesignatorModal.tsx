import ButtonAMDA from "@components/ButtonAMDA";
import useImportDesignatorForm from "@hooks/useImportDesignatorForm";
import useImportDesignatorFullImportRequest from "@hooks/useImportDesignatorFullImportRequest";
import useImportDesignatorPreviewMutation from "@hooks/useImportDesignatorPreviewMutation";
import {
  Alert,
  FileInput,
  Flex,
  Group,
  LoadingOverlay,
  Modal,
  NumberInput,
  ScrollArea,
  Select,
  Stack,
  Stepper,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { IconAlertCircle, IconFileUpload } from "@tabler/icons-react";
import { useState } from "react";

interface ImportDesignatorModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function ImportDesignatorModal({
  onClose,
  opened,
}: ImportDesignatorModalProps) {
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const importForm = useImportDesignatorForm();

  const previewMutation = useImportDesignatorPreviewMutation({
    importForm,
    nextStep,
  });

  const { mutation: fullImportMutation } = useImportDesignatorFullImportRequest(
    { importForm, closeModal: onClose }
  );

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Import Data Designator"
      size={"xl"}
      padding={"xl"}
      closeOnClickOutside={false}
      closeOnEscape={false}
    >
      <LoadingOverlay
        visible={previewMutation.isLoading || fullImportMutation.isLoading}
      />

      <Stepper active={active} onStepClick={setActive} breakpoint="sm">
        <Stepper.Step
          label="Konfigurasi Impor"
          description="Setting untuk impor"
        >
          <Stack spacing={"md"}>
            <FileInput
              withAsterisk
              placeholder="File designator (.xlsx)"
              label="Designator File"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              icon={<IconFileUpload size={"1rem"} />}
              {...importForm.getInputProps("file")}
            />

            <Group grow>
              <NumberInput
                withAsterisk
                label="Baris Awal Data"
                placeholder="contoh: 9"
                {...importForm.getInputProps("firstValueRow")}
              />

              <Select
                withAsterisk
                label="Mode Import"
                data={[
                  { value: "preview", label: "Preview" },
                  { value: "full_import", label: "Full Import" },
                ]}
                {...importForm.getInputProps("mode")}
              />
            </Group>

            <Group grow>
              <TextInput
                withAsterisk
                label="Alamat Kolom Designator"
                placeholder="contoh: B8"
                {...importForm.getInputProps("designatorHeaderAddress")}
              />
              <TextInput
                withAsterisk
                label="Alamat Kolom Satuan"
                placeholder="contoh: D8"
                {...importForm.getInputProps("unitHeaderAddress")}
              />
            </Group>

            <Group grow>
              <TextInput
                withAsterisk
                label="Alamat Kolom Uraian Pekerjaan"
                placeholder="contoh: C8"
                {...importForm.getInputProps("workDescriptionHeaderAddress")}
              />
            </Group>

            <Group grow>
              <TextInput
                withAsterisk
                label="Alamat Kolom Harga Material"
                placeholder="contoh: E8"
                {...importForm.getInputProps("materialPriceHeaderAddress")}
              />
              <TextInput
                withAsterisk
                label="Alamat Kolom Harga Jasa"
                placeholder="contoh: F8"
                {...importForm.getInputProps("servicePriceHeaderAddress")}
              />
            </Group>
          </Stack>

          <Flex direction={"row-reverse"} align={"center"} gap={"md"} mt={"xl"}>
            <ButtonAMDA
              onClick={() => void previewMutation.mutateAsync()}
              loading={previewMutation.isLoading}
              disabled={
                previewMutation.isLoading ||
                importForm.values.file === undefined
              }
            >
              Lihat Preview
            </ButtonAMDA>

            <ButtonAMDA variant="white" onClick={onClose}>
              Batal
            </ButtonAMDA>
          </Flex>
        </Stepper.Step>

        <Stepper.Step
          disabled={!previewMutation.data?.data}
          label="Preview Data"
          description="Melihat sampel data"
        >
          <ScrollArea.Autosize className="max-h-[60%]">
            <Table withBorder withColumnBorders striped>
              <thead>
                <tr>
                  <th>Designator</th>
                  <th>Uraian Pekerjaan</th>
                  <th>Jenis</th>
                  <th>Satuan</th>
                  <th>Harga Satuan</th>
                </tr>
              </thead>
              <tbody>
                {!previewMutation.data?.data && (
                  <tr>
                    <td colSpan={5} className="text-center">
                      Tidak ada data
                    </td>
                  </tr>
                )}

                {previewMutation.data?.data?.map((designator) => (
                  <tr key={designator.designator}>
                    <td>{designator.designator}</td>
                    <td>{designator.workDescription}</td>
                    <td>{designator.isMaterial ? "Material" : "Jasa"}</td>
                    <td>{designator.unit}</td>
                    <td>{designator.pricePerUnit}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </ScrollArea.Autosize>

          <Flex direction={"row"} justify={"space-between"} className="mt-8">
            <ButtonAMDA
              variant="white"
              onClick={() => {
                previewMutation.reset();
                prevStep();
              }}
            >
              Kembali
            </ButtonAMDA>

            <ButtonAMDA onClick={() => nextStep()}>Lanjutkan</ButtonAMDA>
          </Flex>
        </Stepper.Step>

        <Stepper.Step
          disabled={!previewMutation.data?.data}
          label="Konfirmasi Impor"
          description="Mengkonfirmasi impor file"
        >
          <Alert
            title="Lanjutkan Impor?"
            icon={<IconAlertCircle />}
            color="red"
            my={"lg"}
            variant="outline"
          >
            <Text>
              Lanjutkan import data dari file{" "}
              <strong>{importForm.values.file?.name}</strong>?
            </Text>
            <Text>
              Harap cek kembali sampel data yang akan diimpor. Data yang sudah
              diimpor tidak dapat diubah.
            </Text>
          </Alert>

          <ScrollArea.Autosize className="max-h-[60%]">
            <Table withBorder withColumnBorders striped>
              <thead>
                <tr>
                  <th>Designator</th>
                  <th>Uraian Pekerjaan</th>
                  <th>Jenis</th>
                  <th>Satuan</th>
                  <th>Harga Satuan</th>
                </tr>
              </thead>
              <tbody>
                {!previewMutation.data?.data && (
                  <tr>
                    <td colSpan={5} className="text-center">
                      Tidak ada data
                    </td>
                  </tr>
                )}

                {previewMutation.data?.data?.map((designator) => (
                  <tr key={designator.designator}>
                    <td>{designator.designator}</td>
                    <td>{designator.workDescription}</td>
                    <td>{designator.isMaterial ? "Material" : "Jasa"}</td>
                    <td>{designator.unit}</td>
                    <td>{designator.pricePerUnit}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </ScrollArea.Autosize>

          <Flex direction={"row"} justify={"space-between"} className="mt-8">
            <ButtonAMDA
              variant="white"
              onClick={() => {
                prevStep();
              }}
            >
              Kembali
            </ButtonAMDA>

            <ButtonAMDA
              loading={fullImportMutation.isLoading}
              onClick={() => void fullImportMutation.mutateAsync()}
            >
              Konfirmasi Impor
            </ButtonAMDA>
          </Flex>
        </Stepper.Step>
      </Stepper>
    </Modal>
  );
}
