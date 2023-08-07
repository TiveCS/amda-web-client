import { MitraResponsePayload } from "@api/types/mitra";
import { Flex, Tooltip } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconEdit, IconTrash } from "@tabler/icons-react";

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
  return (
    <tr>
      <td>{mitra.name}</td>
      {!isAdminMitra && (
        <td>
          <Flex gap="xl" justify="center" align="center" direction="row">
            <Tooltip label={"Edit Mitra"}>
              <IconEdit
                onClick={() => {
                  setEditMitra(mitra);
                  editMitraForm.setValues({ nama: mitra.name });
                  openEditMitraModal();
                }}
                className="w-5 h-5 group-hover:text-sky-800 hover:cursor-pointer"
              />
            </Tooltip>
            <Tooltip label={"Remove Mitra"}>
              <IconTrash
                onClick={() => {
                  setRemoveMitra(mitra);
                  openRemoveMitraModal();
                }}
                className="w-5 h-5 group-hover:text-sky-800 hover:cursor-pointer"
              />
            </Tooltip>
          </Flex>
        </td>
      )}
    </tr>
  );
}
