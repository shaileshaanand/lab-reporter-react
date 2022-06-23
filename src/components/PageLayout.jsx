import { Box, Title, Group } from "@mantine/core";

import BackButton from "./buttons/BackButton";

const PageLayout = ({ children, title, backButton = false }) => {
  return (
    <Box m={title ? 30 : 0}>
      {title && (
        <Title order={2} mb={20}>
          <Group>
            {backButton && <BackButton />}
            {title}
          </Group>
        </Title>
      )}
      {children}
    </Box>
  );
};
export default PageLayout;
