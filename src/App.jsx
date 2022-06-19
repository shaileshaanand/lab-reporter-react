import "./App.css";

import { Box } from "@mantine/core";
import { Center } from "@mantine/core";
import { useRoutes } from "raviger";

import NavbarSegmented from "./components/Navbar";
import useToken from "./hooks/use-token";
import { NotFound } from "./pages/404";
import routes from "./routes";
function App() {
  const router = useRoutes(routes);
  const [token, _] = useToken();
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
