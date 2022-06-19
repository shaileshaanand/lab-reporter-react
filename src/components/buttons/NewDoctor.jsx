import { Button } from "@mantine/core";
import { Link } from "raviger";
import { SquarePlus } from "tabler-icons-react";
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
