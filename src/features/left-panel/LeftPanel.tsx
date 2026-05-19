import { Box } from "@mantine/core";

import { LeftPanelHeader } from "./LeftPanelHeader";
import { LeftPalette } from "./palette/LeftPalette";
import { SiteTree } from "./site-tree/SiteTree";

type LeftPanelProps = {
  width: number;
};

export function LeftPanel({ width }: LeftPanelProps) {
  return (
    <Box
      w={width}
      bg="white"
      pos="relative"
      style={{
        borderRight: "1px solid var(--mantine-color-gray-3)",
      }}
    >
      <LeftPanelHeader />

      <Box
        h="calc(100% - 40px)"
        pl={88}
        style={{
          overflow: "hidden",
        }}
      >
        <SiteTree />
      </Box>

      <LeftPalette />
    </Box>
  );
}
