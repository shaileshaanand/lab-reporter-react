import { Group } from "@mantine/core";
import { ActionIcon } from "@mantine/core";
import { Center } from "@mantine/core";
import { Loader } from "@mantine/core";
import { Space, Table, Box } from "@mantine/core";
import { Link } from "raviger";
import { useQuery } from "react-query";
import { Trash } from "tabler-icons-react";
import { Pencil } from "tabler-icons-react";
import { listDoctors } from "../api/api";
import NewDoctor from "../components/buttons/NewDoctor";
import PageLayout from "../components/PageLayout";

const Doctors = () => {
  const listDoctorsQuery = useQuery(["listDoctors"], async () => {
    const response = await listDoctors();
    return response[1];
  });
  return (
    <PageLayout title="Doctors">
      <NewDoctor />
      <Space h="md" />
      <Box>
        {listDoctorsQuery.isLoading ? (
          <Center style={{ width: "100%", height: "513px" }}>
            <Loader variant="dots" />
          </Center>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listDoctorsQuery.data.map((doctor) => (
                <tr key={doctor.id}>
                  <td>{doctor.name}</td>
                  <td>{doctor.phone}</td>
                  <td>{doctor.email}</td>
                  <td>
                    <Group spacing={"xs"}>
                      <ActionIcon
                        color={"blue"}
                        component={Link}
                        href={`/doctors/${doctor.id}/edit`}
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
        )}
      </Box>
    </PageLayout>
  );
};
export default Doctors;
