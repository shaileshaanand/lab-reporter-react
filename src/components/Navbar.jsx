import React from "react";

import {
  Navbar,
  createStyles,
  Button,
  Title,
  Center,
  Divider,
  Space,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { ActiveLink } from "raviger";
import { useQuery } from "react-query";
import {
  Logout,
  Home2,
  BrandGoogle,
  ReportMedical,
  Users,
  Stethoscope,
  DeviceAnalytics,
  Template,
} from "tabler-icons-react";

import { getGoogleLoginLink } from "../api/api";

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef("icon");

  return {
    navbar: {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
      "@media print": {
        display: "none",
      },
    },

    title: {
      textTransform: "uppercase",
      letterSpacing: -0.25,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      fontSize: theme.fontSizes.sm,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[1]
          : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[7]
            : theme.colors.gray[0],
        color: theme.colorScheme === "dark" ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === "dark" ? theme.white : theme.black,
        },
      },
    },

    linkIcon: {
      ref: icon,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[2]
          : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
    },

    linkActive: {
      "&, &:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
            : theme.colors[theme.primaryColor][0],
        color:
          theme.colors[theme.primaryColor][
            theme.colorScheme === "dark" ? 4 : 7
          ],
        [`& .${icon}`]: {
          color:
            theme.colors[theme.primaryColor][
              theme.colorScheme === "dark" ? 4 : 7
            ],
        },
      },
    },

    footer: {
      borderTop: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[3]
      }`,
      paddingTop: theme.spacing.md,
    },
  };
});

const tabs = [
  { link: "/", label: "Home", icon: Home2 },
  { link: "/reports", label: "Reports", icon: ReportMedical },
  { link: "/patients", label: "Patients", icon: Users },
  { link: "/doctors", label: "Doctors", icon: Stethoscope },
  { link: "/templates", label: "Templates", icon: Template },
  { link: "/analytics", label: "Analytics", icon: DeviceAnalytics },
];

export default function NavbarSegmented() {
  const { classes, cx } = useStyles();

  const googleLoginLinkQuery = useQuery(
    ["googleLoginLink"],
    async () => {
      const response = await getGoogleLoginLink({
        callbackUrl: window.location.origin + "/oauth-callback",
      });
      console.log(response);
      return response[1];
    },
    {
      refetchOnWindowFocus: false,
      select: (data) => data.googleLoginUrl,
    }
  );

  const [_, setToken] = useLocalStorage({ key: "token" });
  const links = tabs.map((item) => (
    <ActiveLink
      className={cx(classes.link)}
      activeClass={item.link !== "/" ? classes.linkActive : null}
      exactActiveClass={item.link === "/" ? classes.linkActive : null}
      href={item.link}
      key={item.label}
    >
      <item.icon className={classes.linkIcon} />
      <span>{item.label}</span>
    </ActiveLink>
  ));

  return (
    <Navbar width={{ sm: 300 }} p="md" className={classes.navbar}>
      <Navbar.Section>
        <Center mb={20}>
          <Title order={1}>Lab Reporter</Title>
        </Center>
        <Divider />
      </Navbar.Section>

      <Navbar.Section grow mt="xl">
        {links}
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        <Center>
          <Button
            component="a"
            target="_blank"
            rel="noopener noreferrer"
            href={googleLoginLinkQuery.data}
            leftIcon={<BrandGoogle size={18} />}
            styles={(theme) => ({
              root: {
                backgroundColor: "#4c8bf5",
                border: 0,
                height: 42,
                paddingLeft: 20,
                paddingRight: 20,

                "&:hover": {
                  backgroundColor: theme.fn.darken("#4c8bf5", 0.05),
                },
              },

              leftIcon: {
                marginRight: 15,
              },
            })}
          >
            Link Google Drive
          </Button>
        </Center>
        <Space h="xl" />
        {/* eslint-disable-next-line */}
        <a
          href="#"
          className={classes.link}
          onClick={(event) => {
            event.preventDefault();
            setToken(null);
          }}
        >
          <Logout className={classes.linkIcon} />
          <span>Logout</span>
        </a>
      </Navbar.Section>
    </Navbar>
  );
}
