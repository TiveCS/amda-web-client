import ButtonAMDA from "@components/ButtonAMDA";
import {
  AspectRatio,
  Flex,
  Image,
  Overlay,
  Skeleton,
  Transition,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
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
}: EvidenceImageItemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const { hovered, ref: aspectRef } = useHover<HTMLDivElement>();

  const hasSrc = src !== null && src !== undefined;

  const [isLoaded, setIsLoaded] = useState(false);

  const handleOpenImage = () => {
    if (!hasSrc) return;
    window.open(src, "_blank");
  };

  return (
    <Flex direction={"column"} gap={"sm"}>
      <p className="font-medium">{label}</p>

      <AspectRatio ratio={1920 / 1080} ref={aspectRef}>
        <Skeleton visible={hasSrc ? !isLoaded : false}>
          <Transition
            mounted={hovered && hasSrc}
            transition={"fade"}
            duration={400}
            timingFunction="ease"
          >
            {(styles) => (
              <Overlay style={styles} center blur={5}>
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
