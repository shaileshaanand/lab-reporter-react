import { LoadingOverlay } from "@mantine/core";
import { TextInput } from "@mantine/core";
import { Button } from "@mantine/core";
import { Title } from "@mantine/core";
import { Space } from "@mantine/core";
import { Group } from "@mantine/core";
import { Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import RichTextEditor from "@mantine/rte";
import { useQueryParams } from "raviger";
import { useMutation, useQuery } from "react-query";
import { Check } from "tabler-icons-react";

import { getTemplate, newTemplate, updateTemplate } from "../../api/api";
import PageLayout from "../../components/PageLayout";
import { omit } from "../../helpers/utils";

const TemplateForm = ({ id }) => {
  const [{ content }] = useQueryParams();
  const form = useForm({
    initialValues: {
      name: "",
      content: content || "",
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

  const getTemplateQuery = useQuery(
    ["template", id],
    async () => {
      const response = await getTemplate({ id });
      return response[1];
    },
    {
      enabled: !!id,
      select: (template) => {
        delete template.id;
        delete template.createdAt;
        delete template.updatedAt;
        return template;
      },
      onSuccess: (template) => {
        form.setValues({ name: "", content: "", ...template });
      },
    }
  );
  return (
    <PageLayout title={id ? "Update Template" : "New Template"} backButton>
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
              id
                ? getTemplateQuery.isFetching ||
                  updateTemplateMutation.isLoading
                : newTemplateMutation.isLoading
            }
          />
          <TextInput
            label="Name"
            name="name"
            required
            {...form.getInputProps("name")}
          />
          <Space h="md" />
          <Title order={5}>Content</Title>
          <Space h="sm" />
          {((id && form.values.content) || !id) && (
            <RichTextEditor {...form.getInputProps("content")} />
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
