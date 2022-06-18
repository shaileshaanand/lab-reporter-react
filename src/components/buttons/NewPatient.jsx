import { SquarePlus } from "tabler-icons-react";
import { Button } from "@mantine/core";
import { Link } from "raviger";
const NewPatient = (props) => {
  return (
    <Button
      leftIcon={<SquarePlus size={35} />}
      size={"lg"}
      pl={12}
      pr={15}
      component={Link}
      href="/patients/new"
      {...props}
    >
      New Patient
    </Button>
  );
};
export default NewPatient;
