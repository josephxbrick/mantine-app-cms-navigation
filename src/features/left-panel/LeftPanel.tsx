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
  WorkspaceDomain,
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
  nodes: SiteTreeNode[] | null;
  selectedDomain: WorkspaceDomain;
  utilityItems: LeftPanelUtility[];
  selectedUtilityId: WorkspaceUtilityKey;
  selectedNodeId: string | null;
  onSelectDomain: (domain: WorkspaceDomain) => void;
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

type PaletteColumnProps = {
  selectedDomain: WorkspaceDomain;
  utilityItems: LeftPanelUtility[];
  selectedUtilityId: WorkspaceUtilityKey;
  onSelectDomain: (domain: WorkspaceDomain) => void;
  onSelectUtility: (
    utilityId: WorkspaceUtilityKey
  ) => void;
};

function PaletteColumn({
  selectedDomain,
  utilityItems,
  selectedUtilityId,
  onSelectDomain,
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
        selectedDomain={selectedDomain}
        utilityItems={utilityItems}
        selectedUtilityId={selectedUtilityId}
        onSelectDomain={onSelectDomain}
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
  nodes,
  selectedDomain,
  utilityItems,
  selectedUtilityId,
  selectedNodeId,
  onSelectDomain,
  onSelectUtility,
  onSelectNode,
}: LeftPanelProps) {
  const headerProps = {
    title,
  };

  const paletteColumnProps = {
    selectedDomain,
    utilityItems,
    selectedUtilityId,
    onSelectDomain,
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
