import { Checkbox } from "@mantine/core";
import { PropsWithChildren } from "react";

interface Props {
  regional: string;
  witel: string;
  datel: string;
  sto: string;
  CSStartLocn?: string;
  idCSStartLocn?: string;
  idCS?: string;
  routeSection?: string;
  CS?: string;
  distNumber?: string;
  CSCoreTotal?: string;
  CSCoreUser?: string;
  CSCoreIdle?: string;
}

const TableDaftarOCC = ({ ...props }: PropsWithChildren<Props>) => {
  return (
    <>
      <tr>
        <td>
          <Checkbox></Checkbox>
        </td>
        <td>{props.regional}</td>
        <td>{props.witel}</td>
        <td>{props.datel}</td>
        <td>{props.sto}</td>
        <td>{props.CSStartLocn}</td>
        <td>{props.idCSStartLocn}</td>
        <td>{props.idCS}</td>
        <td>{props.routeSection}</td>
        <td>{props.CS}</td>
        <td>{props.distNumber}</td>
        <td>{props.CSCoreTotal}</td>
        <td>{props.CSCoreUser}</td>
        <td>{props.CSCoreIdle}</td>
      </tr>
    </>
  );
};

export default TableDaftarOCC;
