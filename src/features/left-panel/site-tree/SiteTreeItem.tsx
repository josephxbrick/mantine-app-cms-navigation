/*
 * File purpose: Recursive tree row component that handles expansion, selection, indentation, and node styling.
 *
 * Imports:
 * - Box, Group, Text, Tooltip, Transition, UnstyledButton, from "@mantine/core" provides Mantine UI primitives, theme helpers, component types, or styling utilities used in this file.
 * - useCallback, useEffect, useRef, useState from "react" provides React hooks, refs, component helpers, or React-only types used in this file.
 * - type { ReactNode } from "react" provides React hooks, refs, component helpers, or React-only types used in this file.
 * - ChevronClosedIcon, ChevronOpenIcon, TreeNodeIcon, from "./SiteTreeIcons" provides tree node and expansion icons.
 * - SiteTreeIndent from "./SiteTreeIndent" provides indentation spacing for nested tree rows.
 * - type { SiteTreeNode, SiteTreeNodeIconKey, } from "./types" provides shared data types used by this feature.
 */
import {
  Box,
  Group,
  Text,
  Tooltip,
  Transition,
  UnstyledButton,
} from "@mantine/core";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
        minWidth: 0,
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
        minWidth: 0,
        flex: 1,
      }}
    >
      <NodeTypeIcon
        icon={icon}
        isFolder={isFolder}
        isOpen={isOpen}
      />

      <NodeLabel label={label} isSelected={isSelected} />
    </Group>
  );
}

type NodeLabelProps = {
  label: string;
  isSelected: boolean;
};

function NodeLabel({ label, isSelected }: NodeLabelProps) {
  const labelRef = useRef<HTMLParagraphElement | null>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  const updateTruncation = useCallback(() => {
    const element = labelRef.current;

    if (!element) {
      return;
    }

    setIsTruncated(element.scrollWidth > element.clientWidth);
  }, []);

  useEffect(() => {
    const element = labelRef.current;

    if (!element) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      updateTruncation();
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateTruncation]);

  return (
    <Tooltip
      label={label}
      openDelay={400}
      disabled={!isTruncated}
    >
      <Text
        ref={labelRef}
        truncate
        fz={16}
        c={isSelected ? "asxIndigo.9" : "asxGray.8"}
        fw={isSelected ? 500 : 400}
        onMouseEnter={updateTruncation}
        style={{
          minWidth: 0,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </Text>
    </Tooltip>
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
