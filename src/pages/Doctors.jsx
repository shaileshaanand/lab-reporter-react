import {
  Group,
  ActionIcon,
  Center,
  Loader,
  Space,
  Table,
  Box,
  Text,
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { Link } from "raviger";
import { useQueryClient, useQuery, useMutation } from "react-query";
import { Trash, Check, Pencil } from "tabler-icons-react";

import { deleteDoctor, listDoctors } from "../api/api";
import NewDoctor from "../components/buttons/NewDoctor";
import PageLayout from "../components/PageLayout";

const Doctors = () => {
  const queryClient = useQueryClient();
  const listDoctorsQuery = useQuery(["listDoctors"], async () => {
    const response = await listDoctors();
    return response[1];
  });

  const deleteDoctorMutation = useMutation(
    async (id) => {
      await deleteDoctor({ id });
    },
    {
      onSuccess: () => {
        showNotification({
          message: "Doctor deleted successfully",
          title: "Success",
          color: "green",
          icon: <Check />,
        });
        queryClient.invalidateQueries("listDoctors");
      },
    }
  );

  const modals = useModals();
  const openConfirmModal = (doctor) =>
    modals.openConfirmModal({
      title: `Are you sure you want to delete ${doctor.name}`,
      children: (
        <Text size="sm">
          This action cannot be undone. This will permanently delete all data
          associated with this doctor.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => deleteDoctorMutation.mutate(doctor.id),
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
                      <ActionIcon
                        color={"red"}
                        onClick={() => {
                          openConfirmModal(doctor);
                        }}
                      >
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
