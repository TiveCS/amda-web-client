import { MitraResponsePayload } from "@api/types/mitra";
import ButtonAMDA from "@components/ButtonAMDA";
import { Flex } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconEdit, IconTrash } from "@tabler/icons-react";

interface MitraItemTableProps {
  mitra: MitraResponsePayload;
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
}: MitraItemTableProps) {
  return (
    <tr>
      <td>{mitra.name}</td>
      <td>
        <Flex direction={"row"} justify={"space-between"}>
          <ButtonAMDA
            variant="white"
            onClick={() => {
              setEditMitra(mitra);
              editMitraForm.setValues({ nama: mitra.name });
              openEditMitraModal();
            }}
          >
            <IconEdit></IconEdit>
          </ButtonAMDA>
          <ButtonAMDA
            variant="white"
            onClick={() => {
              setRemoveMitra(mitra);
              openRemoveMitraModal();
            }}
          >
            <IconTrash></IconTrash>
          </ButtonAMDA>
        </Flex>
      </td>
    </tr>
  );
}
