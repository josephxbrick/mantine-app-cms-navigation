import { Box } from "@mantine/core";

import { LeftPanelHeader } from "./LeftPanelHeader";
import { LeftPalette } from "./palette/LeftPalette";
import { SiteTree } from "./site-tree/SiteTree";

type LeftPanelProps = {
  width: number;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
};

export function LeftPanel({
  width,
  selectedNodeId,
  onSelectNode,
}: LeftPanelProps) {
  return (
    <Box
      w={width}
      bg="white"
      pos="relative"
      h="100%"
      style={{
        overflow: "hidden",
      }}
    >
      <Box
        h="100%"
        bg="white"
        style={{
          display: "flex",
          flexDirection: "column",
          minWidth: 348,
        }}
      >
        <LeftPanelHeader />

        <Box
          style={{
            display: "flex",
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          <Box
            w={88}
            h="100%"
            style={{
              position: "relative",
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            <LeftPalette />
          </Box>

          <Box
            h="100%"
            style={{
              flex: 1,
              minWidth: 260,
              overflow: "hidden",
            }}
          >
            <SiteTree
              selectedNodeId={selectedNodeId}
              onSelectNode={onSelectNode}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
