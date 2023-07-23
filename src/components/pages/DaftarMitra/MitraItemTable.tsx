import { MitraResponsePayload } from "@api/types/mitra";
import ButtonAMDA from "@components/ButtonAMDA";
import { Flex } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";

interface MitraItemTableProps {
  mitra: MitraResponsePayload;
  setRemoveMitraId: React.Dispatch<
    React.SetStateAction<MitraResponsePayload | null>
  >;
  openRemoveMitraModal: () => void;
}

export default function MitraItemTable({
  mitra,
  setRemoveMitraId,
  openRemoveMitraModal,
}: MitraItemTableProps) {
  return (
    <tr>
      <td>{mitra.name}</td>
      <td>
        <Flex direction={"row"} justify={"space-between"}>
          <ButtonAMDA variant="white">
            <IconEdit></IconEdit>
          </ButtonAMDA>
          <ButtonAMDA
            variant="white"
            onClick={() => {
              setRemoveMitraId(mitra);
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
