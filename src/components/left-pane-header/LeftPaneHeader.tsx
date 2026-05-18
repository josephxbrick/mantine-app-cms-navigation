import { Box, Group, Text } from "@mantine/core";
import { IconSitemap } from "@tabler/icons-react";

export const LeftPaneHeader = () => {
  return (
    <Box
      h={40}
      px="sm"
      bg="white"
      style={{
        borderBottom: "1px solid var(--mantine-color-asxGray-3)",
      }}
    >
      <Group h="100%" gap={8} wrap="nowrap">
        <IconSitemap size={16} stroke={1.5} />

        <Text size="sm" fw={600} c="asxGray.8" truncate>
          Site
        </Text>
      </Group>
    </Box>
  );
};