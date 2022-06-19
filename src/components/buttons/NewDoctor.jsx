import { SquarePlus } from "tabler-icons-react";
import { Button } from "@mantine/core";
import { Link } from "raviger";
const NewDoctor = () => {
  return (
    <Button
      leftIcon={<SquarePlus size={35} />}
      size={"lg"}
      pl={12}
      pr={15}
      component={Link}
      href="/doctors/new"
    >
      New Doctor
    </Button>
  );
};
export default NewDoctor;
