import { uploadTicketEvidence } from "@api/tickets";
import ButtonAMDA from "@components/ButtonAMDA";
import { FileButton } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconPlus, IconX } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface EvidenceUploadButtonProps {
  text: string;
  type: "before" | "after" | "onProgress";
  ticketIdentifier: string | undefined;
  disabled?: boolean;
}

export default function EvidenceUploadButton({
  text,
  type,
  ticketIdentifier,
  disabled,
}: EvidenceUploadButtonProps) {
  const [file, setFile] = useState<File | null>(null);

  const notificationId = `upload-evidence-${type}-${ticketIdentifier ?? ""}`;
  const queryClient = useQueryClient();

  const { mutateAsync: uploadAsync, isLoading } = useMutation({
    mutationFn: async () => {
      if (!ticketIdentifier) return null;
      if (!file) return null;

      const res = await uploadTicketEvidence(ticketIdentifier, {
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

  const validateFile = (file: File) => {
    const maxInMB = 1;
    const maxSize = maxInMB * 1024 * 1024; // act as MB
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

    const { size, type } = file;

    if (size > maxSize) {
      notifications.show({
        title: "Error",
        message: `Ukuran file terlalu besar, maksimal ${maxInMB}MB`,
        color: "red",
        autoClose: 3000,
        icon: <IconX />,
      });
      setFile(null);
      return false;
    }

    if (!allowedTypes.includes(type)) {
      notifications.show({
        title: "Error",
        message: "Tipe file tidak didukung, hanya png, jpg, jpeg",
        color: "red",
        autoClose: 3000,
        icon: <IconX />,
      });
      setFile(null);
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (!file) return;

    if (!validateFile(file)) return;

    void uploadAsync();
  }, [file, uploadAsync]);

  return (
    <FileButton
      onChange={(payload) => {
        setFile(payload);
      }}
      accept="image/png, image/jpeg, image/jpg"
      disabled={disabled}
    >
      {(props) => (
        <ButtonAMDA
          {...props}
          variant="outline"
          loading={isLoading}
          leftIcon={<IconPlus size={"1.25rem"} />}
          disabled={disabled}
        >
          {text}
        </ButtonAMDA>
      )}
    </FileButton>
  );
}
