import { Checkbox, Modal } from "@mantine/core";
import { PropsWithChildren } from "react";
import ButtonAMDA from "./ButtonAMDA";
import { IconEye } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";

interface Props {
  role: string;
  username: string;
  name: string;
  mitra: string;
  password: string;
}

const TableUserManagement = ({
  role,
  username,
  name,
  mitra,
  password,
}: PropsWithChildren<Props>) => {
  const [openedPassword, { open: openPassword, close: closePassword }] =
    useDisclosure(false);

  return (
    <>
      <Modal opened={openedPassword} onClose={closePassword} title="Password">
        <p>{password}</p>
      </Modal>
      <tr>
        <td>
          <Checkbox></Checkbox>
        </td>
        <td>{role}</td>
        <td>{username}</td>
        <td>{name}</td>
        <td>{mitra}</td>
        <td>
          <ButtonAMDA onClick={openPassword} variant="subtle">
            <IconEye></IconEye>
          </ButtonAMDA>
        </td>
      </tr>
    </>
  );
};

export default TableUserManagement;
