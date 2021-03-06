import React from "react";

import { Title } from "@mantine/core";
import { Container } from "@mantine/core";
import { PasswordInput, TextInput } from "@mantine/core";
import { Button, Box } from "@mantine/core";
import { Stack } from "@mantine/core";
import { Center } from "@mantine/core";
import { useForm } from "@mantine/form";

import useLogin from "../hooks/use-login";
import useToken from "../hooks/use-token";

const Login = () => {
  const [_, setToken] = useToken();
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },

    validate: {
      username: (value) => (value ? null : "Username is required"),
      password: (value) => (value.length < 6 ? "Password too short" : null),
    },
  });

  const { isFetching, refetch } = useLogin(form.values, {
    onSuccess: (data) => {
      setToken(data.token);
    },
  });

  return (
    <Container
      size="xs"
      sx={{
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <Center>
          <Title order={1}>Lab Reporter</Title>
        </Center>
        <Center>
          <Title order={3} mt={20}>
            Please Login
          </Title>
        </Center>
        <form
          onSubmit={form.onSubmit(() => {
            refetch();
          })}
          style={{ minHeight: "100%" }}
        >
          <Stack>
            <TextInput
              required
              label="Username"
              disabled={isFetching}
              {...form.getInputProps("username")}
            />
            <PasswordInput
              required
              label="Password"
              disabled={isFetching}
              {...form.getInputProps("password")}
            />
            <Button type="submit" disabled={isFetching}>
              Login
            </Button>
          </Stack>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
