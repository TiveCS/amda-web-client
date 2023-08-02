import { importDesignator } from "@api/designators";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import useImportDesignatorForm from "./useImportDesignatorForm";
import { NestResponse } from "@api/types/common";
import { PostImportDesignatorPreviewResponse } from "@api/types/designators";
import { IconCheck, IconX } from "@tabler/icons-react";

interface ImportDesignatorPreviewMutationProps {
  importForm: ReturnType<typeof useImportDesignatorForm>;
  nextStep: () => void;
}

export default function useImportDesignatorPreviewMutation({
  importForm,
  nextStep,
}: ImportDesignatorPreviewMutationProps) {
  const notificationId = `import-designator-notification-preview`;

  return useMutation({
    mutationFn: async () => {
      const res: NestResponse<PostImportDesignatorPreviewResponse> =
        (await importDesignator({
          ...importForm.values,
          mode: "preview",
        })) as unknown as NestResponse<PostImportDesignatorPreviewResponse>;

      return res;
    },
    onMutate: () => {
      notifications.show({
        id: notificationId,
        title: "Loading",
        message: "Sedang mengimpor designator...",
        loading: true,
        color: "blue",
        autoClose: false,
      });
    },
    onSuccess: () => {
      notifications.update({
        id: notificationId,
        title: "Sukses",
        color: "green",
        message: "Berhasil mengimpor data preview designator",
        autoClose: 3000,
        icon: <IconCheck />,
      });
      nextStep();
    },
    onError: (error) => {
      if (error instanceof Error) {
        notifications.update({
          id: notificationId,
          title: "Error",
          color: "red",
          message: error.message ?? "Gagal mengimpor preview designator",
          autoClose: 3000,
          icon: <IconX />,
        });
        return;
      }
      notifications.update({
        id: notificationId,
        title: "Error",
        color: "red",
        message: "Terjadi kesalahan internal",
        autoClose: 3000,
        icon: <IconX />,
      });
    },
  });
}
