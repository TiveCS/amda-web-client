import { addDesignator, getListDesignator } from "@api/designators";
import { Designator } from "@api/types/designators";
import { LopTicket } from "@api/types/tickets";
import ButtonAMDA from "@components/ButtonAMDA";
import {
  Flex,
  Select,
  TextInput,
  Text,
  ScrollArea,
  NumberInput,
  Grid,
  Checkbox,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedValue } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface TicketDetailModalProps {
  ticket: LopTicket;
}

export default function TicketDetailModalContent({
  ticket,
}: TicketDetailModalProps) {
  const [newDesignator, setNewDesignator] = useState<Designator | null>(null);

  const searchForm = useForm({
    initialValues: {
      search: "",
    },
  });
  const [searchDebounced] = useDebouncedValue(searchForm.values.search, 500);

  const getListDesignatorQuery = useQuery({
    queryKey: ["ticket_detail_modal_content_designators"],
    queryFn: async () => {
      const result = await getListDesignator({
        take: 30,
        search: searchDebounced,
      });

      const list = result.data.map((designator) => {
        return { value: designator.id.toString(), label: designator.name };
      });

      return list;
    },
  });

  const addDesignatorForm = useForm({
    initialValues: {
      unit: "",
      isMaterial: false,
      pricePerUnit: 0,
      workDescription: "",
    },
  });

  const addDesignatorMutation = useMutation({
    mutationFn: async (newDesignatorName: string) => {
      const result = await addDesignator({
        name: newDesignatorName,
        unit: addDesignatorForm.values.unit,
        isMaterial: addDesignatorForm.values.isMaterial,
        pricePerUnit: addDesignatorForm.values.pricePerUnit,
        workDescription: addDesignatorForm.values.workDescription,
      });
      return result;
    },
    onMutate: () => {
      showNotification({
        title: "Loading",
        message: "Sedang menambahkan designator...",
        color: "blue",
      });
    },
    onSuccess: (res) => {
      setNewDesignator(res.data);

      showNotification({
        title: "Success",
        message: "Berhasil menambahkan designator",
        color: "green",
      });
    },
    onError: (err) => {
      setNewDesignator(null);

      if (err instanceof Error) {
        showNotification({
          title: "Error",
          message: err.message ?? "Gagal menambahkan designator",
          color: "red",
        });
        return;
      }
      showNotification({
        title: "Error",
        message: "Terjadi kesalahan internal",
        color: "red",
      });
    },
  });

  const handleCreateDesignator = (value: string) => {
    modals.openConfirmModal({
      title: "Tambah Designator",
      labels: { confirm: "Tambahkan", cancel: "Batal" },
      confirmProps: { color: "dark", className: "rounded-full font-poppins" },
      size: "lg",
      padding: "xl",
      cancelProps: {
        variant: "white",
        color: "dark",
        className: "rounded-full font-poppins",
      },
      onConfirm: () => {
        setNewDesignator(null);
        addDesignatorMutation.mutate(value);
      },
      children: (
        <Flex direction={"column"} gap={24}>
          <TextInput
            label="Designator"
            placeholder="Nama Designator"
            value={value}
            readOnly
          />

          <Grid>
            <Grid.Col span={6}>
              <NumberInput
                placeholder="Harga satuan"
                label="Harga Satuan"
                {...addDesignatorForm.getInputProps("pricePerUnit")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Satuan"
                placeholder="Contoh: Mtr, Core"
                {...addDesignatorForm.getInputProps("unit")}
              />
            </Grid.Col>
          </Grid>

          <TextInput
            label="Deskripsi Pekerjaan"
            placeholder="Contoh: Perbaikan kabel fiber optik"
            {...addDesignatorForm.getInputProps("workDescription")}
          />

          <Checkbox
            label="Designator adalah material"
            {...addDesignatorForm.getInputProps("isMaterial", {
              type: "checkbox",
            })}
          />
        </Flex>
      ),
    });
  };

  return (
    <>
      <Flex direction={"column"} gap={16}>
        <TextInput disabled value={ticket.identifier} label="ID Tiket" />

        <TextInput disabled value={ticket.location} label="Lokasi Tiket" />

        <Select
          label="Designator"
          searchable
          creatable
          placeholder="Pilih Designator"
          data={getListDesignatorQuery.data ?? []}
          getCreateLabel={(value) => (
            <Text color="blue">
              Tambahkan Designator <strong>{value}</strong>
            </Text>
          )}
          onCreate={(value) => {
            handleCreateDesignator(value);
            return newDesignator?.name ?? null;
          }}
          nothingFound="Tidak ada designator"
        />

        <ScrollArea.Autosize className="max-h-32">
          <Flex direction={"column"} gap={16}>
            {ticket.volumes.map((volume) => (
              <Flex
                key={volume.id}
                direction={"row"}
                justify={"space-between"}
                gap={32}
                align={"center"}
              >
                <Text className="font-medium">{volume.designator.name}</Text>
                <NumberInput min={0} defaultValue={volume.value} />
              </Flex>
            ))}
          </Flex>
        </ScrollArea.Autosize>

        <ButtonAMDA>
          <Text className="font-semibold">Simpan</Text>
        </ButtonAMDA>
      </Flex>
    </>
  );
}
