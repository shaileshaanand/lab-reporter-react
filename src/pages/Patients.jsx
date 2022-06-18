import { Table } from "@mantine/core";
import { Box } from "@mantine/core";
import { Center } from "@mantine/core";
import { Pagination } from "@mantine/core";
import { Group } from "@mantine/core";
import { ActionIcon } from "@mantine/core";
import { Space } from "@mantine/core";
import { TextInput } from "@mantine/core";
import { Select } from "@mantine/core";
import { Title } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { Link } from "raviger";
import { useState } from "react";
import { useQuery } from "react-query";
import { Trash } from "tabler-icons-react";
import { Pencil } from "tabler-icons-react";
import { listPatients } from "../api/api";
import NewPatient from "../components/buttons/NewPatient";
import { omit } from "../helpers/utils";

const Patients = () => {
  const [limit, setLimit] = useState("10");
  const [page, setPage] = useState(1);
  const [limitOptions, setLimitOptions] = useState(["10", "25", "50", "100"]);
  const [search, setSearch] = useState("");
  const [name] = useDebouncedValue(search, 500);
  const { data } = useQuery(
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
  return (
    <Box m={30}>
      <Title order={2} mb={20}>
        Patients
      </Title>
      <NewPatient mb={20} />
      <Group align={"end"}>
        <Box sx={(theme) => ({ width: "100px" })}>
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
                      <ActionIcon color={"red"}>
                        <Trash />
                      </ActionIcon>
                    </Group>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
        <Space h="md" />
        <Center>
          <Pagination page={page} total={data?.totalPages} onChange={setPage} />
        </Center>
      </Box>
    </Box>
  );
};
export default Patients;
