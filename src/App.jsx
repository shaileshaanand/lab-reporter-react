import "./App.css";

import { Title, Burger, useMantineTheme } from "@mantine/core";
import { useState } from "react";
import Login from "./pages/Login";
import NavbarSegmented from "./components/Navbar";
import { Container } from "@mantine/core";
import { useForm } from "@mantine/form";
import { PasswordInput, TextInput } from "@mantine/core";
import { Button, Box } from "@mantine/core";
import { Stack } from "@mantine/core";
import { Center } from "@mantine/core";
import routes from "./routes";
import { useRoutes } from "raviger";
import { useLocalStorageValue } from "@mantine/hooks";
import useToken from "./hooks/use-token";
import { NotFound } from "./pages/404";
function App() {
  const router = useRoutes(routes);
  const [token, setToken] = useToken();
  // console.log(token);
  return (
    <Box
      sx={() => {
        return { display: token ? "flex" : "block" };
      }}
    >
      {token && <NavbarSegmented />}
      <Box
        p={3}
        sx={() => {
          return { flexGrow: 1, maxHeight: "100vh", overflowY: "auto" };
        }}
      >
        {router ? (
          router
        ) : (
          <Center>
            <NotFound />
          </Center>
        )}
      </Box>
    </Box>
  );
}

export default App;
