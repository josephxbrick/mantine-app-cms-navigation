/*
 * Main CMS shell layout.
 * - Owns top-level workspace state such as selected site-tree node and panel width.
 * - Renders the product toolbar, left panel, splitter, and content workspace.
 */
import { useState } from "react";
import type { ReactNode } from "react";

import { Box, Flex } from "@mantine/core";

import { ContentWorkspace } from "../content-workspace/ContentWorkspace";
import { LeftPanel } from "../left-panel/LeftPanel";
import { findSiteTreeNodeById } from "../left-panel/site-tree/siteTreeData";
import { ProductToolbar } from "../content-workspace/toolbars/product-toolbar/ProductToolbar";
import { WorkspaceSplitter } from "./WorkspaceSplitter";

const LEFT_PANEL_INITIAL_WIDTH = 414;
const LEFT_PANEL_MIN_WIDTH = 348;
const DEFAULT_SELECTED_NODE_ID = "central-university";

type DisplayGroupProps = {
  children: ReactNode;
};

function DisplayGroup({ children }: DisplayGroupProps) {
  return (
    <Box
      h="100vh"
      bg="gray.0"
      style={{
        display: "grid",
        gridTemplateRows: "72px minmax(0, 1fr)",
        gridTemplateColumns: "auto 1px minmax(0, 1fr)",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      {children}
    </Box>
  );
}

type ProductToolbarSlotProps = {
  children: ReactNode;
};

function ProductToolbarSlot({
  children,
}: ProductToolbarSlotProps) {
  return (
    <Box style={{ gridColumn: "1 / -1", gridRow: 1 }}>
      {children}
    </Box>
  );
}

type LeftPanelSlotProps = ProductToolbarSlotProps;

function LeftPanelSlot({ children }: LeftPanelSlotProps) {
  return (
    <Box
      style={{
        gridColumn: 1,
        gridRow: 2,
        minHeight: 0,
      }}
    >
      {children}
    </Box>
  );
}

type WorkspaceSplitterSlotProps = ProductToolbarSlotProps;

function WorkspaceSplitterSlot({
  children,
}: WorkspaceSplitterSlotProps) {
  return (
    <Box
      style={{
        gridColumn: 2,
        gridRow: 2,
        minHeight: 0,
        position: "relative",
      }}
    >
      {children}
    </Box>
  );
}

type ContentWorkspaceSlotProps = ProductToolbarSlotProps;

function ContentWorkspaceSlot({
  children,
}: ContentWorkspaceSlotProps) {
  return (
    <Flex
      h="100%"
      style={{
        gridColumn: 3,
        gridRow: 2,
        minHeight: 0,
        minWidth: 0,
      }}
    >
      {children}
    </Flex>
  );
}

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

  const productToolbarProps = {
    mode: productToolbarMode,
    onGoTo: () => setProductToolbarMode("search"),
    onCloseSearch: () =>
      setProductToolbarMode("default"),
  };

  const leftPanelProps = {
    width: leftPaneWidth,
    selectedNodeId,
    onSelectNode: setSelectedNodeId,
  };

  const workspaceSplitterProps = {
    value: leftPaneWidth,
    onChange: setLeftPaneWidth,
    min: LEFT_PANEL_MIN_WIDTH,
  };

  const contentWorkspaceProps = {
    selectedNodeLabel:
      selectedNode?.label ?? "No selection",
  };

  return (
    <DisplayGroup>
      <ProductToolbarSlot>
        <ProductToolbar {...productToolbarProps} />
      </ProductToolbarSlot>
      <LeftPanelSlot>
        <LeftPanel {...leftPanelProps} />
      </LeftPanelSlot>
      <WorkspaceSplitterSlot>
        <WorkspaceSplitter {...workspaceSplitterProps} />
      </WorkspaceSplitterSlot>
      <ContentWorkspaceSlot>
        <ContentWorkspace {...contentWorkspaceProps} />
      </ContentWorkspaceSlot>
    </DisplayGroup>
  );
}
