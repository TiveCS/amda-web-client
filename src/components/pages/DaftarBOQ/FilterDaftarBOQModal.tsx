import { getListTicketLocations } from "@api/tickets";
import ButtonAMDA from "@components/ButtonAMDA";
import useFilterForm from "@hooks/useFilterForm";
import {
  Flex,
  Modal,
  MultiSelect,
  ScrollArea,
  Select,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedValue } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

interface PrepareExportBoqModalProps {
  isOpen: boolean;
  onClose: () => void;
  filter: () => void;
  filterForm: ReturnType<typeof useFilterForm>["form"];
}

export default function FilterDaftarBOQModal({
  isOpen,
  onClose,
  filter,
  filterForm,
}: PrepareExportBoqModalProps) {
  const searchForm = useForm({
    initialValues: {
      location: "",
    },
  });

  const [locationDebounced] = useDebouncedValue(
    searchForm.values.location,
    500
  );

  const { refetch: refetchListLocations, ...getListLocationsQuery } = useQuery({
    queryKey: ["filter_daftar_boq_modal_ticket_locations"],
    queryFn: async () => {
      const result = await getListTicketLocations({});

      const list = result.data
        .filter((found) => found.location !== null)
        .map((found) => found.location!);

      return list;
    },
  });

  useEffect(() => {
    void refetchListLocations();
  }, [locationDebounced, refetchListLocations]);

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title="Filter Laporan"
      scrollAreaComponent={ScrollArea.Autosize}
      padding={"xl"}
    >
      <Stack spacing={"md"}>
        <MultiSelect
          searchable
          clearable
          multiple
          limit={20}
          label="Lokasi Tiket"
          nothingFound="Lokasi tidak ditemukan"
          data={getListLocationsQuery.data ?? []}
          placeholder="Pilih lokasi tiket"
          onSearchChange={(value) =>
            searchForm.setFieldValue("location", value)
          }
          value={filterForm.values.location}
          onChange={(value) => filterForm.setFieldValue("location", value)}
        />

        <Select
          clearable
          multiple
          label="Status Evidence"
          data={[
            { value: "true", label: "Lengkap" },
            { value: "false", label: "Belum Lengkap" },
          ]}
          placeholder="Pilih status evidence"
          value={String(filterForm.values.evidenceStatus) ?? null}
          onChange={(value) => {
            if (value === null) {
              filterForm.setFieldValue("evidenceStatus", null);
              return;
            }

            filterForm.setFieldValue("evidenceStatus", value === "true");
          }}
        />

        <Select
          clearable
          multiple
          label="Status ACC"
          data={[
            { value: "true", label: "Diterima" },
            { value: "false", label: "Belum Diterima" },
          ]}
          placeholder="Pilih status acc"
          value={String(filterForm.values.accStatus) ?? null}
          onChange={(value) => {
            if (value === null) {
              filterForm.setFieldValue("accStatus", null);
              return;
            }

            filterForm.setFieldValue("accStatus", value === "true");
          }}
        />

        <Flex
          className="mt-4"
          justify={"space-between"}
          direction={"row-reverse"}
        >
          <ButtonAMDA onClick={() => filter()}>
            {filterForm.isDirty() ? "Filter" : "Hapus Filter"}
          </ButtonAMDA>

          <ButtonAMDA variant="white" onClick={onClose}>
            Batal
          </ButtonAMDA>
        </Flex>
      </Stack>
    </Modal>
  );
}
