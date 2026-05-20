/*
 * Left panel header.
 * - Displays the active tree title and sitemap icon.
 * - Provides the fixed header band above the palette and tree browser.
 */
import { Box, Group, Text } from "@mantine/core";
import { IconSitemap } from "@tabler/icons-react";
import type { ReactNode } from "react";

type DisplayGroupProps = {
  children: ReactNode;
};

type LeftPanelHeaderProps = {
  title: string;
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
      <Group h="100%" gap={12} wrap="nowrap" px="lg">
        {children}
      </Group>
    </Box>
  );
}

function SiteTreeIcon() {
  return (
    <IconSitemap
      size={28}
      stroke={1.5}
      color="var(--mantine-color-asxIndigo-9)"
    />
  );
}

function Title({ title }: LeftPanelHeaderProps) {
  return (
    <Text size="lg" fw={600} c="asxIndigo.9" truncate>
      {title}
    </Text>
  );
}

export const LeftPanelHeader = ({
  title,
}: LeftPanelHeaderProps) => {
  return (
    <DisplayGroup>
      <SiteTreeIcon />
      <Title title={title} />
    </DisplayGroup>
  );
};
