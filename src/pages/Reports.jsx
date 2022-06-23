import { useState } from "react";

import { Box, Table } from "@mantine/core";
import { ActionIcon } from "@mantine/core";
import { Group } from "@mantine/core";
import { Select } from "@mantine/core";
import { Center } from "@mantine/core";
import { Loader } from "@mantine/core";
import { Space } from "@mantine/core";
import { Pagination } from "@mantine/core";
import dayjs from "dayjs";
import { Link } from "raviger";
import { useQuery } from "react-query";
import { Printer } from "tabler-icons-react";
import { Pencil } from "tabler-icons-react";
import { Trash } from "tabler-icons-react";

import { listUSGReports } from "../api/api";
import NewReport from "../components/buttons/NewReport";
import PageLayout from "../components/PageLayout";

const Reports = () => {
  const [limit, setLimit] = useState("10");
  const [page, setPage] = useState(1);
  const [limitOptions, setLimitOptions] = useState(["10", "25", "50", "100"]);
  const reports = useQuery(
    ["reports", { page, limit }],
    async () => {
      const response = await listUSGReports({ page, limit });
      return response[1];
    },
    {
      keepPreviousData: true,
    }
  );
  return (
    <PageLayout title="Reports">
      <NewReport />
      <Space h={"md"} />
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
      </Group>
      <Box mt={20}>
        {reports.isLoading ? (
          <Center style={{ width: "100%", height: "400px" }}>
            <Loader variant="dots" />
          </Center>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Referrer</th>
                <th>Part of Scan</th>
                <th>Date</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.data.data.map((report) => (
                <tr key={report.id}>
                  <td>{report.patient.name}</td>
                  <td>{report.referrer.name}</td>
                  <td>{report.partOfScan}</td>
                  <td>{dayjs(report.date).format("DD MMM, YYYY")}</td>
                  <td>
                    {dayjs(report.updatedAt).format("DD MMM, YYYY - h:m A")}
                  </td>
                  <td>
                    <Group spacing={"xs"}>
                      <ActionIcon
                        color={"blue"}
                        component={Link}
                        href={`/reports/${report.id}`}
                      >
                        <Printer />
                      </ActionIcon>
                      <ActionIcon
                        color={"blue"}
                        component={Link}
                        href={`/reports/${report.id}/edit`}
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
        <Space h="md" />
        <Center>
          <Pagination
            page={page}
            total={reports.data?.totalPages}
            onChange={setPage}
          />
        </Center>
      </Box>
    </PageLayout>
  );
};
export default Reports;
