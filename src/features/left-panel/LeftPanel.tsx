/*
 * Left navigation panel.
 * - Displays the active tree header, vertical palette, and tree browser.
 * - Receives sizing and selected-node state from the app shell.
 */
import { Box } from "@mantine/core";
import { Text } from "@mantine/core";
import type { ReactNode } from "react";
import type { Icon } from "@tabler/icons-react";

import { LeftPanelHeader } from "./LeftPanelHeader";
import { LeftPalette } from "./palette/LeftPalette";
import { SiteTree } from "./site-tree/SiteTree";
import type { SiteTreeNode } from "./site-tree/types";
import type {
  WorkspaceUtilityKey,
} from "../workspace/types";

type LeftPanelUtility = {
  id: WorkspaceUtilityKey;
  label: string;
  icon: Icon;
};

type LeftPanelProps = {
  width: number;
  title: string;
  icon: Icon;
  nodes: SiteTreeNode[] | null;
  utilityItems: LeftPanelUtility[];
  selectedUtilityId: WorkspaceUtilityKey;
  selectedNodeId: string | null;
  onSelectUtility: (
    utilityId: WorkspaceUtilityKey
  ) => void;
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
  icon: Icon;
};

function Header({ title, icon }: HeaderProps) {
  return (
    <Box
      style={{
        gridColumn: "1 / -1",
        gridRow: 1,
        minWidth: 0,
      }}
    >
      <LeftPanelHeader title={title} icon={icon} />
    </Box>
  );
}

type PaletteColumnProps = {
  utilityItems: LeftPanelUtility[];
  selectedUtilityId: WorkspaceUtilityKey;
  onSelectUtility: (
    utilityId: WorkspaceUtilityKey
  ) => void;
};

function PaletteColumn({
  utilityItems,
  selectedUtilityId,
  onSelectUtility,
}: PaletteColumnProps) {
  return (
    <Box
      h="100%"
      style={{
        gridColumn: 1,
        gridRow: 2,
        position: "relative",
        overflow: "visible",
        zIndex: 10,
      }}
    >
      <LeftPalette
        utilityItems={utilityItems}
        selectedUtilityId={selectedUtilityId}
        onSelectUtility={onSelectUtility}
      />
    </Box>
  );
}

type SiteTreeColumnProps = {
  nodes: SiteTreeNode[] | null;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
};

function SiteTreeColumn({
  nodes,
  selectedNodeId,
  onSelectNode,
}: SiteTreeColumnProps) {
  if (!nodes) {
    return null;
  }

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

type UtilityColumnProps = {
  title: string;
};

function UtilityColumn({ title }: UtilityColumnProps) {
  return (
    <Box
      h="100%"
      p="md"
      style={{
        gridColumn: 2,
        gridRow: 2,
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      <Text size="sm" c="asxGray.7" fw={500}>
        {title} utility
      </Text>
    </Box>
  );
}

export function LeftPanel({
  width,
  title,
  icon,
  nodes,
  utilityItems,
  selectedUtilityId,
  selectedNodeId,
  onSelectUtility,
  onSelectNode,
}: LeftPanelProps) {
  const headerProps = {
    title,
    icon,
  };

  const paletteColumnProps = {
    utilityItems,
    selectedUtilityId,
    onSelectUtility,
  };

  const siteTreeColumnProps = {
    nodes,
    selectedNodeId,
    onSelectNode,
  };

  return (
    <DisplayGroup width={width}>
      <Header {...headerProps} />
      <PaletteColumn {...paletteColumnProps} />
      {nodes ? (
        <SiteTreeColumn {...siteTreeColumnProps} />
      ) : (
        <UtilityColumn title={title} />
      )}
    </DisplayGroup>
  );
}
