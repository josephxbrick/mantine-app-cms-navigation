/*
 * File purpose: Scrollable tree container that renders the visible site or asset tree.
 *
 * Imports:
 * - Box, ScrollArea from "@mantine/core" provides Mantine UI primitives, theme helpers, component types, or styling utilities used in this file.
 * - type { ReactNode } from "react" provides React hooks, refs, component helpers, or React-only types used in this file.
 * - SiteTreeItem from "./SiteTreeItem" provides the recursive row renderer for tree nodes.
 * - getTreeNodeIdsToOpen from "./siteTreeData" provides prototype tree data and lookup helpers for selected nodes.
 * - type { SiteTreeNode } from "./types" provides shared data types used by this feature.
 */
import { Box, ScrollArea } from "@mantine/core";
import type { ReactNode } from "react";

import { SiteTreeItem } from "./SiteTreeItem";
import { getTreeNodeIdsToOpen } from "./siteTreeData";
import type { SiteTreeNode } from "./types";

type SiteTreeProps = {
  nodes: SiteTreeNode[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
};

type DisplayGroupProps = {
  children: ReactNode;
};

function DisplayGroup({ children }: DisplayGroupProps) {
  return (
    <Box
      h="100%"
      bg="white"
      pl="xs"
      pr={16}
      py="xs"
      miw={260}
    >
      <ScrollArea h="100%" type="auto">
        {children}
      </ScrollArea>
    </Box>
  );
}

type TreeNodesProps = {
  nodes: SiteTreeNode[];
  selectedNodeId: string | null;
  openNodeIds: string[];
  onSelectNode: (nodeId: string) => void;
};

function TreeNodes({
  nodes,
  selectedNodeId,
  openNodeIds,
  onSelectNode,
}: TreeNodesProps) {
  return (
    <>
      {nodes.map((node) => (
        <SiteTreeItem
          key={node.id}
          node={node}
          level={0}
          selectedNodeId={selectedNodeId}
          openNodeIds={openNodeIds}
          onSelectNode={onSelectNode}
        />
      ))}
    </>
  );
}

export const SiteTree = ({
  nodes,
  selectedNodeId,
  onSelectNode,
}: SiteTreeProps) => {
  const openNodeIds = getTreeNodeIdsToOpen(
    selectedNodeId,
    nodes
  );

  const treeNodesProps = {
    nodes,
    selectedNodeId,
    openNodeIds,
    onSelectNode,
  };

  return (
    <DisplayGroup>
      <TreeNodes {...treeNodesProps} />
    </DisplayGroup>
  );
};
