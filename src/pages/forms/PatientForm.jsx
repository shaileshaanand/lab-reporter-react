import { TextInput } from "@mantine/core";
import { Group } from "@mantine/core";
import { Radio } from "@mantine/core";
import { LoadingOverlay } from "@mantine/core";
import { Button } from "@mantine/core";
import { RadioGroup } from "@mantine/core";
import { NumberInput } from "@mantine/core";
import { Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useMutation } from "react-query";
import { useQuery } from "react-query";
import { Check } from "tabler-icons-react";

import { getPatient, newPatient, updatePatient } from "../../api/api";
import PageLayout from "../../components/PageLayout";
import { omit } from "../../helpers/utils";

const PatientForm = ({ id, embedded = false, onCreate }) => {
  const form = useForm({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      age: 1,
      gender: "male",
    },
    validate: {
      name: (value) => {
        if (!value) {
          return "Name is required";
        } else if (value.length < 3) {
          return "Name must be at least 3 characters";
        }
        return null;
      },
      phone: (value) => {
        if (value && value.match(/^\d{10}$/) === null) {
          return "Phone must be at least 10 characters";
        }
        return null;
      },
      email: (value) => {
        if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
          return "Invalid email address";
        }
        return null;
      },
      age: (value) => {
        if (!value) {
          return "Age is required";
        } else if (value < 1 || value > 120) {
          return "Age must be between 1 and 120";
        }
        return null;
      },
      gender: (value) => {
        if (!value) {
          return "Gender is required";
        }
        return null;
      },
    },
  });

  const newPatientMutation = useMutation(
    async (data) => {
      const response = await newPatient(omit(data));
      return response[1];
    },
    {
      onSuccess: (data) => {
        !embedded && form.reset();
        showNotification({
          message: "Patient created",
          title: "Success",
          color: "green",
          icon: <Check />,
        });
        if (onCreate) {
          onCreate(data.id);
        }
      },
    }
  );

  const updatePatientMutation = useMutation(
    async (data) => {
      const response = await updatePatient(omit(data), { id });
      return response[1];
    },
    {
      onSuccess: (data) => {
        data.id &&
          showNotification({
            message: "Patient updated",
            title: "Success",
            color: "green",
            icon: <Check />,
          });
        if (onCreate) {
          onCreate(data.id);
        }
      },
    }
  );

  const getPatientQuery = useQuery(
    ["getPatient", id],
    async () => {
      const response = await getPatient({ id });
      return response[1];
    },
    {
      enabled: !!id,
      select: (patient) => {
        delete patient.id;
        delete patient.createdAt;
        delete patient.updatedAt;
        return patient;
      },
      onSuccess: (data) => {
        form.setValues(data);
      },
    }
  );

  // useEffect(() => {
  //   if (id) {
  //     getPatientQuery.refetch().then(({ data }) => {
  //       form.setValues(data);
  //     });
  //   }
  // }, []);

  return (
    <PageLayout
      title={embedded ? null : id ? "Update Patient" : "New Patient"}
      backButton={!embedded}
    >
      <Box
        sx={(theme) => ({
          maxWidth: theme.breakpoints.sm,
          position: "relative",
        })}
      >
        <LoadingOverlay
          visible={
            id
              ? getPatientQuery.isFetching || updatePatientMutation.isLoading
              : newPatientMutation.isLoading
          }
        />
        <form
          onSubmit={form.onSubmit(() => {
            id
              ? updatePatientMutation.mutate(form.values)
              : newPatientMutation.mutate(form.values);
          })}
        >
          <Group grow>
            <TextInput
              placeholder="Full Name"
              label="Name"
              required
              {...form.getInputProps("name")}
            />
            <NumberInput
              defaultValue={0}
              min={1}
              max={120}
              label="Age"
              required
              {...form.getInputProps("age")}
            />
          </Group>
          <Group grow>
            <TextInput
              placeholder="Phone"
              label="Phone"
              required
              {...form.getInputProps("phone")}
            />
            <TextInput
              placeholder="Email"
              label="Email"
              {...form.getInputProps("email")}
            />
          </Group>
          <RadioGroup label="Gender" required {...form.getInputProps("gender")}>
            <Radio value="male" label="Male" />
            <Radio value="female" label="Female" />
          </RadioGroup>
          <Group position="right">
            <Button type="submit" mt={10}>
              {id ? "Update" : "Create"}
            </Button>
          </Group>
        </form>
      </Box>
    </PageLayout>
  );
};
export default PatientForm;
