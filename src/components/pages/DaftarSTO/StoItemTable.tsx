import { StoResponsePayload } from "@api/types/sto";
import { Flex, Tooltip } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconEdit, IconTrash } from "@tabler/icons-react";

interface StoItemTableProps {
  sto: StoResponsePayload;
  setRemoveSto: React.Dispatch<React.SetStateAction<StoResponsePayload | null>>;
  setEditSto: React.Dispatch<React.SetStateAction<StoResponsePayload | null>>;
  openRemoveStoModal: () => void;
  openEditStoModal: () => void;
  hasCRUDAccess: boolean;
  editStoForm: UseFormReturnType<
    {
      nama: string;
    },
    (values: { nama: string }) => {
      nama: string;
    }
  >;
}

export default function StoItemTable({
  sto,
  setRemoveSto,
  setEditSto,
  editStoForm,
  openRemoveStoModal,
  openEditStoModal,
  hasCRUDAccess,
}: StoItemTableProps) {
  return (
    <tr>
      <td>{sto.name}</td>
      <td>{sto._count.activities}</td>
      {hasCRUDAccess && (
        <td>
          <Flex gap="xl" justify="center" align="center" direction="row">
            <Tooltip label={"Edit STO"}>
              <IconEdit
                onClick={() => {
                  setEditSto(sto);
                  editStoForm.setValues({ nama: sto.name });
                  openEditStoModal();
                }}
                className="w-5 h-5 group-hover:text-sky-800 hover:cursor-pointer"
              />
            </Tooltip>
            <Tooltip label={"Remove STO"}>
              <IconTrash
                onClick={() => {
                  setRemoveSto(sto);
                  openRemoveStoModal();
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
