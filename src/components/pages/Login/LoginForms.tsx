import { getProfile, login } from "@api/auth";
import ButtonAMDA from "@components/ButtonAMDA";
import { Box, Flex, Group, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProfileStore } from "@zustand/profileStore";
import { redirect, useNavigate } from "react-router-dom";
import { ProfileType } from "src/types";

export default function LoginForms() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const profileStore = useProfileStore();

  const profileMutation = useMutation({
    mutationFn: async () => {
      const profile = await getProfile();
      profileStore.setProfile(profile.data);
    },
    onMutate: () => {
      profileStore.setStatus("loading");
    },
    onError: () => {
      profileStore.setStatus("unauthenticated");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      profileStore.setStatus("authenticated");
    },
  });

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
      const loginRes = await login({ username, password });

      profileMutation
        .mutateAsync()
        .then(() => {
          showNotification({
            title: "Success",
            message: loginRes.message,
            color: "green",
          });

          navigate("/management/users");
        })
        .catch((err) => {
          if (err instanceof Error) {
            showNotification({
              title: "Error",
              message: "Failed to fetch profile",
              color: "red",
              autoClose: 5000,
            });
          }
        });
    } catch (err) {
      if (err instanceof Error) {
        showNotification({
          title: "Error",
          message: err.message,
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
