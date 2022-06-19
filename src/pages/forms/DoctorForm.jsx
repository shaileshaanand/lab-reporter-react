import { LoadingOverlay } from "@mantine/core";
import { TextInput } from "@mantine/core";
import { Button } from "@mantine/core";
import { Group } from "@mantine/core";
import { Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useQuery } from "react-query";
import { useMutation } from "react-query";
import { Check } from "tabler-icons-react";

import { getDoctor, newDoctor, updateDoctor } from "../../api/api";
import PageLayout from "../../components/PageLayout";
import { omit } from "../../helpers/utils";

const DoctorForm = ({ id }) => {
  const form = useForm({
    initialValues: {
      name: "",
      phone: "",
      email: "",
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
          return "Phone must be 10 digits";
        }
        return null;
      },
      email: (value) => {
        if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
          return "Invalid email address";
        }
        return null;
      },
    },
  });

  const newDoctorMutation = useMutation(
    async (data) => {
      const response = await newDoctor(omit(data));
      return response[1];
    },
    {
      onSuccess: () => {
        form.reset();
        showNotification({
          message: "Doctor created successfully",
          title: "Success",
          color: "green",
          icon: <Check />,
        });
      },
    }
  );

  const updateDoctorMutation = useMutation(
    async (data) => {
      const response = await updateDoctor(omit(data), { id });
      return response[1];
    },
    {
      onSuccess: (data) => {
        data.id &&
          showNotification({
            message: "Doctor updated successfully",
            title: "Success",
            color: "green",
            icon: <Check />,
          });
      },
    }
  );

  const getDoctorQuery = useQuery(
    ["getDoctor", id],
    async () => {
      const response = await getDoctor({ id });
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
      onSuccess: (patient) => {
        form.setValues(patient);
      },
    }
  );
  return (
    <PageLayout title={id ? "Update Doctor" : "New Doctor"} backButton>
      <Box
        sx={(theme) => ({
          maxWidth: theme.breakpoints.sm,
          position: "relative",
        })}
      >
        <LoadingOverlay
          visible={
            id
              ? getDoctorQuery.isFetching || updateDoctorMutation.isLoading
              : newDoctorMutation.isLoading
          }
        />
        <form
          onSubmit={form.onSubmit(() => {
            id
              ? updateDoctorMutation.mutate(form.values)
              : newDoctorMutation.mutate(form.values);
          })}
        >
          <Group grow>
            <TextInput
              label="Name"
              name="name"
              {...form.getInputProps("name")}
            />
            <TextInput
              label="Phone"
              name="phone"
              {...form.getInputProps("phone")}
            />
          </Group>
          <TextInput
            label="Email"
            name="email"
            {...form.getInputProps("email")}
          />
          <Group position="right">
            <Button mt={10} type="submit">
              {id ? "Update" : "Create"}
            </Button>
          </Group>
        </form>
      </Box>
    </PageLayout>
  );
};
export default DoctorForm;
