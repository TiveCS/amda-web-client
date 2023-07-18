import { Checkbox } from "@mantine/core";
import { PropsWithChildren } from "react";

interface Props {
  nossID?: string;
  ODPIndex?: string;
  ODPName?: string;
  latitude?: string;
  longitude?: string;
  clusname?: string;
  clusterStatus?: string;
  avai?: string;
  used?: string;
  rsv?: string;
  rsk?: string;
  regional?: string;
  witel?: string;
  datel?: string;
  sto?: string;
  stoDesc?: string;
  ODPInfo?: string;
  updateDate?: string;
  tanggalGolive?: string;
  kategori?: string;
  namaProyek?: string;
  kabOrKota?: string;
  provinsi?: string;
  occ1?: string;
  occ2?: string;
  validasiSTO?: string;
  validasiODP?: string;
  jarakODPtoODC?: string;
  jarakODCtoSTO?: string;
  jarakODPtoSTO?: string;
  validasiProvinsi?: string;
  validasiKabOrKota?: string;
  validasiKecamatan?: string;
  validasiKelurahan?: string;
}

const TableDaftarODP = ({ ...props }: PropsWithChildren<Props>) => {
  return (
    <>
      <tr>
        <td>
          <Checkbox></Checkbox>
        </td>
        <td>{props.nossID}</td>
        <td>{props.ODPIndex}</td>
        <td>{props.ODPName}</td>
        <td>{props.latitude}</td>
        <td>{props.longitude}</td>
        <td>{props.clusname}</td>
        <td>{props.clusterStatus}</td>
        <td>{props.avai}</td>
        <td>{props.used}</td>
        <td>{props.rsv}</td>
        <td>{props.rsk}</td>
        <td>{props.regional}</td>
        <td>{props.witel}</td>
        <td>{props.datel}</td>
        <td>{props.sto}</td>
        <td>{props.stoDesc}</td>
        <td>{props.ODPInfo}</td>
        <td>{props.updateDate}</td>
        <td>{props.tanggalGolive}</td>
        <td>{props.kategori}</td>
        <td>{props.namaProyek}</td>
        <td>{props.kabOrKota}</td>
        <td>{props.provinsi}</td>
        <td>{props.occ1}</td>
        <td>{props.occ2}</td>
        <td>{props.validasiSTO}</td>
        <td>{props.validasiODP}</td>
        <td>{props.jarakODPtoODC}</td>
        <td>{props.jarakODCtoSTO}</td>
        <td>{props.jarakODPtoSTO}</td>
        <td>{props.validasiProvinsi}</td>
        <td>{props.validasiKabOrKota}</td>
        <td>{props.validasiKecamatan}</td>
        <td>{props.validasiKelurahan}</td>
      </tr>
    </>
  );
};

export default TableDaftarODP;
