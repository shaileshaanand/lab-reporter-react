import { useState } from "react";

import { Box, Table, Title } from "@mantine/core";
import { Group } from "@mantine/core";
import { Center } from "@mantine/core";
import { Loader } from "@mantine/core";
import { Space } from "@mantine/core";
import { Pagination } from "@mantine/core";
import { DateRangePicker } from "@mantine/dates";
import dayjs from "dayjs";
import { useQuery } from "react-query";

import { listUSGReports } from "../api/api";
import DoctorSelect from "../components/doctor/DoctorSelect";
import PageLayout from "../components/PageLayout";
import PatientSearchSelect from "../components/patient/PatientSearchSelect";
import RowsCountSelector from "../components/RowsCountSelector";
import { DEFAULT_PAGE_SIZE } from "../config/constants";
import { omit } from "../helpers/utils";

const Analytics = () => {
  const [dates, setDates] = useState([null, null]);
  const [patient, setPatient] = useState("");
  const [referrer, setReferrer] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const reports = useQuery(
    [
      "reports",
      {
        date_before: dates[0],
        date_after: dates[1],
        patient,
        referrer,
        page,
        limit,
      },
    ],
    async () => {
      const response = await listUSGReports(
        omit({
          date_before: dates[1] ? dayjs(dates[1]).toISOString() : null,
          date_after: dates[0] ? dayjs(dates[0]).toISOString() : null,
          patient,
          referrer,
          page,
          limit,
        })
      );
      return response[1];
    },
    {
      keepPreviousData: true,
    }
  );

  return (
    <PageLayout title={"Analytics"}>
      <Group grow>
        <DoctorSelect
          label="Filter by Referrer"
          value={referrer}
          onChange={setReferrer}
        />
        <PatientSearchSelect
          label="Filter by Patient"
          value={patient}
          onChange={setPatient}
        />
        <DateRangePicker
          label="Filter By Date"
          placeholder="Pick a date range"
          value={dates}
          onChange={setDates}
          allowSingleDateInRange={true}
        />
        <RowsCountSelector value={limit} onChange={setLimit} />
      </Group>

      <Box mt={20}>
        {reports.isLoading || reports.isFetching ? (
          <Center style={{ width: "100%", height: "400px" }}>
            <Loader variant="dots" />
          </Center>
        ) : (
          <>
            <Title order={3}>Total : {reports.data.total}</Title>
            <Space h={"md"} />
            <Table>
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Referrer</th>
                  <th>Part of Scan</th>
                  <th>Date</th>
                  <th>Last Updated</th>
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
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
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
export default Analytics;
