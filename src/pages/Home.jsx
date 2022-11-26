import { Group, Title, Box } from "@mantine/core";

import NewDoctor from "../components/buttons/NewDoctor";
import NewPatient from "../components/buttons/NewPatient";
import NewReport from "../components/buttons/NewReport";

const Home = () => {
  return (
    <Box m={30}>
      <Group>
        <NewReport />
        <NewPatient />
        <NewDoctor />
      </Group>
      <Box mt={30}>
        <Title order={4}>Recent Reports</Title>
      </Box>
    </Box>
  );
};
export default Home;
