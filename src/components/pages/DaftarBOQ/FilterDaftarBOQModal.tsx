import { getListTicketLocations, getListTickets } from "@api/tickets";
import {
  LopTicketAcceptanceStatus,
  LopTicketEvidenceStatus,
} from "@api/types/tickets";
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
import { useProfileStore } from "@zustand/profileStore";
import { useEffect, useMemo } from "react";
import { RoleType } from "../../../types";
import { MonthPickerInput } from "@mantine/dates";

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
      identifier: "",
    },
  });

  const { profile } = useProfileStore();
  const role = profile?.role.slug as unknown as RoleType;
  const isAdminMitra = useMemo(() => {
    return role === "admin-mitra";
  }, [role]);

  const [locationDebounced] = useDebouncedValue(
    searchForm.values.location,
    500
  );

  const [identifierDebounced] = useDebouncedValue(
    searchForm.values.identifier,
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

  const { refetch: refetchListIdentifiers, ...getListIdentifiersQuery } =
    useQuery({
      queryKey: ["filter_daftar_boq_modal_ticket_identifiers"],
      queryFn: async () => {
        const result = await getListTickets({
          take: 10,
          mitraIds:
            isAdminMitra && profile?.mitra.id ? [profile?.mitra.id] : undefined,
        });

        return result.data.map((found) => ({
          value: found.identifier,
          label: `${found.identifier} (${found.location})`,
        }));
      },
    });

  useEffect(() => {
    void refetchListLocations();
  }, [locationDebounced, refetchListLocations]);

  useEffect(() => {
    void refetchListIdentifiers();
  }, [identifierDebounced, refetchListIdentifiers]);

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title="Filter BOQ"
      scrollAreaComponent={ScrollArea.Autosize}
      padding={"xl"}
    >
      <Stack spacing={"md"}>
        <MonthPickerInput
          label="Pilih Bulan"
          placeholder="Pilih Bulan"
          clearable
          {...filterForm.getInputProps("inputDate")}
        />

        <MultiSelect
          searchable
          clearable
          multiple
          limit={10}
          label="ID Tiket"
          nothingFound="Tiket tidak ditemukan"
          data={getListIdentifiersQuery.data ?? []}
          placeholder="Pilih id tiket"
          onSearchChange={(value) =>
            searchForm.setFieldValue("identifier", value)
          }
          value={filterForm.values.identifier}
          onChange={(value) => filterForm.setFieldValue("identifier", value)}
        />

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
            { value: "COMPLETE", label: "Lengkap" },
            { value: "INCOMPLETE", label: "Belum Lengkap" },
          ]}
          placeholder="Pilih status evidence"
          value={filterForm.values.evidenceStatus ?? null}
          onChange={(value: LopTicketEvidenceStatus | null) => {
            if (value === null) {
              filterForm.setFieldValue("evidenceStatus", null);
              return;
            }

            filterForm.setFieldValue("evidenceStatus", value);
          }}
        />

        <Select
          clearable
          multiple
          label="Status ACC"
          data={[
            { value: "ACCEPTED", label: "Diterima" },
            { value: "REJECTED", label: "Ditolak" },
            { value: "PENDING", label: "Menunggu" },
          ]}
          placeholder="Pilih status acc"
          value={filterForm.values.acceptStatus ?? null}
          onChange={(value: LopTicketAcceptanceStatus | null) => {
            if (value === null) {
              filterForm.setFieldValue("acceptStatus", null);
              return;
            }

            filterForm.setFieldValue("acceptStatus", value);
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
