/* eslint-disable import/order */
import { useState } from "react";
import { useForm } from "@mantine/form";

import PageLayout from "../../components/PageLayout";
import { Button } from "@mantine/core";
import { Group } from "@mantine/core";
import { Space } from "@mantine/core";
import { Tabs, Box } from "@mantine/core";
import { Select } from "@mantine/core";
import { useQuery } from "react-query";
import { useDebouncedValue } from "@mantine/hooks";
import {
  getUSGReport,
  listDoctors,
  listPatients,
  listTemplates,
  newUSGReport,
  updateUSGReport,
} from "../../api/api";
import { capitalize, omit } from "../../helpers/utils";
import { Text } from "@mantine/core";
import { forwardRef } from "react";
import PatientForm from "./PatientForm";
import { Title } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { TextInput } from "@mantine/core";
import RichTextEditor from "@mantine/rte";
import { useMutation } from "react-query";
import { showNotification } from "@mantine/notifications";
import { Check } from "tabler-icons-react";
import { Divider } from "@mantine/core";
import dayjs from "dayjs";
import { LoadingOverlay } from "@mantine/core";
const ReportForm = ({ id }) => {
  const [patientId, setPatientId] = useState("");

  const [patientNameSearchText, setPatientNameSearchText] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [findingsId, setFindingsId] = useState(0);

  const [patientDebouncedSearchText] = useDebouncedValue(
    patientNameSearchText,
    300
  );
  const form = useForm({
    initialValues: {
      patient: "",
      referrer: "",
      date: dayjs().toDate(),
      findings: "",
      partOfScan: "",
    },
    validate: {
      referrer: (value) => {
        if (!value) {
          return "Referrer is required";
        }
        return null;
      },
      date: (value) => {
        if (!value) {
          return "Date is required";
        }
        return null;
      },
      findings: (value) => {
        if (!value) {
          return "Findings is required";
        }
        return null;
      },
      partOfScan: (value) => {
        if (!value) {
          return "Part of scan is required";
        }
        return null;
      },
    },
  });

  const patients = useQuery(
    ["listPatients", { limit: 10, page: 1, patientDebouncedSearchText }],
    async () => {
      const response = await listPatients(
        omit({
          limit: 10,
          page: 1,
          name: patientDebouncedSearchText,
        })
      );
      return response[1];
    },
    {
      keepPreviousData: true,
      select: (response) => {
        return response.data?.map((patient) => ({
          label: patient.name,
          value: patient.id,
          description: `${patient.phone} | ${capitalize(patient.gender)} | ${
            patient.age
          } ${patient.age === 1 ? "Year" : "Years"} old `,
        }));
      },
    }
  );

  const SelectItem = forwardRef(({ label, description, ...others }, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <div>
          <Text size="sm">{label}</Text>
          <Text size="xs" color="dimmed">
            {description}
          </Text>
        </div>
      </Group>
    </div>
  ));

  const doctors = useQuery(
    ["listDoctors"],
    async () => {
      const response = await listDoctors();
      return response[1];
    },
    {
      keepPreviousData: true,
      select: (response) => {
        return response.map((doctor) => ({
          label: doctor.name,
          value: doctor.id,
        }));
      },
    }
  );

  const newUSGMutation = useMutation(
    async (data) => {
      const response = await newUSGReport(data);
      return response[1];
    },
    {
      onSuccess: (data) => {
        if (data.id) {
          form.reset();
          setPatientId("");
          showNotification({
            title: "USG Report created",
            icon: <Check />,
            color: "green",
            message: "You can view the report in the reports page",
          });
        }
      },
    }
  );

  const updateUSGMutation = useMutation(
    async (data) => {
      const response = await updateUSGReport(omit(data), { id });
      return response[1];
    },
    {
      onSuccess: (data) => {
        if (data.id) {
          form.reset();
          setPatientId("");
          showNotification({
            title: "USG Report updated",
            icon: <Check />,
            color: "green",
            message: "You can view the updated report in the reports page",
          });
        }
      },
    }
  );

  const getUSGReportQuery = useQuery(
    ["getUSGReport", { id }],
    async () => {
      const response = await getUSGReport({ id });
      return response[1];
    },
    {
      enabled: !!id,
      select: (response) => {
        delete response.createdAt;
        delete response.updatedAt;
        return {
          ...response,
          date: dayjs(response.date).toDate(),
          referrer: response.referrer?.id,
          patient: response.patient?.id,
        };
      },
      onSuccess: (data) => {
        if (data.id) {
          delete data.id;
          form.setValues(data);
          setPatientId(data.patient);
        }
      },
    }
  );

  const listTemplatesQuery = useQuery(
    ["listTemplates"],
    async () => {
      const response = await listTemplates();
      return response[1];
    },
    {
      select: (response) => {
        return response.map((template) => ({
          label: template.name,
          value: template.content,
        }));
      },
    }
  );
  return (
    <PageLayout title={id ? "Update Report" : "New Report"} backButton>
      <Box sx={{ position: "relative" }}>
        <LoadingOverlay
          visible={
            id
              ? getUSGReportQuery.isLoading || updateUSGMutation.isLoading
              : newUSGMutation.isLoading
          }
        />
        <Title order={5}>Patient</Title>
        <Tabs active={activeTab} onTabChange={setActiveTab}>
          <Tabs.Tab label="Existing">
            <Select
              label="Find Patient by Name"
              onChange={(value) => {
                setPatientId(value);
                form.setFieldValue("patient", value);
              }}
              value={patientId}
              data={patients.data || []}
              searchable={!id}
              clearable={!id}
              onSearchChange={setPatientNameSearchText}
              itemComponent={SelectItem}
              disabled={!!id}
            />
          </Tabs.Tab>
          {!id && (
            <Tabs.Tab label="New">
              <PatientForm
                embedded
                onCreate={(id) => {
                  setActiveTab(0);
                  setPatientId(id);
                  form.setFieldValue("patient", id);
                }}
                id={patientId}
              />
            </Tabs.Tab>
          )}
        </Tabs>
        {patientId && (
          <>
            <Space h="md" />
            <Divider />
            <Space h="md" />
            <Title order={5}>Report</Title>
            <form>
              <Group grow>
                <Select
                  label="Referrer"
                  name="referrer"
                  {...form.getInputProps("referrer")}
                  data={doctors.data || []}
                  required
                />
                <DatePicker
                  placeholder="Pick Date"
                  label="Date"
                  required
                  {...form.getInputProps("date")}
                />
              </Group>
              <Group grow>
                <TextInput
                  label="Part of Scan"
                  name="partOfScan"
                  {...form.getInputProps("partOfScan")}
                  required
                />
              </Group>
            </form>

            <Space h="md" />
            <Divider />
            <Space h="md" />
            <Group position={"apart"}>
              <Title order={5}>Findings</Title>
              <Select
                data={listTemplatesQuery.data}
                placeholder="Choose Template"
                onChange={(template) => {
                  form.setFieldValue("findings", template);
                  setFindingsId(findingsId + 1);
                }}
              />
            </Group>
            <Space h="md" />
            <RichTextEditor
              key={findingsId}
              {...form.getInputProps("findings")}
            />
          </>
        )}
      </Box>
      <Group position="right">
        <Button
          size={"lg"}
          mt={20}
          onClick={() => {
            id
              ? updateUSGMutation.mutate(form.values)
              : newUSGMutation.mutate(form.values);
          }}
        >
          {id ? "Update" : "Create"} Report
        </Button>
      </Group>
    </PageLayout>
  );
};
export default ReportForm;
