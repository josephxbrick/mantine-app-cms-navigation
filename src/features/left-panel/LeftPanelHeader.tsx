/*
 * File purpose: Header strip for the left navigation panel showing the active domain icon and title.
 *
 * Imports:
 * - Box, Group, Text from "@mantine/core" provides Mantine UI primitives, theme helpers, component types, or styling utilities used in this file.
 * - type { Icon } from "@tabler/icons-react" provides icon components or icon types used by the CMS navigation UI.
 * - type { ReactNode } from "react" provides React hooks, refs, component helpers, or React-only types used in this file.
 */
import { Box, Group, Text } from "@mantine/core";
import type { Icon } from "@tabler/icons-react";
import type { ReactNode } from "react";

type DisplayGroupProps = {
  children: ReactNode;
};

type LeftPanelHeaderProps = {
  title: string;
  icon: Icon;
};

function DisplayGroup({ children }: DisplayGroupProps) {
  return (
    <Box
      h={72}
      bg="asxIndigo.1"
      style={{
        flexShrink: 0,
        borderBottom:
          "1px solid var(--mantine-color-asxIndigo-3)",
      }}
    >
      <Group h="100%" gap={6} wrap="nowrap" px="lg">
        {children}
      </Group>
    </Box>
  );
}

type HeaderIconProps = {
  icon: Icon;
};

function HeaderIcon({ icon: Icon }: HeaderIconProps) {
  return (
    <Icon
      size={36}
      stroke={1.3}
      color="var(--mantine-color-asxGray-8)"
    />
  );
}

type TitleProps = {
  title: string;
};

function Title({ title }: TitleProps) {
  return (
    <Text
      fz={22}
      fw={400}
      c="asxGray.8"
      truncate
      style={{ textBoxTrim: "trim-both" }}
    >
      {title}
    </Text>
  );
}

export const LeftPanelHeader = ({
  title,
  icon,
}: LeftPanelHeaderProps) => {
  return (
    <DisplayGroup>
      <HeaderIcon icon={icon} />
      <Title title={title} />
    </DisplayGroup>
  );
};
