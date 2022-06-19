import { Button } from "@mantine/core";
import { SquarePlus } from "tabler-icons-react";
const NewReport = () => {
  return (
    <Button leftIcon={<SquarePlus size={35} />} size={"lg"} pl={12} pr={15}>
      New Report
    </Button>
  );
};
export default NewReport;
