import { ActionIcon } from "@mantine/core";
import { ChevronLeft } from "tabler-icons-react";

const BackButton = () => {
  return (
    <ActionIcon size={"xl"} onClick={() => history.back()}>
      <ChevronLeft size={40} />
    </ActionIcon>
  );
};
export default BackButton;
