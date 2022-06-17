import { Table } from "@mantine/core";
import { Box } from "@mantine/core";
import { Group } from "@mantine/core";
import { ActionIcon } from "@mantine/core";
import { Title } from "@mantine/core";
import { Link } from "raviger";
import { useQuery } from "react-query";
import { Trash } from "tabler-icons-react";
import { Pencil } from "tabler-icons-react";
import { listPatients } from "../api/api";
import NewPatient from "../components/buttons/NewPatient";

const Patients = () => {
  const { data } = useQuery(
    "listPatients",
    async () => {
      const response = await listPatients();
      return response[1];
    },
    {}
  );
  return (
    <Box m={30}>
      <Title order={2} mb={20}>
        Patients
      </Title>
      <NewPatient />
      <Box mt={20}>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.name}</td>
                  <td>{patient.phone}</td>
                  <td>{patient.email}</td>
                  <td>{patient.age}</td>
                  <td>{patient.gender}</td>
                  <td>
                    <Group spacing={"xs"}>
                      <ActionIcon
                        color={"blue"}
                        component={Link}
                        href={`/patients/${patient.id}/edit`}
                      >
                        <Pencil />
                      </ActionIcon>
                      <ActionIcon color={"red"}>
                        <Trash />
                      </ActionIcon>
                    </Group>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Box>
    </Box>
  );
};
export default Patients;
