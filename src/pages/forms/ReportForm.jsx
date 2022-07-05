import { useState } from "react";

import { Select } from "@mantine/core";
import { Tabs, Box } from "@mantine/core";
import { Group } from "@mantine/core";
import { Space } from "@mantine/core";
import { Button } from "@mantine/core";
import { Title } from "@mantine/core";
import { TextInput } from "@mantine/core";
import { Divider } from "@mantine/core";
import { LoadingOverlay } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import RichTextEditor from "@mantine/rte";
import dayjs from "dayjs";
import { useQuery } from "react-query";
import { useMutation } from "react-query";
import { Check } from "tabler-icons-react";

import {
  getUSGReport,
  listDoctors,
  listTemplates,
  newUSGReport,
  updateUSGReport,
} from "../../api/api";
import PageLayout from "../../components/PageLayout";
import PatientSearchSelect from "../../components/patient/PatientSearchSelect";
import { omit } from "../../helpers/utils";
import PatientForm from "./PatientForm";

const ReportForm = ({ id }) => {
  const [patientId, setPatientId] = useState("");

  const [activeTab, setActiveTab] = useState(0);
  const [findingsId, setFindingsId] = useState(0);

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
            <PatientSearchSelect
              value={patientId}
              onChange={(value) => {
                setPatientId(value);
                form.setFieldValue("patient", value);
              }}
              label="Find Patient by Name"
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
