import { editAgenda } from "@api/agenda";
import { AgendaResponsePayload } from "@api/types/agenda";
import ButtonAMDA from "@components/ButtonAMDA";
import { Flex, Modal, Select, TextInput } from "@mantine/core";
import { UseFormReturnType, useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { UserSelectOption } from "@api/types/users";
import { useDebouncedValue } from "@mantine/hooks";
import { getListUser } from "@api/users";
import { TimeInput } from "@mantine/dates";

interface EditAgendaModalProps {
  agenda: AgendaResponsePayload | null;
  setAgenda: (agenda: AgendaResponsePayload | null) => void;
  isOpen: boolean;
  closeModal: () => void;
  editForm: UseFormReturnType<
    {
      title: string;
      basisOfAgenda: string;
      currentDate: Date;
      time: string;
      note: string;
      picId: number;
    },
    (values: {
      title: string;
      basisOfAgenda: string;
      currentDate: Date;
      time: string;
      note: string;
      picId: number;
    }) => {
      title: string;
      basisOfAgenda: string;
      currentDate: Date;
      time: string;
      note: string;
      picId: number;
    }
  >;
}

export default function EditAgendaModal({
  agenda,
  setAgenda,
  editForm,
  isOpen,
  closeModal,
}: EditAgendaModalProps) {
  const queryClient = useQueryClient();
  const editAgendaMutation = useMutation({
    mutationFn: async () => {
      if (agenda === null) return;

      const now = new Date(editForm.values.currentDate);

      now.setHours(parseInt(editForm.values.time.split(":")[0]));
      now.setMinutes(parseInt(editForm.values.time.split(":")[1]));

      return await editAgenda({
        agendaId: agenda.id,
        payload: {
          title: editForm.values.title,
          basisOfAgenda: editForm.values.basisOfAgenda,
          time: now,
          note: editForm.values.note,
          picId: editForm.values.picId,
        },
      });
    },
    onMutate: () => {
      showNotification({
        title: "Loading",
        message: "Sedang mengedit agenda...",
        color: "blue",
      });
    },
    onSuccess: async (data) => {
      if (data === undefined) return;

      await queryClient.invalidateQueries(["agenda"]);
      showNotification({
        title: "Success",
        message: "Agenda berhasil diedit!",
        color: "green",
      });
      closeModal();
    },
    onError: (error) => {
      if (error === undefined) return;
      if (!(error instanceof Error)) {
        showNotification({
          title: "Error",
          message: "Terjadi kesalahan pada server!",
          color: "red",
        });
        return;
      }

      showNotification({
        title: "Error",
        message: error.message ?? "Gagal mengubah data agenda!",
        color: "red",
      });
    },
  });

  const handleEditAgenda = () => {
    if (agenda === null) {
      showNotification({
        title: "Error",
        message: "Tidak memilih agenda untuk diedit!",
        color: "red",
      });
      return;
    }

    if (editForm.validate().hasErrors) {
      return;
    }

    editAgendaMutation.mutate();
  };

  // User or PIC
  const searchForm = useForm({
    initialValues: {
      search: "",
    },
  });
  const [searchDebounced] = useDebouncedValue(searchForm.values.search, 500);

  const getListUserQuery = useQuery({
    queryKey: ["edit_agenda_modal_user"],
    queryFn: async () => getListUser({ search: searchDebounced }),
  });

  useEffect(() => {
    void getListUserQuery.refetch();
  }, [getListUserQuery, searchDebounced]);

  // Option
  const selectOptionsUser: UserSelectOption[] | undefined =
    getListUserQuery.data?.data.map((user) => ({
      value: String(user.id),
      label: user.name,
    }));

  if (getListUserQuery.isLoading) return <p>Loading...</p>;
  if (selectOptionsUser === undefined) return <p>loading...</p>;

  return (
    <Modal
      onClose={() => {
        setAgenda(null);
        closeModal();
      }}
      opened={isOpen}
      title="Edit Agenda"
      padding={"xl"}
    >
      <Flex direction={"column"} gap={"md"}>
        <TextInput label="Agenda" {...editForm.getInputProps("title")} />
        <Select
          label="PIC"
          searchable
          nothingFound="No options"
          data={selectOptionsUser}
          {...editForm.getInputProps("picId")}
          defaultValue={agenda?.picId.toString()}
        />
        <TextInput
          label="Dasar Kegiatan"
          {...editForm.getInputProps("basisOfAgenda")}
        />
        <TimeInput
          label="Waktu"
          {...editForm.getInputProps("time")}
        ></TimeInput>

        <ButtonAMDA onClick={handleEditAgenda}>Simpan</ButtonAMDA>
      </Flex>
    </Modal>
  );
}
