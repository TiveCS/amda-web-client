import LoginForms from "@components/pages/Login/LoginForms";
import { BackgroundImage, Flex } from "@mantine/core";
import Bg from "/assets/img/background-merah.png";
import { IconCopyright } from "@tabler/icons-react";

export function LoginPage() {
  return (
    <>
      <BackgroundImage src={Bg}>
        <Flex justify={"center"} align={"center"} className="min-h-screen">
          <LoginForms />
        </Flex>
        <div className="flex justify-center font-poppins text-white">
          <IconCopyright className="w-5" /> <p>Telkom Witel Solo 2023</p>
        </div>
      </BackgroundImage>
    </>
  );
}

export default LoginPage;
