import { useState } from "react";

import { Box, Table } from "@mantine/core";
import { ActionIcon } from "@mantine/core";
import { Group } from "@mantine/core";
import { Center } from "@mantine/core";
import { Loader } from "@mantine/core";
import { Space } from "@mantine/core";
import { Pagination } from "@mantine/core";
import { Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import dayjs from "dayjs";
import { Link } from "raviger";
import { useQuery } from "react-query";
import { useQueryClient } from "react-query";
import { useMutation } from "react-query";
import { Printer } from "tabler-icons-react";
import { Pencil } from "tabler-icons-react";
import { Trash } from "tabler-icons-react";
import { Check } from "tabler-icons-react";
import { DeviceFloppy } from "tabler-icons-react";

import { deleteUSGReport, listUSGReports } from "../api/api";
import NewReport from "../components/buttons/NewReport";
import PageLayout from "../components/PageLayout";
import RowsCountSelector from "../components/RowsCountSelector";

const Reports = () => {
  const [limit, setLimit] = useState("10");
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const modals = useModals();
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
  const deleteUSGReportMutation = useMutation(
    async (id) => {
      await deleteUSGReport({ id });
    },
    {
      onSuccess: () => {
        showNotification({
          message: "Report deleted successfully",
          title: "Success",
          color: "green",
          icon: <Check />,
        });
        queryClient.invalidateQueries("reports");
      },
    }
  );
  const openConfirmModal = (USGReport) =>
    modals.openConfirmModal({
      title: `Are you sure you want to delete the report for ${USGReport.patient.name}`,
      children: (
        <Text size="sm">
          This action cannot be undone. This will permanently delete all data
          associated with this patient.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => deleteUSGReportMutation.mutate(USGReport.id),
    });
  return (
    <PageLayout title="Reports">
      <NewReport />
      <Space h={"md"} />
      <Group align={"end"}>
        <Box sx={{ width: "100px" }}>
          <RowsCountSelector value={limit} onChange={setLimit} />
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
                    {dayjs(report.updatedAt).format("DD MMM, YYYY - h:mm A")}
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
                      <ActionIcon
                        color={"red"}
                        onClick={() => openConfirmModal(report)}
                      >
                        <Trash />
                      </ActionIcon>
                      <ActionIcon
                        color={"green"}
                        component={Link}
                        href={`/templates/new?content=${encodeURIComponent(
                          report.findings
                        )}`}
                      >
                        <DeviceFloppy />
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
