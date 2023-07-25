import { removeActivity } from "@api/activities";
import ButtonAMDA from "@components/ButtonAMDA";
import { Flex, Modal, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface RemoveActivityModalProps {
  isOpen: boolean;
  closeModal: () => void;
  listRemoveActivity: number[];
  setListRemoveActivity: React.Dispatch<React.SetStateAction<number[]>>;
}

export default function RemoveActivityModal(props: RemoveActivityModalProps) {
  const queryClient = useQueryClient();

  const removeActivityMutation = useMutation({
    mutationFn: async () => {
      const result = await Promise.all(
        props.listRemoveActivity.map(async (id) => await removeActivity(id))
      );

      return result;
    },
    onMutate: () => {
      showNotification({
        title: "Loading",
        message: "Sedang menghapus kegiatan...",
        color: "blue",
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["lops"]);
      props.setListRemoveActivity([]);

      showNotification({
        title: "Success",
        message: "Berhasil menghapus kegiatan",
        color: "green",
      });
      props.closeModal();
    },
    onError: (error) => {
      if (error instanceof Error) {
        showNotification({
          title: "Error",
          message: error.message ?? "Gagal menghapus kegiatan",
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

  return (
    <Modal
      opened={props.isOpen}
      onClose={() => {
        props.closeModal();
      }}
      title="Hapus Kegiatan?"
      centered
      padding={"xl"}
    >
      <Text>
        Apakah anda ingin menghapus{" "}
        <strong>{props.listRemoveActivity.length}</strong> kegiatan?
      </Text>

      <Flex justify={"flex-end"} className="mt-12">
        <ButtonAMDA variant="white" onClick={props.closeModal}>
          Batal
        </ButtonAMDA>
        <ButtonAMDA
          color="red"
          onClick={() => {
            if (props.listRemoveActivity.length === 0) {
              showNotification({
                title: "Error",
                message: "Tidak ada kegiatan yang dipilih",
                color: "red",
              });
              return;
            }
            removeActivityMutation.mutate();
          }}
        >
          Hapus
        </ButtonAMDA>
      </Flex>
    </Modal>
  );
}
