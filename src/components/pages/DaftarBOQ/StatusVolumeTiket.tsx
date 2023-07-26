import { Badge } from "@mantine/core";

export default function StatusVolumeTiket() {
  const isPartialCompleted = true;
  const isCompleted = true;

  return (
    <Badge
      color={isCompleted ? "green" : isPartialCompleted ? "blue" : "red"}
      variant="outline"
    >
      {isCompleted
        ? "Lengkap"
        : isPartialCompleted
        ? "Kurang Lengkap"
        : "Belum Lengkap"}
    </Badge>
  );
}
