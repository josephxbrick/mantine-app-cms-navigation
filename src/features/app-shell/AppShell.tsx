import { useState } from "react";

import { Box, Flex } from "@mantine/core";

import { ContentWorkspace } from "../content-workspace/ContentWorkspace";
import { LeftPanel } from "../left-panel/LeftPanel";
import { findSiteTreeNodeById } from "../left-panel/site-tree/siteTreeData";
import { ProductToolbar } from "../content-workspace/toolbars/ProductToolbar";
import { WorkspaceSplitter } from "./WorkspaceSplitter";

const LEFT_PANEL_INITIAL_WIDTH = 414;
const LEFT_PANEL_MIN_WIDTH = 348;
const DEFAULT_SELECTED_NODE_ID = "central-university";

export function AppShell() {
  const [productToolbarMode, setProductToolbarMode] =
    useState<"default" | "search">("default");

  const [leftPaneWidth, setLeftPaneWidth] = useState(
    LEFT_PANEL_INITIAL_WIDTH
  );
  const [selectedNodeId, setSelectedNodeId] =
    useState<string | null>(DEFAULT_SELECTED_NODE_ID);

  const selectedNode =
    findSiteTreeNodeById(selectedNodeId);

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
        <LeftPanel
          width={leftPaneWidth}
          selectedNodeId={selectedNodeId}
          onSelectNode={setSelectedNodeId}
        />

        <WorkspaceSplitter
          value={leftPaneWidth}
          onChange={setLeftPaneWidth}
          min={LEFT_PANEL_MIN_WIDTH}
        />

        <ContentWorkspace
          selectedNodeLabel={
            selectedNode?.label ?? "No selection"
          }
        />
      </Flex>
    </Box>
  );
}
