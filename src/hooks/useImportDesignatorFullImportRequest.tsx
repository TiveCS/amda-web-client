import { getDesignatorImportStatus, importDesignator } from "@api/designators";
import { NestResponse } from "@api/types/common";
import { PostImportDesignatorFullImportResponse } from "@api/types/designators";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconCheck, IconX } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import useImportDesignatorForm from "./useImportDesignatorForm";

interface ImportDesignatorFullImportMutationProps {
  importForm: ReturnType<typeof useImportDesignatorForm>;
  closeModal: () => void;
}

export default function useImportDesignatorFullImportRequest({
  importForm,
  closeModal,
}: ImportDesignatorFullImportMutationProps) {
  const notificationId = `import-designator-notification-full-import`;

  const [jobId, setJobId] = useState<string | null>(null);

  const { refetch: refetchRequestFullImportQuery, ...requestFullImportQuery } =
    useQuery({
      enabled: !!jobId,
      refetchInterval: 1000,
      queryKey: ["import-designator-full-import", jobId],
      queryFn: async () => {
        if (!jobId) return null;

        const res = await getDesignatorImportStatus(jobId);

        console.log(res.data);

        if (res.data.failedReason) {
          throw new Error(res.data.failedReason);
        }
        if (!res.data.finishedOn) {
          throw new Error("Job belum selesai");
        }

        notifications.update({
          id: notificationId,
          title: "Sukses",
          color: "green",
          message: "Berhasil mengimpor data designator",
          autoClose: 3000,
          icon: <IconCheck />,
        });

        setJobId(null);

        closeModal();

        return res;
      },
    });

  useEffect(() => {
    if (!jobId) return;

    console.log("job", jobId);

    void refetchRequestFullImportQuery();
  }, [jobId, refetchRequestFullImportQuery]);

  const requestFullImportMutation = useMutation({
    mutationFn: async () => {
      const res: NestResponse<PostImportDesignatorFullImportResponse> =
        (await importDesignator({
          ...importForm.values,
          mode: "full_import",
        })) as unknown as NestResponse<PostImportDesignatorFullImportResponse>;

      return res;
    },
    onMutate: () => {
      setJobId(null);
      notifications.show({
        id: notificationId,
        title: "Loading",
        message: "Membuat permintaan full import designator...",
        loading: true,
        color: "blue",
        autoClose: false,
        withCloseButton: false,
      });
    },
    onSuccess: (data) => {
      setJobId(data.data.jobId);
      notifications.show({
        title: "Success",
        message:
          "Import designator sedang dilakukan. Anda akan mendapatkan notifikasi ketika proses selesai",
        color: "blue",
        autoClose: 5000,
        icon: <IconAlertCircle />,
      });
    },
    onError: (error) => {
      setJobId(null);
      if (error instanceof Error) {
        notifications.update({
          id: notificationId,
          title: "Error",
          color: "red",
          message: error.message ?? "Gagal melakukan full import designator",
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

  return {
    mutation: requestFullImportMutation,
    query: {
      refetch: refetchRequestFullImportQuery,
      ...requestFullImportQuery,
    },
    jobId: jobId,
  };
}
