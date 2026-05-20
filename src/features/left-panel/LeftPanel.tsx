/*
 * Left navigation panel.
 * - Displays the site-tree header, vertical palette, and tree browser.
 * - Receives sizing and selected-node state from the app shell.
 */
import { Box } from "@mantine/core";
import type { ReactNode } from "react";

import { LeftPanelHeader } from "./LeftPanelHeader";
import { LeftPalette } from "./palette/LeftPalette";
import { SiteTree } from "./site-tree/SiteTree";

type LeftPanelProps = {
  width: number;
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

function Header() {
  return (
    <Box
      style={{
        gridColumn: "1 / -1",
        gridRow: 1,
        minWidth: 0,
      }}
    >
      <LeftPanelHeader />
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
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
};

function SiteTreeColumn({
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
        selectedNodeId={selectedNodeId}
        onSelectNode={onSelectNode}
      />
    </Box>
  );
}

export function LeftPanel({
  width,
  selectedNodeId,
  onSelectNode,
}: LeftPanelProps) {
  const siteTreeColumnProps = {
    selectedNodeId,
    onSelectNode,
  };

  return (
    <DisplayGroup width={width}>
      <Header />
      <PaletteColumn />
      <SiteTreeColumn {...siteTreeColumnProps} />
    </DisplayGroup>
  );
}
