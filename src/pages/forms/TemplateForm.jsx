import {
  LoadingOverlay,
  Select,
  TextInput,
  Button,
  Group,
  Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useQueryParams } from "raviger";
import { useMutation, useQuery } from "react-query";
import { Check } from "tabler-icons-react";

import {
  getTemplate,
  getUSGReport,
  listTemplates,
  newTemplate,
  updateTemplate,
} from "../../api/api";
import PageLayout from "../../components/PageLayout";
import { omit } from "../../helpers/utils";

const TemplateForm = ({ id }) => {
  const [{ template: reportTemplate }] = useQueryParams();
  const form = useForm({
    initialValues: {
      name: "",
      template: "",
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
    },
  });
  const newTemplateMutation = useMutation(
    async (data) => {
      const response = await newTemplate(omit(data));
      return response[1];
    },
    {
      onSuccess: (data) => {
        if (data.id) {
          form.reset();
          showNotification({
            message: "Template created successfully",
            title: "Success",
            color: "green",
            icon: <Check />,
          });
        }
      },
    }
  );

  const updateTemplateMutation = useMutation(
    async (data) => {
      const response = await updateTemplate(omit(data), { id });
      return response[1];
    },
    {
      onSuccess: (data) => {
        data.id &&
          showNotification({
            message: "Template updated successfully",
            title: "Success",
            color: "green",
            icon: <Check />,
          });
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
      select: (data) =>
        data.map((template) => ({
          label: template.name,
          value: template.id,
        })),
      refetchOnWindowFocus: false,
    }
  );

  const getTemplateQuery = useQuery(
    ["template", id],
    async () => {
      const response = await getTemplate({ id });
      return response[1];
    },
    {
      enabled: !!id,
      refetchOnWindowFocus: false,
      select: (template) => {
        delete template.id;
        delete template.createdAt;
        delete template.updatedAt;
        delete template.driveFileId;
        return template;
      },
      onSuccess: (template) => {
        form.setValues({ name: "", template: "", ...template });
      },
    }
  );

  const getUSGReportQuery = useQuery(
    ["getUSGReport", { reportTemplate }],
    async () => {
      const response = await getUSGReport({ id: reportTemplate });
      return response[1];
    },
    {
      enabled: !!reportTemplate,
      onSuccess: (data) => {
        if (data.id) {
          delete data.id;
        }
        console.log(data);
      },
    }
  );
  return (
    <PageLayout
      title={
        id
          ? "Update Template"
          : `New Template${
              reportTemplate
                ? ` from ${getUSGReportQuery.data?.partOfScan} (${
                    getUSGReportQuery.data?.patient?.name || ""
                  })`
                : ""
            }`
      }
      backButton
    >
      <form
        onSubmit={form.onSubmit(() => {
          id
            ? updateTemplateMutation.mutate(form.values)
            : newTemplateMutation.mutate(form.values);
        })}
      >
        <Box
          sx={{
            position: "relative",
          }}
        >
          <LoadingOverlay
            visible={
              !listTemplatesQuery.isFetching &&
              (id
                ? getTemplateQuery.isFetching ||
                  updateTemplateMutation.isLoading
                : newTemplateMutation.isLoading)
            }
          />
          <TextInput
            label="Name"
            name="name"
            required
            {...form.getInputProps("name")}
          />
          {reportTemplate
            ? null
            : !id &&
              listTemplatesQuery.data && (
                <Select
                  label="Template"
                  placeholder="Select template"
                  data={listTemplatesQuery.data}
                  {...form.getInputProps("template")}
                />
              )}
          <Group position="right">
            <Button type="submit" size={"lg"} mt={20}>
              {id ? "Update" : "Create"} Template
            </Button>
          </Group>
        </Box>
      </form>
    </PageLayout>
  );
};
export default TemplateForm;
