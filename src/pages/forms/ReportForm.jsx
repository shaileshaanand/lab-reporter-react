import { useState } from "react";

import {
  Select,
  Tabs,
  Box,
  Group,
  Space,
  Button,
  Title,
  TextInput,
  Divider,
  LoadingOverlay,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import dayjs from "dayjs";
import { useQuery, useMutation } from "react-query";
import { Check } from "tabler-icons-react";

import {
  getUSGReport,
  listTemplates,
  newUSGReport,
  updateUSGReport,
} from "../../api/api";
import DoctorSelect from "../../components/doctor/DoctorSelect";
import PageLayout from "../../components/PageLayout";
import PatientSearchSelect from "../../components/patient/PatientSearchSelect";
import { omit } from "../../helpers/utils";
import PatientForm from "./PatientForm";

const ReportForm = ({ id }) => {
  const [patientId, setPatientId] = useState("");

  const [activeTab, setActiveTab] = useState(0);
  // const [findingsId, setFindingsId] = useState(0);

  const form = useForm({
    initialValues: {
      patient: "",
      referrer: "",
      date: dayjs().toDate(),
      template: "",
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
      partOfScan: (value) => {
        if (!value) {
          return "Part of scan is required";
        }
        return null;
      },
      template: (value) => {
        if (!value) {
          return "Template is required";
        }
        return null;
      },
    },
  });

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
          value: template.id,
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
                <DoctorSelect
                  label="Referrer"
                  name="referrer"
                  {...form.getInputProps("referrer")}
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

            <Select
              label="Template"
              data={listTemplatesQuery.data}
              placeholder="Choose Template"
              onChange={(template) => {
                form.setFieldValue("template", template);
              }}
            />
            <Space h="md" />
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
