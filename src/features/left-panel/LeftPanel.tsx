/*
 * File purpose: Left navigation panel that combines the domain header, utility palette, and tree or utility content.
 *
 * Imports:
 * - Box from "@mantine/core" provides Mantine UI primitives, theme helpers, component types, or styling utilities used in this file.
 * - Text from "@mantine/core" provides Mantine UI primitives, theme helpers, component types, or styling utilities used in this file.
 * - type { ReactNode } from "react" provides React hooks, refs, component helpers, or React-only types used in this file.
 * - type { Icon } from "@tabler/icons-react" provides icon components or icon types used by the CMS navigation UI.
 * - LeftPanelHeader from "./LeftPanelHeader" provides the title and icon header for the left navigation panel.
 * - LeftPalette from "./palette/LeftPalette" provides the vertical utility palette in the left panel.
 * - SiteTree from "./site-tree/SiteTree" provides the tree browser for site or asset nodes.
 * - type { SiteTreeNode } from "./site-tree/types" provides shared data types used by this feature.
 * - type { WorkspaceUtilityKey, } from "../workspace/types" provides shared workspace domain or utility key types.
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
  publishTarget: string;
  showPublishingTarget: boolean;
  onSelectUtility: (
    utilityId: WorkspaceUtilityKey
  ) => void;
  onSelectNode: (nodeId: string) => void;
  onChangePublishTarget: (value: string) => void;
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

function Header({
  title,
  icon,
}: HeaderProps) {
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
  showOptions: boolean;
  publishTarget: string;
  showPublishingTarget: boolean;
  onChangePublishTarget: (value: string) => void;
  onSelectNode: (nodeId: string) => void;
};

function SiteTreeColumn({
  nodes,
  selectedNodeId,
  showOptions,
  publishTarget,
  showPublishingTarget,
  onChangePublishTarget,
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
        showOptions={showOptions}
        publishTarget={publishTarget}
        showPublishingTarget={showPublishingTarget}
        onChangePublishTarget={onChangePublishTarget}
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
  publishTarget,
  showPublishingTarget,
  onSelectUtility,
  onSelectNode,
  onChangePublishTarget,
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
    showOptions: title === "Site",
    publishTarget,
    showPublishingTarget,
    onChangePublishTarget,
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
