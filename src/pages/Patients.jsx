import { useState } from "react";

import {
  Table,
  Box,
  Center,
  Pagination,
  Group,
  ActionIcon,
  Space,
  TextInput,
  Select,
  Loader,
  Text,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { Link } from "raviger";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Trash, Pencil, Check } from "tabler-icons-react";

import { deletePatient, listPatients } from "../api/api";
import NewPatient from "../components/buttons/NewPatient";
import PageLayout from "../components/PageLayout";
import { omit } from "../helpers/utils";

const Patients = () => {
  const [limit, setLimit] = useState("10");
  const [page, setPage] = useState(1);
  const [limitOptions, setLimitOptions] = useState(["10", "25", "50", "100"]);
  const [search, setSearch] = useState("");
  const [name] = useDebouncedValue(search, 500);
  const queryClient = useQueryClient();
  const modals = useModals();
  const { data, isLoading } = useQuery(
    ["listPatients", { limit, page, name }],
    async () => {
      const response = await listPatients(
        omit({
          limit: parseInt(limit),
          page,
          name,
        })
      );
      return response[1];
    },
    {
      keepPreviousData: true,
    }
  );
  const deletePatientMutation = useMutation(
    async (id) => {
      await deletePatient({ id });
    },
    {
      onSuccess: () => {
        showNotification({
          message: "Patient deleted successfully",
          title: "Success",
          color: "green",
          icon: <Check />,
        });
        queryClient.invalidateQueries("listPatients");
      },
    }
  );
  const openConfirmModal = (patient) =>
    modals.openConfirmModal({
      title: `Are you sure you want to delete ${patient.name}`,
      children: (
        <Text size="sm">
          This action cannot be undone. This will permanently delete all data
          associated with this patient.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => deletePatientMutation.mutate(patient.id),
    });
  return (
    <PageLayout title="Patients">
      <NewPatient mb={20} />
      <Group align={"end"}>
        <Box sx={{ width: "100px" }}>
          <Select
            data={limitOptions}
            value={limit}
            label="Rows"
            onChange={setLimit}
            creatable
            searchable
            getCreateLabel={(query) => `+ Create ${query}`}
            onCreate={(value) => {
              setLimitOptions(
                [...limitOptions, value].sort(
                  (a, b) => parseInt(a) - parseInt(b)
                )
              );
              setLimit(value);
            }}
          />
        </Box>
        <TextInput
          placeholder="Search"
          value={search}
          onChange={(e) => {
            setSearch(e.currentTarget.value);
          }}
        />
      </Group>
      <Space h={"md"} />
      <Box mt={20}>
        {isLoading ? (
          <Center style={{ width: "100%", height: "400px" }}>
            <Loader variant="dots" />
          </Center>
        ) : (
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
              {data?.data &&
                data.data.map((patient) => (
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
                        <ActionIcon
                          color={"red"}
                          onClick={() => {
                            openConfirmModal(patient);
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
        <Space h="md" />
        <Center>
          <Pagination page={page} total={data?.totalPages} onChange={setPage} />
        </Center>
      </Box>
    </PageLayout>
  );
};
export default Patients;
