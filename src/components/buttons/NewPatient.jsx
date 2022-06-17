import { SquarePlus } from "tabler-icons-react";
import { Button } from "@mantine/core";
import { Link } from "raviger";
const NewPatient = () => {
  return (
    <Button
      leftIcon={<SquarePlus size={35} />}
      size={"lg"}
      pl={12}
      pr={15}
      component={Link}
      href="/patients/new"
    >
      New Patient
    </Button>
  );
};
export default NewPatient;
