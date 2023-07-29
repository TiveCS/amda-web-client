import { AspectRatio, Flex, Image, Skeleton } from "@mantine/core";
import { useRef } from "react";

interface EvidenceImageItemProps {
  src: string | null | undefined;
  label?: string;
}

export default function EvidenceImageItem({
  src,
  label,
}: EvidenceImageItemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const hasSrc = src !== null && src !== undefined;
  const isComplete = imgRef.current?.complete ?? false;

  return (
    <Flex direction={"column"} gap={"sm"}>
      <p className="font-medium">{label}</p>

      <AspectRatio ratio={1920 / 1080}>
        <Skeleton visible={hasSrc ? !isComplete : false}>
          <Image
            src={src}
            ref={containerRef}
            imageRef={imgRef}
            withPlaceholder
            onClick={
              hasSrc
                ? () => {
                    window.open(src, "_blank");
                  }
                : undefined
            }
            className={
              isComplete
                ? "cursor-pointer hover:opacity-70 transition-opacity duration-300"
                : ""
            }
          />
        </Skeleton>
      </AspectRatio>
    </Flex>
  );
}
