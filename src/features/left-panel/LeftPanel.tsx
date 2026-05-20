/*
 * Left navigation panel.
 * - Displays the active tree header, vertical palette, and tree browser.
 * - Receives sizing and selected-node state from the app shell.
 */
import { Box } from "@mantine/core";
import type { ReactNode } from "react";

import { LeftPanelHeader } from "./LeftPanelHeader";
import { LeftPalette } from "./palette/LeftPalette";
import { SiteTree } from "./site-tree/SiteTree";
import type { SiteTreeNode } from "./site-tree/types";

type LeftPanelProps = {
  width: number;
  title: string;
  nodes: SiteTreeNode[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
};

type DisplayGroupProps = {
  children: ReactNode;
  width: number;
};

function DisplayGroup({
  width,
  children,
}: DisplayGroupProps) {
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
          display: "grid",
          gridTemplateColumns:
            "88px minmax(260px, 1fr)",
          gridTemplateRows:
            "72px minmax(0, 1fr)",
          minWidth: 348,
          minHeight: 0,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

type HeaderProps = {
  title: string;
};

function Header({ title }: HeaderProps) {
  return (
    <Box
      style={{
        gridColumn: "1 / -1",
        gridRow: 1,
        minWidth: 0,
      }}
    >
      <LeftPanelHeader title={title} />
    </Box>
  );
}

function PaletteColumn() {
  return (
    <Box
      h="100%"
      style={{
        gridColumn: 1,
        gridRow: 2,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <LeftPalette />
    </Box>
  );
}

type SiteTreeColumnProps = {
  nodes: SiteTreeNode[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
};

function SiteTreeColumn({
  nodes,
  selectedNodeId,
  onSelectNode,
}: SiteTreeColumnProps) {
  return (
    <Box
      h="100%"
      style={{
        gridColumn: 2,
        gridRow: 2,
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      <SiteTree
        nodes={nodes}
        selectedNodeId={selectedNodeId}
        onSelectNode={onSelectNode}
      />
    </Box>
  );
}

export function LeftPanel({
  width,
  title,
  nodes,
  selectedNodeId,
  onSelectNode,
}: LeftPanelProps) {
  const headerProps = {
    title,
  };

  const siteTreeColumnProps = {
    nodes,
    selectedNodeId,
    onSelectNode,
  };

  return (
    <DisplayGroup width={width}>
      <Header {...headerProps} />
      <PaletteColumn />
      <SiteTreeColumn {...siteTreeColumnProps} />
    </DisplayGroup>
  );
}
