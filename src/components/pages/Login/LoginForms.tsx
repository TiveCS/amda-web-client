import { getProfile, login } from "@api/auth";
import ButtonAMDA from "@components/ButtonAMDA";
import {
  Image,
  Card,
  Flex,
  Group,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useProfileStore } from "@zustand/profileStore";
import { useNavigate } from "react-router-dom";
import Logo from "/assets/img/amda-hitam.png";

export default function LoginForms() {
  const navigate = useNavigate();
  const profileStore = useProfileStore();

  const profileMutation = useMutation({
    mutationFn: async () => await getProfile(),
    onMutate: () => {
      profileStore.setProfile(null);
    },
    onError: () => {
      profileStore.setProfile(null);
    },
    onSuccess: ({ data: profile }) => {
      profileStore.setProfile(profile);
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

          navigate("/");
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
    <Card className="bg-gray-50 px-8 max-w-sm py-8 w-full" radius="md">
      <Image maw={200} mx="auto" src={Logo} alt="logo amda" className="mb-8" />
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
    </Card>
  );
}
