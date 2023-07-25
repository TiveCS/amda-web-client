import { addActivity } from "@api/activities";
import { getLops } from "@api/lops";
import { getListMitra } from "@api/mitra";
import { getListSto } from "@api/sto";
import { LopActivity } from "@api/types/lops";
import ButtonAMDA from "@components/ButtonAMDA";
import { Checkbox, Flex, Grid, Modal, Select, TextInput } from "@mantine/core";
import { DateInput, TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDebouncedValue } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

interface EditKegiatanModalProps {
  isOpen: boolean;
  closeModal: () => void;
  editActivity: LopActivity | null;
  setEditActivity: React.Dispatch<React.SetStateAction<LopActivity | null>>;
}

export default function EditKegiatanModal({
  closeModal,
  isOpen,
  editActivity,
  setEditActivity,
}: EditKegiatanModalProps) {
  const queryClient = useQueryClient();
  const editKegiatanForm = useForm({
    initialValues: {
      lopId: -1,
      stoId: -1,
      mitraId: -1,
      ticketIdentifier: "",
      ticketLocation: "",
      workType: "",
      isForMitra: false,
      inputDate: new Date(),
      inputTime: "00:00",
    },
    validate: {
      lopId: (value) => (value === -1 ? "LOP harus dipilih" : null),
      stoId: (value) => (value === -1 ? "STO harus dipilih" : null),
      mitraId: (value) => (value === -1 ? "Mitra harus dipilih" : null),
      workType: (value) =>
        value === "" ? "Jenis pekerjaan harus dipilih" : null,
      inputDate: (value) =>
        value === null ? "Tanggal input harus diisi" : null,
      inputTime: (value) => (value === "" ? "Waktu input harus diisi" : null),
      ticketIdentifier: (value) =>
        /^IN\d+$/.test(value) ? null : "ID Tiket tidak valid",
    },
  });

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

  const addKegiatanMutation = useMutation({
    mutationFn: async () => {
      const inputAt = editKegiatanForm.values.inputDate;
      inputAt.setHours(
        parseInt(editKegiatanForm.values.inputTime.split(":")[0])
      );
      inputAt.setMinutes(
        parseInt(editKegiatanForm.values.inputTime.split(":")[1])
      );

      return await addActivity({
        lopId: editKegiatanForm.values.lopId,
        stoId: editKegiatanForm.values.stoId,
        mitraId: editKegiatanForm.values.mitraId,
        ticketIdentifier: editKegiatanForm.values.ticketIdentifier,
        ticketLocation: editKegiatanForm.values.ticketLocation,
        workType: editKegiatanForm.values.workType,
        isForMitra: editKegiatanForm.values.isForMitra,
        inputAt,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["lops"]);
      showNotification({
        title: "Success",
        message: "Kegiatan berhasil diubah!",
        color: "green",
      });
      editKegiatanForm.reset();
      closeModal();
    },
    onError: (error) => {
      if (error instanceof Error) {
        showNotification({
          title: "Error",
          message: error.message ?? "Gagal mengubah kegiatan!",
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
    onMutate: () => {
      showNotification({
        title: "Loading",
        message: "Kegiatan sedang diubah...",
      });
    },
  });

  return (
    <Modal
      opened={isOpen}
      onClose={closeModal}
      title="Edit Kegiatan"
      size={"lg"}
      padding={"xl"}
    >
      <Flex direction={"column"} gap={"sm"}>
        <Select
          id="select-lop"
          data={getListLopQuery.data ?? []}
          searchable
          nothingFound="LOP tidak ditemukan"
          label="LOP"
          placeholder="Pilih LOP"
          error={editKegiatanForm.errors.lopId}
          withAsterisk
          onChange={(value) => {
            editKegiatanForm.setFieldValue(
              "lopId",
              value !== null ? parseInt(value) : -1
            );
          }}
          onSearchChange={(query) => {
            setSearchLop(query);
          }}
        />

        <Select
          id="select-sto"
          data={getListStoQuery.data ?? []}
          searchable
          nothingFound="STO tidak ditemukan"
          label="STO"
          placeholder="Pilih STO"
          withAsterisk
          error={editKegiatanForm.errors.stoId}
          onChange={(value) => {
            editKegiatanForm.setFieldValue(
              "stoId",
              value !== null ? parseInt(value) : -1
            );
          }}
          onSearchChange={(query) => {
            setSearchSto(query);
          }}
        />

        <Select
          data={["Recovery", "Relokasi"]}
          label="Jenis Pekerjaan"
          placeholder="Pilih Jenis Pekerjaan"
          withAsterisk
          error={editKegiatanForm.errors.workType}
          onChange={(value) =>
            editKegiatanForm.setFieldValue("workType", value ?? "")
          }
        />

        <Select
          id="select-mitra"
          data={getListMitraQuery.data ?? []}
          searchable
          nothingFound="Mitra tidak ditemukan"
          label="Mitra"
          placeholder="Pilih Mitra"
          error={editKegiatanForm.errors.mitraId}
          withAsterisk
          onChange={(value) => {
            editKegiatanForm.setFieldValue(
              "mitraId",
              value !== null ? parseInt(value) : -1
            );
          }}
          onSearchChange={(query) => {
            setSearchMitra(query);
          }}
        />

        <Grid>
          <Grid.Col span={6}>
            <TextInput
              label="ID Tiket"
              placeholder="IN123456789"
              withAsterisk
              error={editKegiatanForm.errors.ticketIdentifier}
              {...editKegiatanForm.getInputProps("ticketIdentifier")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Lokasi Tiket"
              placeholder="Contoh: Sragen, dll"
              error={editKegiatanForm.errors.ticketLocation}
              {...editKegiatanForm.getInputProps("ticketLocation")}
            />
          </Grid.Col>
        </Grid>

        <Grid>
          <Grid.Col span={6}>
            <DateInput
              label="Tanggal Input"
              withAsterisk
              {...editKegiatanForm.getInputProps("inputDate")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TimeInput
              label="Waktu Input"
              withAsterisk
              {...editKegiatanForm.getInputProps("inputTime")}
            />
          </Grid.Col>
        </Grid>

        <Checkbox
          mt={"md"}
          label="Ditunjukan untuk Admin Mitra"
          {...editKegiatanForm.getInputProps("isForMitra", {
            type: "checkbox",
          })}
        />
      </Flex>

      <Flex justify={"space-between"} mt={"xl"}>
        <Flex>
          <ButtonAMDA variant="white" onClick={editKegiatanForm.reset}>
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

              addKegiatanMutation.mutate();
            }}
          >
            Tambah
          </ButtonAMDA>
          <ButtonAMDA
            variant="white"
            onClick={() => {
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
