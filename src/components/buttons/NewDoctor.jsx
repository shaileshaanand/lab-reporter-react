import { SquarePlus } from "tabler-icons-react";
import { Button } from "@mantine/core";
const NewDoctor = () => {
  return (
    <Button leftIcon={<SquarePlus size={35} />} size={"lg"} pl={12} pr={15}>
      New Doctor
    </Button>
  );
};
export default NewDoctor;
