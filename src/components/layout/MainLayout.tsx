import { Box, Group } from "@mantine/core";

import { LeftPalette } from "../left-palette/LeftPalette";
import { SiteTree } from "../site-tree/SiteTree";

export const MainLayout = () => {
  return (
    <Group h="100vh" gap={0} align="stretch" wrap="nowrap">
      <LeftPalette />

      <Box
        w={280}
        bg="white"
        style={{
          borderRight: "1px solid var(--mantine-color-asxGray-3)",
        }}
      >
        <SiteTree />
      </Box>

      <Box flex={1} bg="asxGray.0">
        {/* Existing app content / toolbar area goes here */}
      </Box>
    </Group>
  );
};