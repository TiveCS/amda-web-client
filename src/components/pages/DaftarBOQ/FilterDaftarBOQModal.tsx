import { getListTicketLocations, getListTickets } from "@api/tickets";
import {
  LopTicketAcceptanceStatus,
  LopTicketEvidenceStatus,
} from "@api/types/tickets";
import ButtonAMDA from "@components/ButtonAMDA";
import useFilterForm from "@hooks/useFilterForm";
import {
  Flex,
  Group,
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
import { getListMitra } from "@api/mitra";

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
      mitra: "",
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

  const [mitraDebounced] = useDebouncedValue(searchForm.values.mitra, 500);

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

  const { refetch: refetchListMitra, ...getListMitraQuery } = useQuery({
    enabled: !isAdminMitra,
    queryKey: ["filter_daftar_boq_modal_mitra"],
    queryFn: async () => {
      const result = await getListMitra({
        limit: 20,
        search: mitraDebounced,
      });

      return result.data.map((found) => ({
        value: found.id.toString(),
        label: found.name,
      }));
    },
  });

  useEffect(() => {
    void refetchListLocations();
  }, [locationDebounced, refetchListLocations]);

  useEffect(() => {
    void refetchListIdentifiers();
  }, [identifierDebounced, refetchListIdentifiers]);

  useEffect(() => {
    void refetchListMitra();
  }, [mitraDebounced, refetchListMitra]);

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title="Filter BOQ"
      scrollAreaComponent={ScrollArea.Autosize}
      padding={"xl"}
      size={"lg"}
      centered
    >
      <Stack spacing={"md"}>
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

        <MonthPickerInput
          label="Bulan Input Tiket"
          placeholder="Pilih bulan input tiket"
          clearable
          {...filterForm.getInputProps("inputDate")}
        />

        {!isAdminMitra && (
          <MultiSelect
            searchable
            clearable
            limit={20}
            label="Mitra"
            readOnly={isAdminMitra}
            nothingFound="Mitra tidak ditemukan"
            data={getListMitraQuery.data ?? []}
            placeholder="Pilih mitra"
            onSearchChange={(value) => searchForm.setFieldValue("mitra", value)}
            value={
              filterForm.values.mitraIds?.map((mitraId) =>
                mitraId.toString()
              ) ?? undefined
            }
            onChange={(value) => {
              if (value === null) {
                filterForm.setFieldValue("mitraIds", null);
                return;
              }

              filterForm.setFieldValue(
                "mitraIds",
                value.map((mitraId) => parseInt(mitraId))
              );
            }}
          />
        )}

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

        <Group grow>
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
        </Group>

        <Flex
          className="mt-4"
          justify={"space-between"}
          direction={"row-reverse"}
        >
          <ButtonAMDA onClick={() => filter()}>
            {filterForm.isDirty() ? "Filter" : "Hapus Filter"}
          </ButtonAMDA>

          <Group>
            <ButtonAMDA variant="white" onClick={onClose}>
              Batal
            </ButtonAMDA>

            <ButtonAMDA variant="white" onClick={() => filterForm.reset()}>
              Reset
            </ButtonAMDA>
          </Group>
        </Flex>
      </Stack>
    </Modal>
  );
}
