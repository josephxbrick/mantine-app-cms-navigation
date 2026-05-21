/*
 * Site tree row.
 * - Displays one tree node with indentation, chevron, icon, and label.
 * - Manages open/closed state for child nodes and selection behavior.
 */
import {
  Box,
  Group,
  Text,
  Transition,
  UnstyledButton,
} from "@mantine/core";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import {
  ChevronClosedIcon,
  ChevronOpenIcon,
  TreeNodeIcon,
} from "./SiteTreeIcons";
import { SiteTreeIndent } from "./SiteTreeIndent";
import type {
  SiteTreeNode,
  SiteTreeNodeIconKey,
} from "./types";

type SiteTreeItemProps = {
  node: SiteTreeNode;
  level: number;
  selectedNodeId: string | null;
  openNodeIds: string[];
  onSelectNode: (nodeId: string) => void;
};

type DisplayGroupProps = {
  children: ReactNode;
};

function DisplayGroup({ children }: DisplayGroupProps) {
  return <Box>{children}</Box>;
}

type NodeButtonProps = {
  node: SiteTreeNode;
  level: number;
  hasChildren: boolean;
  isFolder: boolean;
  isOpen: boolean;
  isSelected: boolean;
  onSelectNode: (nodeId: string) => void;
  onToggleOpen: () => void;
};

function NodeButton({
  node,
  level,
  hasChildren,
  isFolder,
  isOpen,
  isSelected,
  onSelectNode,
  onToggleOpen,
}: NodeButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isHighlighted = isSelected || isHovered;
  const nodeChevronProps = {
    hasChildren,
    isOpen,
    onToggleOpen,
  };

  const nodeIdentityProps = {
    label: node.label,
    icon: node.icon,
    isFolder,
    isOpen,
    isSelected,
  };

  return (
    <UnstyledButton
      w="100%"
      px="xs"
      py={4}
      bg={
        isSelected
          ? "asxIndigo.0"
          : isHovered
            ? "asxBlue.0"
            : "transparent"
      }
      onClick={() => onSelectNode(node.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderRadius: 4,
        overflow: "visible",
        border: isHighlighted
          ? `1px solid var(--mantine-color-${
              isSelected ? "asxIndigo-2" : "asxBlue-1"
            })`
          : "1px solid transparent",
      }}
    >
      <NodeButtonContent>
        <SiteTreeIndent level={level} />
        <NodeChevron {...nodeChevronProps} />
        <NodeIdentity {...nodeIdentityProps} />
      </NodeButtonContent>
    </UnstyledButton>
  );
}

function NodeButtonContent({
  children,
}: DisplayGroupProps) {
  return (
    <Group
      gap={4}
      wrap="nowrap"
      style={{
        minWidth: "max-content",
        userSelect: "none",
      }}
    >
      {children}
    </Group>
  );
}

type NodeChevronProps = {
  hasChildren: boolean;
  isOpen: boolean;
  onToggleOpen: () => void;
};

function NodeChevron({
  hasChildren,
  isOpen,
  onToggleOpen,
}: NodeChevronProps) {
  return (
    <Box
      w={18}
      h={28}
      display="flex"
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
      onClick={(event) => {
        event.stopPropagation();

        if (hasChildren) {
          onToggleOpen();
        }
      }}
    >
      {hasChildren ? (
        isOpen ? (
          <ChevronOpenIcon />
        ) : (
          <ChevronClosedIcon />
        )
      ) : null}
    </Box>
  );
}

type NodeIdentityProps = {
  label: string;
  icon?: SiteTreeNodeIconKey;
  isFolder: boolean;
  isOpen: boolean;
  isSelected: boolean;
};

function NodeIdentity({
  label,
  icon,
  isFolder,
  isOpen,
  isSelected,
}: NodeIdentityProps) {
  return (
    <Group
      gap={6}
      wrap="nowrap"
      style={{
        flexShrink: 0,
      }}
    >
      <NodeTypeIcon
        icon={icon}
        isFolder={isFolder}
        isOpen={isOpen}
      />

      <Text
        size="sm"
        c={isSelected ? "asxIndigo.9" : "asxGray.8"}
        fw={isSelected ? 600 : 400}
        style={{
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </Text>
    </Group>
  );
}

type NodeTypeIconProps = {
  icon?: SiteTreeNodeIconKey;
  isFolder: boolean;
  isOpen: boolean;
};

function NodeTypeIcon({
  icon,
  isFolder,
  isOpen,
}: NodeTypeIconProps) {
  return (
    <Box
      display="flex"
      style={{
        alignItems: "center",
        flexShrink: 0,
      }}
    >
      <TreeNodeIcon
        icon={icon}
        isFolder={isFolder}
        isOpen={isOpen}
      />
    </Box>
  );
}

type ChildNodesProps = {
  node: SiteTreeNode;
  level: number;
  selectedNodeId: string | null;
  openNodeIds: string[];
  onSelectNode: (nodeId: string) => void;
  isOpen: boolean;
};

function ChildNodes({
  node,
  level,
  selectedNodeId,
  openNodeIds,
  onSelectNode,
  isOpen,
}: ChildNodesProps) {
  if (!node.children?.length) {
    return null;
  }

  return (
    <Transition
      mounted={isOpen}
      transition="fade-down"
      duration={140}
      timingFunction="ease"
    >
      {(styles) => (
        <Box style={styles}>
          {node.children?.map((childNode) => (
            <SiteTreeItem
              key={childNode.id}
              node={childNode}
              level={level + 1}
              selectedNodeId={selectedNodeId}
              openNodeIds={openNodeIds}
              onSelectNode={onSelectNode}
            />
          ))}
        </Box>
      )}
    </Transition>
  );
}

export const SiteTreeItem = ({
  node,
  level,
  selectedNodeId,
  openNodeIds,
  onSelectNode,
}: SiteTreeItemProps) => {
  const hasChildren = Boolean(node.children?.length);
  const shouldOpenToSelection =
    openNodeIds.includes(node.id);
  const [isOpen, setIsOpen] = useState(
    shouldOpenToSelection
  );

  useEffect(() => {
    if (!shouldOpenToSelection) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsOpen(true);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [shouldOpenToSelection]);

  const isSelected = selectedNodeId === node.id;
  const isFolder = hasChildren;

  const nodeButtonProps = {
    node,
    level,
    hasChildren,
    isFolder,
    isOpen,
    isSelected,
    onSelectNode,
    onToggleOpen: () =>
      setIsOpen((current) => !current),
  };

  const childNodesProps = {
    node,
    level,
    selectedNodeId,
    openNodeIds,
    onSelectNode,
    isOpen,
  };

  return (
    <DisplayGroup>
      <NodeButton {...nodeButtonProps} />
      <ChildNodes {...childNodesProps} />
    </DisplayGroup>
  );
};
