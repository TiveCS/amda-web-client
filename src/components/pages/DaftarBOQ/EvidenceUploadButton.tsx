import { uploadEvidence } from "@api/tickets";
import ButtonAMDA from "@components/ButtonAMDA";
import { FileButton } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface EvidenceUploadButtonProps {
  text: string;
  type: "before" | "after" | "onProgress";
  ticketIdentifier: string | undefined;
}

export default function EvidenceUploadButton({
  text,
  type,
  ticketIdentifier,
}: EvidenceUploadButtonProps) {
  const [file, setFile] = useState<File | null>(null);

  const notificationId = `upload-evidence-${type}-${ticketIdentifier ?? ""}`;
  const queryClient = useQueryClient();

  const { mutateAsync: uploadAsync, isLoading } = useMutation({
    mutationFn: async () => {
      if (!ticketIdentifier) return null;
      if (!file) return null;

      const res = await uploadEvidence(ticketIdentifier, {
        file,
        type,
      });

      return res;
    },
    onMutate: () => {
      notifications.show({
        id: notificationId,
        title: "Loading",
        message: "Sedang mengupload evidence...",
        color: "blue",
        loading: true,
        autoClose: false,
        withCloseButton: false,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["tickets"]);
      await queryClient.invalidateQueries([
        "evidence_drawer_evidence",
        ticketIdentifier,
      ]);

      notifications.update({
        id: notificationId,
        title: "Success",
        message: "Evidence berhasil diupload",
        color: "green",
        icon: <IconCheck />,
        autoClose: 3000,
      });
    },
    onError: (err) => {
      if (err instanceof Error) {
        notifications.update({
          id: notificationId,
          title: "Error",
          message: err.message ?? "Gagal mengupload evidence",
          color: "red",
          autoClose: 3000,
        });
        return;
      }
      notifications.update({
        id: notificationId,
        title: "Error",
        message: "Terjadi kesalahan internal saat upload",
        color: "red",
        autoClose: 3000,
      });
    },
  });

  useEffect(() => {
    if (!file) return;

    void uploadAsync();
  }, [file, uploadAsync]);

  return (
    <FileButton
      onChange={(payload) => {
        setFile(payload);
      }}
      accept="image/png, image/jpeg, image/jpg"
    >
      {(props) => (
        <ButtonAMDA {...props} variant="outline" loading={isLoading}>
          {text}
        </ButtonAMDA>
      )}
    </FileButton>
  );
}
