import { deleteTicketEvidence } from "@api/tickets";
import ButtonAMDA from "@components/ButtonAMDA";
import {
  AspectRatio,
  Flex,
  Image,
  LoadingOverlay,
  Overlay,
  Skeleton,
  Tooltip,
  Transition,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";

interface EvidenceImageItemProps {
  src: string | null | undefined;
  label?: string;
  identifier: string | undefined;
  type: "before" | "after" | "onProgress";
}

export default function EvidenceImageItem({
  src,
  label,
  identifier,
  type,
}: EvidenceImageItemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const { hovered, ref: aspectRef } = useHover<HTMLDivElement>();

  const hasSrc = src !== null && src !== undefined;

  const [isLoaded, setIsLoaded] = useState(false);
  const notificationId = `delete-evidence-${type}-${identifier ?? ""}`;

  const queryClient = useQueryClient();
  const deleteImgMutation = useMutation({
    mutationFn: async () => {
      if (identifier === undefined) return null;

      return await deleteTicketEvidence(identifier, type);
    },
    onMutate: async () => {
      await queryClient.cancelQueries(["evidence_drawer_evidence", identifier]);

      notifications.show({
        id: notificationId,
        title: "Loading",
        message: "Sedang menghapus gambar...",
        color: "blue",
        loading: true,
        autoClose: false,
        withCloseButton: false,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries([
        "evidence_drawer_evidence",
        identifier,
      ]);

      notifications.update({
        id: notificationId,
        title: "Berhasil",
        message: "Berhasil menghapus gambar",
        color: "green",
        autoClose: 3000,
        icon: <IconCheck />,
      });
    },
    onError: (error) => {
      if (error instanceof Error) {
        notifications.update({
          id: notificationId,
          title: "Error",
          message: error.message ?? "Gagal menghapus gambar",
          color: "red",
          autoClose: 3000,
          icon: <IconCheck />,
        });
        return;
      }
      notifications.update({
        id: notificationId,
        title: "Error",
        message: "Terjadi kesalahan internal saat menghapus gambar",
        color: "red",
        autoClose: 3000,
        icon: <IconCheck />,
      });
    },
  });

  const handleOpenImage = () => {
    if (!hasSrc) return;
    window.open(src, "_blank");
  };

  const handleDeleteImage = async () => {
    await deleteImgMutation.mutateAsync();
  };

  return (
    <Flex direction={"column"} gap={"sm"}>
      <p className="font-medium">{label}</p>

      <AspectRatio ratio={1920 / 1080} ref={aspectRef}>
        <LoadingOverlay visible={deleteImgMutation.isLoading} />

        <Skeleton visible={hasSrc ? !isLoaded : false}>
          <Transition
            mounted={hovered && hasSrc}
            transition={"fade"}
            duration={400}
            timingFunction="ease"
          >
            {(styles) => (
              <Overlay style={styles} center blur={5}>
                <Tooltip label="Delete" position="top">
                  <button
                    onClick={() => void handleDeleteImage()}
                    className="group absolute top-0 right-0 bg-transparent border-none hover:cursor-pointer mt-4 mr-4"
                  >
                    <IconTrash className="text-gray-300 group-hover:text-red-400 transition-colors duration-500" />
                    {""}
                  </button>
                </Tooltip>

                <ButtonAMDA color="red" onClick={handleOpenImage}>
                  Lihat Foto
                </ButtonAMDA>
              </Overlay>
            )}
          </Transition>

          <Image
            src={src}
            ref={containerRef}
            imageRef={imgRef}
            withPlaceholder
            onLoad={() => setIsLoaded(true)}
          />
        </Skeleton>
      </AspectRatio>
    </Flex>
  );
}
