import { getLops } from "@api/lops";
import { getListMitra } from "@api/mitra";
import { addSto, getListSto } from "@api/sto";
import ButtonAMDA from "@components/ButtonAMDA";
import useActivityForm from "@hooks/useActivityForm";
import useAddActivityMutation from "@hooks/useAddActivityMutation";
import {
  Checkbox,
  Flex,
  Grid,
  Modal,
  Select,
  TextInput,
  Text,
  LoadingOverlay,
} from "@mantine/core";
import { DateInput, TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDebouncedValue } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface AddKegiatanModalProps {
  openedAddKegiatan: boolean;
  closeAddKegiatan: () => void;
}

export default function AddKegiatanModal({
  closeAddKegiatan,
  openedAddKegiatan,
}: AddKegiatanModalProps) {
  const { form: addKegiatanForm } = useActivityForm({});
  const addKegiatanMutation = useAddActivityMutation(
    addKegiatanForm,
    closeAddKegiatan
  );

  const [searchLop, setSearchLop] = useState("");
  const [searchLopDebounced] = useDebouncedValue(searchLop, 500);

  const [searchSto, setSearchSto] = useState("");
  const [searchStoDebounced] = useDebouncedValue(searchSto, 500);

  const [searchMitra, setSearchMitra] = useState("");
  const [searchMitraDebounced] = useDebouncedValue(searchMitra, 500);

  const getListLopQuery = useQuery({
    queryKey: ["add_activity_lops"],
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
    queryKey: ["add_activity_mitras"],
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
    queryKey: ["add_activity_stos"],
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

  const addStoForm = useForm({
    initialValues: {
      name: "",
    },
  });
  const queryClient = useQueryClient();
  const addStoMutation = useMutation({
    mutationFn: async () => addSto(addStoForm.values),
    onSuccess: async () => {
      addStoForm.reset();
      await queryClient.invalidateQueries(["sto"]);

      showNotification({
        title: "Success",
        message: "STO berhasil ditambahkan",
        color: "green",
      });
    },
    onError: (error) => {
      if (error instanceof Error) {
        showNotification({
          title: "Error",
          message: error.message ?? "Gagal menambahkan STO",
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
        message: "Sedang menambahkan STO...",
        color: "blue",
      });
    },
  });

  const handleAddSto = (query: string) => {
    addStoForm.setFieldValue("name", query);
    if (addStoForm.validate().hasErrors) return;
    addStoMutation.mutate();
  };

  // const [dataSto, setDataSto] = useState(getListStoQuery.data ?? []);

  const onCreateSTO = (query: string) => {
    handleAddSto(query);

    getListStoQuery.refetch();

    if (!addStoMutation.data) {
      return null;
    }

    const item = addStoMutation.data.data;

    addKegiatanForm.setFieldValue("stoId", item.id);

    return {
      value: item.id.toString(),
      label: item.name,
    };
  };

  return (
    <Modal
      opened={openedAddKegiatan}
      onClose={closeAddKegiatan}
      title="Add Kegiatan"
      size={"lg"}
      padding={"xl"}
    >
      <LoadingOverlay visible={addStoMutation.isLoading} />
      <Flex direction={"column"} gap={"sm"}>
        <Select
          id="select-lop"
          data={getListLopQuery.data ?? []}
          searchable
          nothingFound="LOP tidak ditemukan"
          label="LOP"
          placeholder="Pilih LOP"
          error={addKegiatanForm.errors.lopId}
          withAsterisk
          onChange={(value) => {
            addKegiatanForm.setFieldValue(
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
          creatable
          clearable
          nothingFound="STO tidak ditemukan"
          getCreateLabel={(query) => (
            <Text color="blue">
              Tambahkan STO <strong>"{query}"</strong>
            </Text>
          )}
          label="STO"
          placeholder="Pilih STO"
          withAsterisk
          error={addKegiatanForm.errors.stoId}
          onCreate={onCreateSTO}
          onChange={(value) => {
            addKegiatanForm.setFieldValue(
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
          error={addKegiatanForm.errors.workType}
          onChange={(value) =>
            addKegiatanForm.setFieldValue("workType", value ?? "")
          }
        />

        <Select
          id="select-mitra"
          data={getListMitraQuery.data ?? []}
          searchable
          nothingFound="Mitra tidak ditemukan"
          label="Mitra"
          placeholder="Pilih Mitra"
          error={addKegiatanForm.errors.mitraId}
          withAsterisk
          onChange={(value) => {
            addKegiatanForm.setFieldValue(
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
              error={addKegiatanForm.errors.ticketIdentifier}
              {...addKegiatanForm.getInputProps("ticketIdentifier")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Lokasi Tiket"
              placeholder="Contoh: Sragen, dll"
              error={addKegiatanForm.errors.ticketLocation}
              {...addKegiatanForm.getInputProps("ticketLocation")}
            />
          </Grid.Col>
        </Grid>

        <Grid>
          <Grid.Col span={6}>
            <DateInput
              label="Tanggal Input"
              withAsterisk
              {...addKegiatanForm.getInputProps("inputDate")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TimeInput
              label="Waktu Input"
              withAsterisk
              {...addKegiatanForm.getInputProps("inputTime")}
            />
          </Grid.Col>
        </Grid>

        <Checkbox
          mt={"md"}
          label="Ditunjukan untuk Admin Mitra"
          {...addKegiatanForm.getInputProps("isForMitra", { type: "checkbox" })}
        />
      </Flex>
      <Flex justify={"space-between"} mt={"xl"}>
        <Flex>
          <ButtonAMDA variant="white" onClick={addKegiatanForm.reset}>
            Reset
          </ButtonAMDA>
        </Flex>
        <Flex direction={"row-reverse"} gap={12}>
          <ButtonAMDA
            onClick={() => {
              const validate = addKegiatanForm.validate();

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
              addKegiatanForm.reset();
              closeAddKegiatan();
            }}
          >
            Batal
          </ButtonAMDA>
        </Flex>
      </Flex>
    </Modal>
  );
}
