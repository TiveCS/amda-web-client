import LoginForms from "@components/pages/Login/LoginForms";
import { Flex } from "@mantine/core";

export function LoginPage() {
  return (
    <>
      <Flex justify={"center"} align={"center"} className="min-h-screen">
        <LoginForms />
      </Flex>
    </>
  );
}

export default LoginPage;
