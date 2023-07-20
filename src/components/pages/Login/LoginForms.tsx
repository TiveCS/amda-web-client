import { login } from "@api/auth";
import { NestErrorResponse } from "@api/types/common";
import ButtonAMDA from "@components/ButtonAMDA";
import { Box, Flex, Group, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import { redirect, useNavigate } from "react-router-dom";

export default function LoginForms() {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
  });

  const handleLogin = ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    login({ username, password })
      .then((res) => {
        showNotification({
          title: "Success",
          message: res.data.message,
          color: "green",
        });

        navigate("/");
      })
      .catch((err) => {
        if (axios.isAxiosError(err)) {
          const errData: NestErrorResponse = err.response
            ?.data as unknown as NestErrorResponse;

          showNotification({
            title: "Error",
            message: errData.message,
            color: "red",
            autoClose: 5000,
          });
        }
      });
  };

  return (
    <Box className="bg-gray-50 px-8 max-w-sm py-8 w-full">
      <form onSubmit={form.onSubmit(handleLogin)}>
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
