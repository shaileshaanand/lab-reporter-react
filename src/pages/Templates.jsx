import {
  Space,
  Table,
  Group,
  Loader,
  Center,
  Box,
  ActionIcon,
  Text,
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { Link } from "raviger";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { Refresh, ArrowUpRight, Trash, Check } from "tabler-icons-react";

import { deleteTemplate, listTemplates, syncTemplate } from "../api/api";
import NewTemplate from "../components/buttons/NewTemplate";
import PageLayout from "../components/PageLayout";
const Templates = () => {
  const queryClient = useQueryClient();
  const listTemplatesQuery = useQuery(["listTemplates"], async () => {
    const response = await listTemplates();
    return response[1];
  });

  const deleteTemplateMutation = useMutation(
    async (id) => {
      await deleteTemplate({ id });
    },
    {
      onSuccess: () => {
        showNotification({
          message: "Template deleted successfully",
          title: "Success",
          color: "green",
          icon: <Check />,
        });
        queryClient.invalidateQueries("listTemplates");
      },
    }
  );
  const syncTemplateMutation = useMutation(
    async (id) => {
      await syncTemplate({ id });
    },
    {
      onSuccess: () => {
        showNotification({
          message: "Template synced successfully",
          title: "Success",
          color: "green",
          icon: <Check />,
        });
        queryClient.invalidateQueries("listTemplates");
      },
    }
  );
  const modals = useModals();
  const openConfirmModal = (template) =>
    modals.openConfirmModal({
      title: `Are you sure you want to delete ${template.name}`,
      children: (
        <Text size="sm">
          This action cannot be undone. This will permanently delete the
          template.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => deleteTemplateMutation.mutate(template.id),
    });
  return (
    <PageLayout title="Templates">
      <NewTemplate />
      <Space h="md" />
      <Box>
        {listTemplatesQuery.isLoading ? (
          <Center style={{ width: "100%", height: "513px" }}>
            <Loader variant="dots" />
          </Center>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listTemplatesQuery.data.map((template) => (
                <tr key={template.id}>
                  <td>{template.name}</td>
                  <td>
                    <Group spacing={"xs"}>
                      <ActionIcon
                        color={"green"}
                        component={Link}
                        href={`https://docs.google.com/document/d/${template.driveFileId}/edit`}
                        target="_blank"
                      >
                        <ArrowUpRight />
                      </ActionIcon>

                      <ActionIcon
                        color={"blue"}
                        onClick={() => {
                          syncTemplateMutation.mutate(template.id);
                        }}
                      >
                        <Refresh />
                      </ActionIcon>
                      <ActionIcon
                        color={"red"}
                        onClick={() => {
                          openConfirmModal(template);
                        }}
                      >
                        <Trash />
                      </ActionIcon>
                    </Group>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Box>
    </PageLayout>
  );
};
export default Templates;
