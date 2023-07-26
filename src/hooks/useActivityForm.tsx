import { LopActivity, LopActivityForm } from "@api/types/lops";
import { isInRange, isNotEmpty, matches, useForm } from "@mantine/form";

interface LopActivityFormProps {
  activity?: LopActivity | null | undefined;
}

export default function useActivityForm({
  activity = null,
}: LopActivityFormProps) {
  const isActivityEmpty = activity === null || activity === undefined;

  const inputAt = isActivityEmpty ? new Date() : new Date(activity.inputAt);

  const form = useForm<LopActivityForm>({
    initialValues: {
      lopId: isActivityEmpty ? -1 : activity.lopId,
      stoId: isActivityEmpty ? -1 : activity.sto.id,
      mitraId: isActivityEmpty ? -1 : activity.mitra.id,
      ticketIdentifier: isActivityEmpty ? "" : activity.ticket.identifier,
      ticketLocation: isActivityEmpty ? "" : activity.ticket.location,
      workType: isActivityEmpty ? "" : activity.workType,
      isForMitra: isActivityEmpty ? false : activity.isForMitra,
      inputDate: inputAt,
      inputTime: isActivityEmpty
        ? "00:00"
        : `${inputAt.getHours()}:${inputAt.getMinutes()}}`,
    },
    validate: {
      lopId: isInRange({ min: 1 }, "LOP harus dipilih"),
      stoId: isInRange({ min: 1 }, "STO harus dipilih"),
      mitraId: isInRange({ min: 1 }, "Mitra harus dipilih"),
      workType: isNotEmpty("Jenis pekerjaan harus diisi"),
      inputDate: (value) =>
        value === null ? "Tanggal input harus diisi" : null,
      inputTime: isNotEmpty("Waktu input harus diisi"),
      ticketIdentifier: matches(/^IN\d+$/, "ID Tiket tidak valid"),
    },
    validateInputOnChange: true,
  });

  const updateForm = (activity: LopActivity) => {
    const inputAt = new Date(activity.inputAt);
    const inputTime = `${inputAt
      .getHours()
      .toString()
      .padStart(2, "0")}:${inputAt.getMinutes().toString().padStart(2, "0")}`;

    form.setValues({
      lopId: activity.lopId,
      stoId: activity.sto.id,
      mitraId: activity.mitra.id,
      ticketIdentifier: activity.ticket.identifier,
      ticketLocation: activity.ticket.location ?? "",
      workType: activity.workType ?? "",
      isForMitra: activity.isForMitra,
      inputDate: inputAt,
      inputTime: inputTime,
    });
  };

  return { form, updateForm };
}
