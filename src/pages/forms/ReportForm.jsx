/* eslint-disable import/order */
import { useState } from "react";

import { Stepper } from "@mantine/core";
import { useForm } from "@mantine/form";

import PageLayout from "../../components/PageLayout";
import { Button } from "@mantine/core";
import { Group } from "@mantine/core";
import { Space } from "@mantine/core";
import { Tabs } from "@mantine/core";
import { Select } from "@mantine/core";
import { useQuery } from "react-query";
import { useDebouncedValue } from "@mantine/hooks";
import { listDoctors, listPatients, newUSGReport } from "../../api/api";
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
const ReportForm = ({ id }) => {
  const [patientId, setPatientId] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const nextStep = () =>
    setActiveStep((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActiveStep((current) => (current > 0 ? current - 1 : current));

  const [patientNameSearchText, setPatientNameSearchText] = useState("t3x");

  const [patientDebouncedSearchText] = useDebouncedValue(
    patientNameSearchText,
    300
  );
  const form = useForm({
    initialValues: {
      patient: "",
      referrer: "",
      date: "",
      sonologist: "",
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
      sonologist: (value) => {
        if (!value) {
          return "Sonologist is required";
        }
        return null;
      },
      // findings: (value) => {
      //   if (!value) {
      //     return "Findings is required";
      //   }
      //   return null;
      // },
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

  const nextAllowed = () => {
    switch (activeStep) {
      case 0:
        return !!patientId;
      case 1:
        return true;
      default:
        return false;
    }
  };

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
        setActiveStep(0);
        form.reset();
        data.id &&
          showNotification({
            title: "USG Report created",
            icon: <Check />,
            color: "green",
            message: "You can view the report in the reports page",
          });
      },
    }
  );

  return (
    <PageLayout title={id ? "Update Report" : "New Report"} backButton>
      <Stepper active={activeStep} breakpoint={"sm"}>
        <Stepper.Step label="Patient" description={"Choose or Create Patient"}>
          <Title order={5}>Patient</Title>
          <Tabs>
            <Tabs.Tab label="Existing">
              <Select
                label="Find Patient by Name"
                onChange={(value) => {
                  setPatientId(value);
                  form.setFieldValue("patient", value);
                }}
                value={patientId}
                data={patients.data || []}
                searchable
                onSearchChange={setPatientNameSearchText}
                itemComponent={SelectItem}
              />
            </Tabs.Tab>
            <Tabs.Tab label="New">
              <PatientForm
                embedded
                onCreate={(id) => {
                  setPatientId(id);
                }}
              />
            </Tabs.Tab>
          </Tabs>
        </Stepper.Step>
        <Stepper.Step label="Report" description={"Report Header"}>
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
              <Select
                label="Sonologist"
                name="sonologist"
                {...form.getInputProps("sonologist")}
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
        </Stepper.Step>
        <Stepper.Step label="Findings" description={"Build Report"}>
          <Title order={5}>Findings</Title>
          <RichTextEditor {...form.getInputProps("findings")} />
          <Group position="right">
            <Button
              size={"lg"}
              mt={20}
              onClick={() => {
                newUSGMutation.mutate(form.values);
              }}
            >
              Create Report
            </Button>
          </Group>
        </Stepper.Step>
      </Stepper>
      <Space h={"md"} />
      <Group position="center">
        <Button onClick={prevStep} disabled={activeStep === 0}>
          Previous
        </Button>
        <Button onClick={nextStep} disabled={!nextAllowed()}>
          Next
        </Button>
      </Group>
    </PageLayout>
  );
};
export default ReportForm;
