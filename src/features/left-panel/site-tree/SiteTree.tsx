/*
 * Site tree browser.
 * - Renders the scrollable tree from caller-provided tree data.
 * - Passes selected-node state and selection callbacks to each tree item.
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
