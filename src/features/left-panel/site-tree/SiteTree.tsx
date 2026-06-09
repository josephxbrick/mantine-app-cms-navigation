/*
 * File purpose: Scrollable tree container that renders the visible site or asset tree.
 *
 * Imports:
 * - Box, Checkbox, Group, ScrollArea, Stack, Text, UnstyledButton from "@mantine/core" provides Mantine UI primitives, theme helpers, component types, or styling utilities used in this file.
 * - IconFilter2 from "@tabler/icons-react" provides icon components used by the CMS navigation UI.
 * - useEffect, useRef, useState from "react" provides React hooks, refs, component helpers, or React-only types used in this file.
 * - type { ReactNode } from "react" provides React hooks, refs, component helpers, or React-only types used in this file.
 * - ToolbarSelectMenu from "../../content-workspace/toolbars/ToolbarSelectMenu" provides the reusable custom toolbar dropdown component.
 * - SiteTreeItem from "./SiteTreeItem" provides the recursive row renderer for tree nodes.
 * - getTreeNodeIdsToOpen from "./siteTreeData" provides prototype tree data and lookup helpers for selected nodes.
 * - type { SiteTreeNode } from "./types" provides shared data types used by this feature.
 */
import {
  Box,
  Checkbox,
  Group,
  ScrollArea,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { IconFilter2 } from "@tabler/icons-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";

import { ToolbarSelectMenu } from "../../content-workspace/toolbars/ToolbarSelectMenu";
import { SiteTreeItem } from "./SiteTreeItem";
import { getTreeNodeIdsToOpen } from "./siteTreeData";
import type { SiteTreeNode } from "./types";

type SiteTreeProps = {
  nodes: SiteTreeNode[];
  selectedNodeId: string | null;
  showOptions: boolean;
  publishTarget: string;
  showPublishingTarget: boolean;
  onChangePublishTarget: (value: string) => void;
  onSelectNode: (nodeId: string) => void;
};

type DisplayGroupProps = {
  children: ReactNode;
  showOptions: boolean;
  publishTarget: string;
  showPublishingTarget: boolean;
  onChangePublishTarget: (value: string) => void;
};

const publishTargetOptions = [
  {
    value: "qa",
    label: "QA",
  },
  {
    value: "staging",
    label: "Staging",
  },
  {
    value: "production",
    label: "Production",
  },
];

const checkboxStyles = {
  label: {
    color: "var(--mantine-color-asxGray-8)",
  },
};

function DisplayGroup({
  children,
  showOptions,
  publishTarget,
  showPublishingTarget,
  onChangePublishTarget,
}: DisplayGroupProps) {
  const [optionsOpen, setOptionsOpen] = useState(false);

  return (
    <Box
      h="100%"
      bg="white"
      pl="xs"
      pr={16}
      py="xs"
      miw={260}
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      {showOptions ? (
        <OptionsPanel
          open={optionsOpen}
          publishTarget={publishTarget}
          showPublishingTarget={showPublishingTarget}
          onToggleOpen={() =>
            setOptionsOpen((current) => !current)
          }
          onChangePublishTarget={onChangePublishTarget}
        />
      ) : null}
      <ScrollArea h="100%" type="auto" style={{ flex: 1 }}>
        {children}
      </ScrollArea>
    </Box>
  );
}

type OptionsPanelProps = {
  open: boolean;
  publishTarget: string;
  showPublishingTarget: boolean;
  onToggleOpen: () => void;
  onChangePublishTarget: (value: string) => void;
};

function OptionsPanel({
  open,
  publishTarget,
  showPublishingTarget,
  onToggleOpen,
  onChangePublishTarget,
}: OptionsPanelProps) {
  return (
    <Box
      mb="sm"
      style={{ flexShrink: 0, width: "100%" }}
    >
      <Stack
        gap={0}
        p="sm"
        style={{
          border:
            "1px solid var(--mantine-color-asxGray-5)",
          borderRadius: 6,
        }}
      >
        <OptionsHeader
          open={open}
          onToggleOpen={onToggleOpen}
        />
        <AnimatedOptionsContent open={open}>
          <OptionsControls
            publishTarget={publishTarget}
            showPublishingTarget={showPublishingTarget}
            onChangePublishTarget={
              onChangePublishTarget
            }
          />
        </AnimatedOptionsContent>
      </Stack>
    </Box>
  );
}

type OptionsHeaderProps = {
  open: boolean;
  onToggleOpen: () => void;
};

function OptionsHeader({
  open,
  onToggleOpen,
}: OptionsHeaderProps) {
  return (
    <UnstyledButton
      aria-label="Toggle tree options"
      onClick={onToggleOpen}
      style={{
        width: "100%",
        borderRadius: 6,
      }}
    >
      <Group justify="space-between" wrap="nowrap">
        <Text size="lg" fw={400} c="asxGray.8">
          Options
        </Text>
        <Box
          aria-hidden="true"
          style={{
            width: 34,
            height: 34,
            borderRadius: 6,
            display: "grid",
            placeItems: "center",
            background: open
              ? "var(--mantine-color-asxIndigo-0)"
              : "transparent",
            border: open
              ? "1px solid var(--mantine-color-asxIndigo-2)"
              : "1px solid transparent",
            color: open
              ? "var(--mantine-color-asxIndigo-9)"
              : "var(--mantine-color-asxGray-8)",
            transition:
              "background-color 200ms ease-out, border-color 200ms ease-out, color 200ms ease-out",
          }}
        >
          <IconFilter2 size={24} stroke={1.6} />
        </Box>
      </Group>
    </UnstyledButton>
  );
}

type AnimatedOptionsContentProps = {
  children: ReactNode;
  open: boolean;
};

function AnimatedOptionsContent({
  children,
  open,
}: AnimatedOptionsContentProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const contentHeightRef = useRef(0);
  const openRef = useRef(open);
  const [heightTransitionMs, setHeightTransitionMs] =
    useState(200);

  useEffect(() => {
    openRef.current = open;
    setHeightTransitionMs(200);
  }, [open]);

  useEffect(() => {
    const element = contentRef.current;

    if (!element) {
      return;
    }

    const updateHeight = () => {
      const nextHeight = element.scrollHeight;

      if (
        openRef.current &&
        contentHeightRef.current !== 0 &&
        nextHeight !== contentHeightRef.current
      ) {
        setHeightTransitionMs(100);
      }

      contentHeightRef.current = nextHeight;
      setContentHeight(nextHeight);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <Box
      style={{
        height: open ? contentHeight : 0,
        overflow: "hidden",
        transition: `height ${heightTransitionMs}ms ease-out`,
      }}
    >
      <Box ref={contentRef} pt="md">
        {children}
      </Box>
    </Box>
  );
}

type OptionsControlsProps = {
  publishTarget: string;
  showPublishingTarget: boolean;
  onChangePublishTarget: (value: string) => void;
};

function OptionsControls({
  publishTarget,
  showPublishingTarget,
  onChangePublishTarget,
}: OptionsControlsProps) {
  return (
    <Stack gap="sm">
      {showPublishingTarget ? (
        <ToolbarSelectMenu
          label="Publishing Target"
          labelSize="md"
          value={publishTarget}
          options={publishTargetOptions}
          mode="dropdown-only"
          buttonWidth="100%"
          pillFill="white"
          pillStroke="1px solid var(--mantine-color-asxGray-4)"
          showTriggerIcon={false}
          showMenuIcons={false}
          onChange={onChangePublishTarget}
        />
      ) : null}
      <Stack gap="xs">
        <Checkbox
          label="Indicate publishing target root"
          size="md"
          color="asxIndigo"
          styles={checkboxStyles}
        />
        <Checkbox
          label="Indicate region root"
          size="md"
          color="asxIndigo"
          styles={checkboxStyles}
        />
        <Checkbox
          label="Indicate DITA content"
          size="md"
          color="asxIndigo"
          styles={checkboxStyles}
        />
      </Stack>
    </Stack>
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
  showOptions,
  publishTarget,
  showPublishingTarget,
  onChangePublishTarget,
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
    <DisplayGroup
      showOptions={showOptions}
      publishTarget={publishTarget}
      showPublishingTarget={showPublishingTarget}
      onChangePublishTarget={onChangePublishTarget}
    >
      <TreeNodes {...treeNodesProps} />
    </DisplayGroup>
  );
};
