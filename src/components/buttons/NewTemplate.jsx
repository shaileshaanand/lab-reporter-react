import { Button } from "@mantine/core";
import { Link } from "raviger";
import { SquarePlus } from "tabler-icons-react";
const NewTemplate = () => {
  return (
    <Button
      leftIcon={<SquarePlus size={35} />}
      size={"lg"}
      pl={12}
      pr={15}
      component={Link}
      href="/templates/new"
    >
      New Template
    </Button>
  );
};
export default NewTemplate;
