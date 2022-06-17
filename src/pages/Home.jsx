import { Group } from "@mantine/core";
import { Title } from "@mantine/core";
import { Box } from "@mantine/core";
import { useQuery } from "react-query";
import { listReports } from "../api/api";
import NewDoctor from "../components/buttons/NewDoctor";
import NewPatient from "../components/buttons/NewPatient";
import NewReport from "../components/buttons/NewReport";

const Home = () => {
  const { data } = useQuery("listReports", async () => {
    const response = await listReports();
    return response[1];
  });
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
