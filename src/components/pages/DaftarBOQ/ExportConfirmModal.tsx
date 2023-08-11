import { getBoqReport } from "@api/boq-reports";
import { getLops } from "@api/lops";
import { getListSto } from "@api/sto";
import ButtonAMDA from "@components/ButtonAMDA";
import {
  Alert,
  Button,
  Flex,
  LoadingOverlay,
  Modal,
  ScrollArea,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { isInRange, useForm } from "@mantine/form";
import { useDebouncedValue } from "@mantine/hooks";
import { notifications, showNotification } from "@mantine/notifications";
import { IconAlertTriangle, IconCheck, IconX } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

interface ExportConfirmModalProps {
  opened: boolean;
  onClose(): void;
  ticketIdentifiers: string[];
}

export default function ExportConfirmModal({
  onClose,
  opened,
  ticketIdentifiers: tickets,
}: ExportConfirmModalProps) {
  const exportSearchForm = useForm({
    initialValues: {
      sto: "",
      lop: "",
    },
  });

  const [stoDebounced] = useDebouncedValue(exportSearchForm.values.sto, 500);
  const [lopDebounced] = useDebouncedValue(exportSearchForm.values.lop, 500);

  const exportReportForm = useForm({
    initialValues: { stoId: -1, lopId: -1 },
    validate: {
      stoId: isInRange({ min: 1 }, "Silahkan pilih STO"),
      lopId: isInRange({ min: 1 }, "Silahkan pilih LOP"),
    },
  });

  const { refetch: refetchListSto, ...getListStoQuery } = useQuery({
    queryKey: ["daftar_boq_sto"],
    queryFn: async () => {
      const res = await getListSto({
        search: stoDebounced,
        take: 20,
      });

      return res.data.map((sto) => ({
        value: sto.id.toString(),
        label: sto.name,
      }));
    },
  });

  const { refetch: refetchListLop, ...getListLopQuery } = useQuery({
    queryKey: ["daftar_boq_lop"],
    queryFn: async () => {
      const res = await getLops({
        search: lopDebounced,
        take: 20,
      });

      return res.data.map((lop) => ({
        value: lop.id.toString(),
        label: lop.name,
      }));
    },
  });

  const exportMutation = useMutation({
    mutationFn: async () => {
      const res = await getBoqReport({
        lopId: exportReportForm.values.lopId,
        stoId: exportReportForm.values.stoId,
        ticketIdentifiers: tickets,
      });

      return res;
    },
    onMutate: () => {
      showNotification({
        id: "export-boq-notification",
        title: "Loading",
        message: "Sedang mengekspor laporan BOQ...",
        color: "blue",
        loading: exportMutation.isLoading,
      });
    },
    onSuccess: (res) => {
      notifications.update({
        id: "export-boq-notification",
        title: "Ekspor Berhasil",
        withCloseButton: true,
        autoClose: false,
        message: (
          <>
            <Button
              variant="subtle"
              color="green"
              onClick={() => window.open(res, "_blank")}
            >
              Buka File
            </Button>
          </>
        ),
        color: "green",
        icon: <IconCheck />,
      });
    },
    onError: (err) => {
      if (err instanceof Error) {
        notifications.update({
          id: "export-boq-notification",
          title: "Error",
          message:
            err.message ?? "Terjadi kesalahan saat mengekspor laporan BOQ",
          color: "red",
          icon: <IconX />,
        });
        return;
      }
      notifications.update({
        id: "export-boq-notification",
        title: "Error",
        message: "Terjadi kesalahan internal",
        color: "red",
        icon: <IconX />,
      });
    },
  });

  useEffect(() => {
    const refetch = async () => {
      await refetchListLop();
    };

    void refetch();
  }, [refetchListLop, lopDebounced]);

  useEffect(() => {
    const refetch = async () => {
      await refetchListSto();
    };

    void refetch();
  }, [refetchListSto, stoDebounced]);

  const handleConfirmExport = async () => {
    if (exportReportForm.validate().hasErrors) return;

    await exportMutation.mutateAsync();
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {
        exportReportForm.reset();
        onClose();
      }}
      title="Ekspor XLSX"
      size="lg"
      padding="xl"
    >
      <LoadingOverlay visible={exportMutation.isLoading} />

      <ScrollArea.Autosize className="max-h-[50%]">
        <Stack spacing={"lg"} className="mb-4">
          <Alert
            title="Ekspor Laporan BOQ"
            color="red"
            icon={<IconAlertTriangle />}
          >
            <Text>
              Apakah anda ingin mengekspor tiket yang ditampilkan saat ini?
            </Text>

            <Text className="mt-4">
              <strong>Perhatian:</strong> Ekspor tiket akan memakan waktu yang
              cukup lama jika data cukup banyak, harap bersabar.
            </Text>

            <Text className="mt-4">
              Jumlah tiket yang akan diekspor: <strong>{tickets.length}</strong>
            </Text>
          </Alert>

          <Select
            withAsterisk
            searchable
            nothingFound="Tidak ada Segment yang ditemukan"
            label="Segment"
            placeholder="Pilih Segment"
            limit={20}
            data={getListLopQuery.data ?? []}
            onSearchChange={(value) => {
              exportSearchForm.setFieldValue("lop", value);
            }}
            error={exportReportForm.errors.lopId}
            onChange={(value) => {
              if (value === null) return;
              const lopId = parseInt(value);
              exportReportForm.setFieldValue("lopId", lopId);
            }}
          />

          <Select
            withAsterisk
            searchable
            nothingFound="Tidak ada STO yang ditemukan"
            label="STO"
            placeholder="Pilih STO"
            limit={20}
            data={getListStoQuery.data ?? []}
            onSearchChange={(value) => {
              exportSearchForm.setFieldValue("sto", value);
            }}
            error={exportReportForm.errors.stoId}
            onChange={(value) => {
              if (value === null) return;
              const stoId = parseInt(value);
              exportReportForm.setFieldValue("stoId", stoId);
            }}
          />

          <Flex mt={"sm"} gap={"md"} direction={"row-reverse"}>
            <ButtonAMDA
              onClick={handleConfirmExport}
              disabled={tickets.length === 0}
              loading={exportMutation.isLoading}
            >
              Konfirmasi Expor
            </ButtonAMDA>

            <ButtonAMDA
              variant="white"
              onClick={() => {
                exportReportForm.reset();
                onClose();
              }}
            >
              Batal
            </ButtonAMDA>
          </Flex>
        </Stack>
      </ScrollArea.Autosize>
    </Modal>
  );
}
