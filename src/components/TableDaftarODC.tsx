import { Checkbox } from "@mantine/core";
import { PropsWithChildren } from "react";

interface Props {
  datel: string;
  sto: string;
  location?: string;
  latitude?: string;
  longitude?: string;
  inventoryStatus?: string;
  kapODC?: string;
  miniOLT?: string;
}

const TableDaftarODC = ({
  datel,
  sto,
  location,
  latitude,
  longitude,
  inventoryStatus,
  kapODC,
  miniOLT,
}: PropsWithChildren<Props>) => {
  return (
    <>
      <tr>
        <td>
          <Checkbox></Checkbox>
        </td>
        <td>{datel}</td>
        <td>{sto}</td>
        <td>{location}</td>
        <td>{longitude}</td>
        <td>{latitude}</td>
        <td>{inventoryStatus}</td>
        <td>{kapODC}</td>
        <td>{miniOLT}</td>
      </tr>
    </>
  );
};

export default TableDaftarODC;
