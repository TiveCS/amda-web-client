import LoginForms from "@components/pages/Login/LoginForms";
import { BackgroundImage, Flex } from "@mantine/core";
import Bg from "/assets/img/background-merah.png";
import usePing from "@hooks/usePing";

export function LoginPage() {
  usePing();

  return (
    <>
      <BackgroundImage src={Bg}>
        <Flex justify={"center"} align={"center"} className="min-h-screen">
          <LoginForms />
        </Flex>
        <div className="absolute bottom-0 right-0 mr-8 mb-4 font-poppins text-sm text-white inline-flex items-center gap-x-2">
          <p>&copy; 2023 Telkom Witel Solo</p>
        </div>
      </BackgroundImage>
    </>
  );
}

export default LoginPage;
