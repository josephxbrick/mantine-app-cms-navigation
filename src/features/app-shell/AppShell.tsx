import { useState } from "react";

import { Box, Flex } from "@mantine/core";

import { ContentWorkspace } from "../content-workspace/ContentWorkspace";
import { LeftPanel } from "../left-panel/LeftPanel";
import { ProductToolbar } from "../content-workspace/toolbars/ProductToolbar";
import { WorkspaceSplitter } from "./WorkspaceSplitter";

const LEFT_PANEL_INITIAL_WIDTH = 414;
const LEFT_PANEL_MIN_WIDTH = 348;

export function AppShell() {
  const [productToolbarMode, setProductToolbarMode] =
    useState<"default" | "search">("default");

  const [leftPaneWidth, setLeftPaneWidth] = useState(
    LEFT_PANEL_INITIAL_WIDTH
  );

  return (
    <Box
      h="100vh"
      bg="gray.0"
      style={{
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      <ProductToolbar
        mode={productToolbarMode}
        onGoTo={() => setProductToolbarMode("search")}
        onCloseSearch={() => setProductToolbarMode("default")}
      />

      <Flex h="calc(100vh - 64px)">
        <LeftPanel width={leftPaneWidth} />

        <WorkspaceSplitter
          value={leftPaneWidth}
          onChange={setLeftPaneWidth}
          min={LEFT_PANEL_MIN_WIDTH}
        />

        <ContentWorkspace />
      </Flex>
    </Box>
  );
}
