import { MitraResponsePayload } from "@api/types/mitra";
import { ActionIcon, Flex, Tooltip } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useProfileStore } from "@zustand/profileStore";

interface MitraItemTableProps {
  mitra: MitraResponsePayload;
  isAdminMitra: boolean;
  setRemoveMitra: React.Dispatch<
    React.SetStateAction<MitraResponsePayload | null>
  >;
  setEditMitra: React.Dispatch<
    React.SetStateAction<MitraResponsePayload | null>
  >;
  openRemoveMitraModal: () => void;
  openEditMitraModal: () => void;
  editMitraForm: UseFormReturnType<
    {
      nama: string;
    },
    (values: { nama: string }) => {
      nama: string;
    }
  >;
}

export default function MitraItemTable({
  mitra,
  setRemoveMitra,
  setEditMitra,
  editMitraForm,
  openRemoveMitraModal,
  openEditMitraModal,
  isAdminMitra,
}: MitraItemTableProps) {
  const { profile } = useProfileStore();

  return (
    <tr>
      <td>{mitra.name}</td>
      <td>{mitra._count.users}</td>
      <td>{mitra._count.activities}</td>
      {!isAdminMitra && (
        <td>
          <Flex gap="xl" justify="center" align="center" direction="row">
            <Tooltip label={"Edit Mitra"}>
              <ActionIcon
                color="dark"
                variant="transparent"
                onClick={() => {
                  setEditMitra(mitra);
                  editMitraForm.setValues({ nama: mitra.name });
                  openEditMitraModal();
                }}
              >
                <IconEdit className="w-5 h-5" />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={"Remove Mitra"} color="red">
              <ActionIcon
                color="red"
                disabled={profile?.mitra.id === mitra.id}
                onClick={() => {
                  setRemoveMitra(mitra);
                  openRemoveMitraModal();
                }}
              >
                <IconTrash className="w-5 h-5" />
              </ActionIcon>
            </Tooltip>
          </Flex>
        </td>
      )}
    </tr>
  );
}
