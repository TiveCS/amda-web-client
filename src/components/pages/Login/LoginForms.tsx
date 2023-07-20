import { login } from "@api/auth";
import ButtonAMDA from "@components/ButtonAMDA";
import { Box, Flex, Group, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";

export default function LoginForms() {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
  });

  const handleLogin = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    try {
      const res = await login({ username, password });
      showNotification({
        title: "Success",
        message: res.message,
        color: "green",
      });

      navigate("/");
    } catch (err) {
      if (err instanceof Error) {
        showNotification({
          title: "Error",
          message: err.message, // here err.message will be your NestErrorResponse message
          color: "red",
          autoClose: 5000,
        });
      }
    }
  };

  return (
    <Box className="bg-gray-50 px-8 max-w-sm py-8 w-full">
      <form onSubmit={form.onSubmit((values) => void handleLogin(values))}>
        <Flex gap={"md"} direction={"column"}>
          <TextInput
            withAsterisk
            label="Username"
            placeholder="johndoe"
            {...form.getInputProps("username")}
          />

          <PasswordInput
            withAsterisk
            label="Password"
            placeholder="Your password"
            {...form.getInputProps("password")}
          />

          <Group position="right" mt="md">
            <ButtonAMDA type="submit" className="w-full">
              Login
            </ButtonAMDA>
          </Group>
        </Flex>
      </form>
    </Box>
  );
}
