import { TextInput } from "@mantine/core";
import { Group } from "@mantine/core";
import { Radio } from "@mantine/core";
import { Button } from "@mantine/core";
import { RadioGroup } from "@mantine/core";
import { Overlay } from "@mantine/core";
import { NumberInput } from "@mantine/core";
import { Box, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { Check } from "tabler-icons-react";
import { getPatient, newPatient, updatePatient } from "../../api/api";
import { omit } from "../../helpers/utils";

const PatientForm = ({ id }) => {
  const form = useForm({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      age: 0,
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

  const newPatientQuery = useQuery(
    "newPatient",
    async () => {
      const response = await newPatient(omit(form.values));
      return response[1];
    },
    {
      enabled: false,
      onSuccess: (data) => {
        form.reset();
        console.log({ data });
        showNotification({
          message: "Patient created",
          title: "Success",
          color: "green",
          icon: <Check />,
        });
      },
    }
  );

  const updatePatientQuery = useQuery(
    "editPatient",
    async () => {
      const response = await updatePatient(omit(form.values), { id });

      return response[1];
    },
    {
      enabled: false,
      onSuccess: (data) => {
        console.log({ data });
        data.id &&
          showNotification({
            message: "Patient updated",
            title: "Success",
            color: "green",
            icon: <Check />,
          });
      },
    }
  );

  const getPatientQuery = useQuery(
    "getPatient",
    async () => {
      const response = await getPatient({ id });
      return response[1];
    },
    {
      enabled: false,
      select: (patient) => {
        delete patient.id;
        return patient;
      },
    }
  );

  useEffect(() => {
    if (id) {
      getPatientQuery.refetch().then(({ data }) => {
        form.setValues(data);
      });
    }
  }, []);

  return (
    <Box m={30}>
      <Title order={2} mb={20}>
        {id ? "Update Patient" : "New Patient"}
      </Title>
      <Box
        sx={(theme) => ({
          maxWidth: theme.breakpoints.sm,
          position: "relative",
        })}
      >
        {(newPatientQuery.isFetching || getPatientQuery.isFetching) && (
          <Overlay opacity={0.6} color="#000" zIndex={5} />
        )}
        <form
          onSubmit={form.onSubmit((values) => {
            console.log(values);
            id ? updatePatientQuery.refetch() : newPatientQuery.refetch();
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
    </Box>
  );
};
export default PatientForm;
