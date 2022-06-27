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
          <Loader variant="dots" />
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

          <Grid columns={12}>
            <Grid.Col span={6}>
              <Group position="left" grow>
                <Text size={"lg"} weight={"bold"}>
                  Name of Patient
                </Text>
                <Text
                  size={"lg"}
                  weight={"bold"}
                  className="header__key_before"
                >
                  {data.patient.name}
                </Text>
              </Group>
            </Grid.Col>
            <Grid.Col span={4} offset={2}>
              <Group position="right">
                <Text weight={"bold"} className="header__key_after">
                  Date
                </Text>
                <Text weight={"bold"}>
                  {dayjs(data.date).format("DD/MM/YYYY")}
                </Text>
              </Group>
            </Grid.Col>
            <Grid.Col span={3}>
              <Group position="left" grow>
                <Text weight={"bold"}>Referred By</Text>
              </Group>
            </Grid.Col>
            <Grid.Col span={9}>
              <Group position="left" grow>
                <Text weight={"bold"} className="header__key_before">
                  {data.referrer.name}
                </Text>
              </Group>
            </Grid.Col>
            <Grid.Col span={6}>
              <Group position="left" grow>
                <Text weight={"bold"}>Region Examined</Text>
                <Text weight={"bold"} className="header__key_before">
                  {data.partOfScan}
                </Text>
              </Group>
            </Grid.Col>
            <Grid.Col span={3}>
              <Group position="center">
                <Text weight={"bold"} className="header__key_after">
                  Age
                </Text>
                <Text weight={"bold"}>
                  {data.patient.age} {data.patient.age === 1 ? "Year" : "Years"}
                </Text>
              </Group>
            </Grid.Col>
            <Grid.Col span={3}>
              <Group position="right">
                <Text weight={"bold"} className="header__key_after">
                  Sex
                </Text>
                <Text weight={"bold"}>{capitalize(data.patient.gender)}</Text>
              </Group>
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
              <Text weight={"bold"}>ULTRASONOGRAPHY CENTRE</Text>
              <Center>
                <Text weight={"bold"}>CHHATTARPUR, PALAMU</Text>
              </Center>
            </Box>
          </Group>
        </Box>
      )}
    </Box>
  );
};
export default Report;
