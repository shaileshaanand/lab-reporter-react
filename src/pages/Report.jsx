import { Button } from "@mantine/core";
import { Group } from "@mantine/core";
import { Center } from "@mantine/core";
import { Title } from "@mantine/core";
import { Loader, Box, Grid, Text } from "@mantine/core";
import RichTextEditor from "@mantine/rte";
import dayjs from "dayjs";
import { useQuery } from "react-query";
import { Printer } from "tabler-icons-react";

import { getUSGReport } from "../api/api";
import { capitalize } from "../helpers/utils";

const Report = ({ id }) => {
  const { data, isLoading } = useQuery(["report", { id }], async () => {
    const response = await getUSGReport({ id });
    return response[1];
  });

  return (
    <Box>
      {isLoading ? (
        <Center style={{ height: "500px" }}>
          <Loader variant="bars" />
        </Center>
      ) : (
        <Box m={10}>
          <Button
            size="lg"
            leftIcon={<Printer />}
            onClick={() => window.print()}
            sx={() => ({
              position: "absolute",
              right: "10px",
              top: "10px",
              "@media print": { display: "none" },
              zIndex: "5",
            })}
          >
            Print
          </Button>
          <Grid columns={10}>
            <Grid.Col span={6}>
              <table className="desctable">
                <tbody>
                  <tr>
                    <th>
                      <Text size="lg" weight={"bold"}>
                        Name of Patient
                      </Text>
                    </th>
                    <td>
                      <Text size="lg" weight={"bold"}>
                        {data.patient.name}
                      </Text>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <Text weight={"bold"}>Referred By</Text>
                    </th>
                    <td>{data.referrer.name}</td>
                  </tr>
                  <tr>
                    <th>
                      <Text weight={"bold"}>Region Examined</Text>
                    </th>
                    <td>{capitalize(data.patient.gender)}</td>
                  </tr>
                </tbody>
              </table>
            </Grid.Col>
            <Grid.Col span={4}>
              <table className="desctable">
                <tbody>
                  <tr>
                    <th>
                      <Text weight={"bold"}>Date</Text>
                    </th>
                    <td>{dayjs(data.date).format("DD/MM/YYYY")}</td>
                  </tr>
                  <tr>
                    <th>
                      <Text weight={"bold"}>Age</Text>
                    </th>
                    <td>
                      {data.patient.age}{" "}
                      {data.patient.age === 1 ? "Year" : "Years"}
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <Text weight={"bold"}>Sex</Text>
                    </th>
                    <td>{capitalize(data.patient.gender)}</td>
                  </tr>
                </tbody>
              </table>
            </Grid.Col>
          </Grid>
          <Center>
            <Title order={2} sx={{ textDecoration: "underline" }} my={15}>
              Report of Ultrasonography
            </Title>
          </Center>
          <RichTextEditor
            value={data.findings}
            readOnly
            styles={{
              root: {
                border: "0px",
              },
            }}
          />
          <Group position={"right"} mr={20} mb={40}>
            <Box>
              <Center>
                <Text weight={"bold"}>SONOLOGIST</Text>
              </Center>
              <Text weight={"bold"}>MAA LALITA HOSPITAL, CHHATTARPUR</Text>
            </Box>
          </Group>
        </Box>
      )}
    </Box>
  );
};
export default Report;
