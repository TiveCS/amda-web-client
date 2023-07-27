import { addAgenda } from "@api/agenda";
import ButtonAMDA from "@components/ButtonAMDA";
import { Flex, Modal, Select, TextInput } from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDebouncedValue } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getListUser } from "@api/users";
import { useEffect, useState } from "react";
import { UserSelectOption } from "@api/types/users";

interface AddAgendaModalProps {
  isOpen: boolean;
  closeModal: () => void;
  selectedDate: Date;
}

export default function AddAgendaModal({
  closeModal,
  isOpen,
  selectedDate,
}: AddAgendaModalProps) {
  const addAgendaForm = useForm({
    initialValues: {
      title: "",
      basisOfAgenda: "",
      time: "00:00",
      note: "",
      picId: -1,
    },
    validate: {
      title: (value) => (value.trim().length > 0 ? null : "Judul wajib diisi"),
    },
  });

  const queryClient = useQueryClient();
  const addAgendaMutation = useMutation({
    mutationFn: async () => {
      selectedDate.setHours(parseInt(addAgendaForm.values.time.split(":")[0]));
      selectedDate.setMinutes(
        parseInt(addAgendaForm.values.time.split(":")[1])
      );

      return await addAgenda({
        title: addAgendaForm.values.title,
        basisOfAgenda: addAgendaForm.values.basisOfAgenda,
        time: selectedDate,
        note: addAgendaForm.values.note,
        picId: addAgendaForm.values.picId,
      });
    },

    onSuccess: async () => {
      addAgendaForm.reset();
      closeModal();
      await queryClient.invalidateQueries(["agenda"]);

      showNotification({
        title: "Success",
        message: "Agenda berhasil ditambahkan",
        color: "green",
      });
    },
    onError: (error) => {
      if (error instanceof Error) {
        showNotification({
          title: "Error",
          message: error.message ?? "Gagal menambahkan agenda",
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
        message: "Sedang menambahkan agenda...",
        color: "blue",
      });
    },
  });

  const handleAddAgenda = () => {
    if (addAgendaForm.validate().hasErrors) return;
    addAgendaMutation.mutate();
  };

  // User or PIC
  const [searchUser] = useState("");
  const [searchUserDebounced] = useDebouncedValue(searchUser, 500);

  const getListUserQuery = useQuery({
    queryKey: ["add_agenda_modal_user"],
    queryFn: async () => {
      const result = await getListUser({});

      return result.data.map((user) => ({
        value: user.id.toString(),
        label: user.name,
      }));
    },
  });

  useEffect(() => {
    void getListUserQuery.refetch();
  }, [getListUserQuery, searchUserDebounced]);

  const selectOptionsUser: UserSelectOption[] | undefined =
    getListUserQuery.data?.map((user) => ({
      value: String(user.value),
      label: user.label,
    }));

  if (selectOptionsUser === undefined) return <p>loading...</p>;

  return (
    <Modal
      opened={isOpen}
      onClose={closeModal}
      title="Add Agenda"
      padding={"xl"}
    >
      <Flex direction={"column"} gap={24}>
        <TextInput
          withAsterisk
          label="Agenda"
          placeholder=""
          {...addAgendaForm.getInputProps("title")}
        />
        <Select
          withAsterisk
          label="PIC"
          placeholder="Select one"
          searchable
          nothingFound="No options"
          data={selectOptionsUser}
          onChange={(value) => {
            addAgendaForm.setFieldValue(
              "picId",
              value !== null ? parseInt(value) : -1
            );
          }}
        />
        <TextInput
          withAsterisk
          label="Dasar Kegiatan"
          placeholder=""
          {...addAgendaForm.getInputProps("basisOfAgenda")}
        />
        <TimeInput
          withAsterisk
          label="Waktu"
          {...addAgendaForm.getInputProps("time")}
        ></TimeInput>

        <Flex justify={"space-between"} mt={"xl"}>
          <Flex>
            <ButtonAMDA variant="white" onClick={addAgendaForm.reset}>
              Reset
            </ButtonAMDA>
          </Flex>
          <Flex direction={"row-reverse"} gap={12}>
            <ButtonAMDA
              onClick={() => {
                const validate = addAgendaForm.validate();

                if (validate.hasErrors) {
                  showNotification({
                    title: "Error",
                    message: "Data agenda kurang lengkap atau tidak valid!",
                  });
                  return;
                }

                addAgendaMutation.mutate();

                handleAddAgenda;
              }}
            >
              Tambah
            </ButtonAMDA>
            <ButtonAMDA
              variant="white"
              onClick={() => {
                addAgendaForm.reset();
                closeModal();
              }}
            >
              Batal
            </ButtonAMDA>
          </Flex>
        </Flex>
      </Flex>
    </Modal>
  );
}
