import { getLops } from "@api/lops";
import { getListMitra } from "@api/mitra";
import { getListSto } from "@api/sto";
import { LopActivity, LopActivityForm } from "@api/types/lops";
import ButtonAMDA from "@components/ButtonAMDA";
import useEditActivityMutation from "@hooks/useEditActivityMutation";
import {
  Checkbox,
  Flex,
  Grid,
  Group,
  Modal,
  Select,
  TextInput,
  Textarea,
} from "@mantine/core";
import { DateInput, TimeInput } from "@mantine/dates";
import { UseFormReturnType } from "@mantine/form";
import { useDebouncedValue } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

interface EditKegiatanModalProps {
  isOpen: boolean;
  closeModal: () => void;
  currentActivity: LopActivity | null;
  setEditActivity: React.Dispatch<React.SetStateAction<LopActivity | null>>;
  setSelectedActivities: React.Dispatch<React.SetStateAction<LopActivity[]>>;
  editForm: UseFormReturnType<
    LopActivityForm,
    (values: LopActivityForm) => LopActivityForm
  >;
  updateEditForm: (activity: LopActivity) => void;
  isAdminMitra?: boolean;
}

export default function EditKegiatanModal({
  closeModal,
  isOpen,
  currentActivity,
  isAdminMitra,
  setEditActivity,
  setSelectedActivities,
  editForm: editKegiatanForm,
  updateEditForm,
}: EditKegiatanModalProps) {
  const editKegiatanMutation = useEditActivityMutation(
    editKegiatanForm,
    closeModal,
    currentActivity,
    setEditActivity,
    setSelectedActivities
  );

  const [searchLop, setSearchLop] = useState("");
  const [searchLopDebounced] = useDebouncedValue(searchLop, 500);

  const [searchSto, setSearchSto] = useState("");
  const [searchStoDebounced] = useDebouncedValue(searchSto, 500);

  const [searchMitra, setSearchMitra] = useState("");
  const [searchMitraDebounced] = useDebouncedValue(searchMitra, 500);

  const getListLopQuery = useQuery({
    queryKey: ["edit_activity_lops"],
    queryFn: async () => {
      const result = await getLops({
        lopOnly: true,
        search: searchLopDebounced,
        take: 30,
      });

      return result.data.map((lop) => ({
        value: lop.id.toString(),
        label: lop.name,
      }));
    },
  });

  const getListMitraQuery = useQuery({
    queryKey: ["edit_activity_mitras"],
    queryFn: async () => {
      const result = await getListMitra({
        limit: 30,
      });

      return result.data.map((mitra) => ({
        value: mitra.id.toString(),
        label: mitra.name,
      }));
    },
  });

  const getListStoQuery = useQuery({
    queryKey: ["edit_activity_stos"],
    queryFn: async () => {
      const result = await getListSto({
        search: searchStoDebounced,
        take: 30,
      });

      return result.data.map((sto) => ({
        value: sto.id.toString(),
        label: sto.name,
      }));
    },
  });

  useEffect(() => {
    void getListLopQuery.refetch();
  }, [getListLopQuery, searchLopDebounced]);

  useEffect(() => {
    void getListStoQuery.refetch();
  }, [getListStoQuery, searchStoDebounced]);

  useEffect(() => {
    void getListMitraQuery.refetch();
  }, [getListMitraQuery, searchMitraDebounced]);

  return (
    <Modal
      opened={isOpen}
      onClose={() => {
        setEditActivity(null);
        editKegiatanForm.reset();
        closeModal();
      }}
      title="Edit Kegiatan"
      size={"lg"}
      padding={"xl"}
    >
      <Flex direction={"column"} gap={"sm"}>
        <Select
          id="select-lop"
          data={getListLopQuery.data ?? []}
          searchable
          nothingFound="Segment tidak ditemukan"
          label="Segment"
          placeholder="Pilih Segment"
          withAsterisk
          readOnly={isAdminMitra}
          onSearchChange={(query) => {
            setSearchLop(query);
          }}
          {...editKegiatanForm.getInputProps("lopId")}
          onChange={(value) => {
            const num = value !== null ? parseInt(value) : -1;
            editKegiatanForm.setFieldValue("lopId", num);
          }}
          value={editKegiatanForm.values.lopId.toString()}
        />

        <Group grow>
          <Select
            id="select-sto"
            data={getListStoQuery.data ?? []}
            searchable
            nothingFound="STO tidak ditemukan"
            label="STO"
            placeholder="Pilih STO"
            withAsterisk
            readOnly={isAdminMitra}
            onSearchChange={(query) => {
              setSearchSto(query);
            }}
            {...editKegiatanForm.getInputProps("stoId")}
            onChange={(value) => {
              const num = value !== null ? parseInt(value) : -1;
              editKegiatanForm.setFieldValue("stoId", num);
            }}
            value={editKegiatanForm.values.stoId.toString()}
          />

          <Select
            id="select-mitra"
            data={getListMitraQuery.data ?? []}
            searchable
            nothingFound="Mitra tidak ditemukan"
            label="Mitra"
            placeholder="Pilih Mitra"
            withAsterisk
            readOnly={isAdminMitra}
            onSearchChange={(query) => {
              setSearchMitra(query);
            }}
            {...editKegiatanForm.getInputProps("mitraId")}
            onChange={(value) => {
              const num = value !== null ? parseInt(value) : -1;
              editKegiatanForm.setFieldValue("mitraId", num);
            }}
            value={editKegiatanForm.values.mitraId.toString()}
          />
        </Group>

        <Select
          data={["RECOVERY", "RELOKASI", "ACCES", "HEM", "EBIS"]}
          label="Jenis Pekerjaan"
          placeholder="Pilih Jenis Pekerjaan"
          readOnly={isAdminMitra}
          withAsterisk
          {...editKegiatanForm.getInputProps("workType")}
        />

        <Textarea
          label="Uraian Pekerjaan"
          placeholder="Tuliskan uraian pekerjaan disini"
          {...editKegiatanForm.getInputProps("workDescription")}
        />

        <Grid>
          <Grid.Col span={6}>
            <TextInput
              label="ID Tiket"
              placeholder="IN123456789"
              withAsterisk
              readOnly={isAdminMitra}
              error={editKegiatanForm.errors.ticketIdentifier}
              {...editKegiatanForm.getInputProps("ticketIdentifier")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Lokasi Tiket"
              readOnly={isAdminMitra}
              placeholder="Contoh: Sragen, dll"
              error={editKegiatanForm.errors.ticketLocation}
              {...editKegiatanForm.getInputProps("ticketLocation")}
            />
          </Grid.Col>
        </Grid>

        <Grid>
          <Grid.Col span={6}>
            <DateInput
              readOnly={isAdminMitra}
              label="Tanggal Input"
              withAsterisk
              {...editKegiatanForm.getInputProps("inputDate")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TimeInput
              readOnly={isAdminMitra}
              label="Waktu Input"
              withAsterisk
              {...editKegiatanForm.getInputProps("inputTime")}
            />
          </Grid.Col>
        </Grid>

        <Checkbox
          mt={"md"}
          label="Ditunjukan untuk Admin Mitra"
          disabled={isAdminMitra}
          checked={editKegiatanForm.values.isForMitra}
          onChange={(e) =>
            editKegiatanForm.setFieldValue(
              "isForMitra",
              e.currentTarget.checked
            )
          }
        />
      </Flex>

      <Flex justify={"space-between"} mt={"xl"}>
        <Flex>
          <ButtonAMDA
            variant="white"
            onClick={() => {
              if (!currentActivity) return;
              updateEditForm(currentActivity);
            }}
          >
            Reset
          </ButtonAMDA>
        </Flex>
        <Flex direction={"row-reverse"} gap={12}>
          <ButtonAMDA
            onClick={() => {
              const validate = editKegiatanForm.validate();

              if (validate.hasErrors) {
                showNotification({
                  title: "Error",
                  message: "Data kegiatan kurang lengkap atau tidak valid!",
                });
                return;
              }

              editKegiatanMutation.mutate();
            }}
          >
            Ubah
          </ButtonAMDA>
          <ButtonAMDA
            variant="white"
            onClick={() => {
              setEditActivity(null);
              editKegiatanForm.reset();
              closeModal();
            }}
          >
            Batal
          </ButtonAMDA>
        </Flex>
      </Flex>
    </Modal>
  );
}
