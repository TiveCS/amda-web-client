import { getListMitra } from "@api/mitra";
import { getListSto } from "@api/sto";
import { ActivitiesWorkType } from "@api/types/activities";
import ButtonAMDA from "@components/ButtonAMDA";
import useFilterKegiatan from "@hooks/useFilterKegiatan";
import { Flex, Modal, MultiSelect, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedValue } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

interface FilterModalProps {
  isOpen: boolean;
  closeModal: () => void;
  filter: () => void;
  filterForm: ReturnType<typeof useFilterKegiatan>["form"];
  isAdminMitra: boolean;
}

export default function FilterModal({
  isOpen,
  closeModal,
  filter,
  filterForm,
  isAdminMitra,
}: FilterModalProps) {
  const searchForm = useForm({
    initialValues: {
      sto: "",
      mitra: "",
    },
  });

  const [stoDebounced] = useDebouncedValue(searchForm.values.sto, 500);

  const [mitraDebounced] = useDebouncedValue(searchForm.values.mitra, 500);

  const { refetch: refetchListSto, ...getListStoQuery } = useQuery({
    queryKey: ["filter_daftar_kegiatan_modal_sto"],
    queryFn: async () => {
      const result = await getListSto({
        search: stoDebounced,
      });
      const list = result.data.map((sto) => {
        return {
          value: sto.id.toString(),
          label: sto.name,
        };
      });

      return list;
    },
  });

  const { refetch: refetchListMitra, ...getListMitraQuery } = useQuery({
    queryKey: ["filter_daftar_kegiatan_modal_mitra"],
    queryFn: async () => {
      const result = await getListMitra({ limit: 10, search: mitraDebounced });

      const list = result.data.map((mitra) => {
        return {
          value: mitra.id.toString(),
          label: mitra.name,
        };
      });

      return list;
    },
  });

  useEffect(() => {
    void refetchListSto();
  }, [stoDebounced, refetchListSto]);

  useEffect(() => {
    void refetchListMitra();
  }, [mitraDebounced, refetchListMitra]);

  return (
    <Modal
      opened={isOpen}
      onClose={closeModal}
      title="Filter Kegiatan"
      centered
      padding={"xl"}
    >
      <Flex direction={"column"} gap={"md"}>
        <MultiSelect
          id="filter-sto"
          searchable
          clearable
          multiple
          label="STO"
          nothingFound="STO tidak ditemukan"
          data={getListStoQuery.data ?? []}
          placeholder="Pilih STO"
          onSearchChange={(value) => searchForm.setFieldValue("sto", value)}
          value={filterForm?.values?.sto}
          onChange={(value) => filterForm.setFieldValue("sto", value)}
        />

        {!isAdminMitra && (
          <MultiSelect
            id="filter-mitra"
            clearable
            searchable
            multiple
            label="Mitra"
            nothingFound="Mitra tidak ditemukan"
            data={getListMitraQuery.data ?? []}
            placeholder="Pilih mitra"
            onSearchChange={(value) => searchForm.setFieldValue("mitra", value)}
            value={filterForm?.values?.mitra}
            onChange={(value) => filterForm.setFieldValue("mitra", value)}
          />
        )}

        <Select
          id="filter-work-type"
          clearable
          multiple
          label="Jenis Pekerjaan"
          data={[
            { value: "RECOVERY", label: "RECOVERY" },
            { value: "RELOKASI", label: "RELOKASI" },
            { value: "ACCESS", label: "ACCESS" },
            { value: "HEM", label: "HEM" },
            { value: "EBIS", label: "EBIS" },
          ]}
          placeholder="Pilih jenis pekerjaan"
          value={filterForm.values?.workType ?? null}
          onChange={(value: ActivitiesWorkType | null) => {
            if (value === null) {
              filterForm.setFieldValue("workType", null);
              return;
            }

            filterForm.setFieldValue("workType", value);
          }}
        />
      </Flex>

      <Flex
        className="mt-4"
        justify={"space-between"}
        direction={"row-reverse"}
      >
        <ButtonAMDA onClick={() => filter()}>
          {filterForm.isDirty() ? "Filter" : "Hapus Filter"}
        </ButtonAMDA>

        <ButtonAMDA variant="white" onClick={closeModal}>
          Batal
        </ButtonAMDA>
      </Flex>
    </Modal>
  );
}
