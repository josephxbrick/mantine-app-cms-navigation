/*
 * File purpose: Primary toolbar controller that renders selected item context and primary toolbar actions.
 *
 * Imports:
 * - type { ReactNode } from "react" provides React hooks, refs, component helpers, or React-only types used in this file.
 * - Flex, Group, Text, from "@mantine/core" provides Mantine UI primitives, theme helpers, component types, or styling utilities used in this file.
 * - IconInfoCircle, from "@tabler/icons-react" provides icon components or icon types used by the CMS navigation UI.
 * - PrimaryToolbarPaper from "./PrimaryToolbarPaper" provides the visual primary toolbar surface.
 * - type { SelectedToolKey, ToolbarTool, ToolKey, } from "./types" provides shared data types used by this feature.
 */
import type { ReactNode } from "react";

import {
  Flex,
  Group,
  Text,
} from "@mantine/core";

import { IconInfoCircle } from "@tabler/icons-react";

import { PrimaryToolbarPaper } from "./PrimaryToolbarPaper";
import type {
  SelectedToolKey,
  ToolbarTool,
  ToolKey,
} from "./types";

type PrimaryToolbarProps = {
  selectedNodeLabel: string;
  selectedNodeXId?: string;
  selectedTool: SelectedToolKey;
  tools: ToolbarTool[];
  onSelectTool: (tool: ToolKey) => void;
};

type DisplayGroupProps = {
  children: ReactNode;
};

function DisplayGroup({ children }: DisplayGroupProps) {
  return (
    <Flex
      h={72}
      px="lg"
      align="center"
      justify="space-between"
      bg="asxIndigo.1"
      style={{
        position: "relative",
        borderBottom:
          "1px solid var(--mantine-color-asxIndigo-3)",
      }}
    >
      {children}
    </Flex>
  );
}

type WorkspaceTitleProps = {
  selectedNodeLabel: string;
  selectedNodeXId?: string;
};

function WorkspaceTitle({
  selectedNodeLabel,
  selectedNodeXId,
}: WorkspaceTitleProps) {
  const title = selectedNodeXId
    ? `${selectedNodeLabel} (${selectedNodeXId})`
    : selectedNodeLabel;

  return (
    <Group
      gap={10}
      wrap="nowrap"
      style={{ minWidth: 0 }}
    >
      <Text
        fz={22}
        fw={400}
        c="asxGray.8"
        truncate
      >
        {title}
      </Text>

      <IconInfoCircle
        size={24}
        stroke={1.2}
        color="var(--mantine-color-asxGray-8)"
      />
    </Group>
  );
}

export function PrimaryToolbar({
  selectedNodeLabel,
  selectedNodeXId,
  selectedTool,
  tools,
  onSelectTool,
}: PrimaryToolbarProps) {
  const selected =
    tools.find((tool) => tool.label === selectedTool) ??
    tools[0] ??
    null;

  const workspaceTitleProps = {
    selectedNodeLabel,
    selectedNodeXId,
  };

  const primaryToolbarPaperProps = {
    selected,
    tools,
    onSelectTool,
  };

  return (
    <DisplayGroup>
      <WorkspaceTitle {...workspaceTitleProps} />
      <PrimaryToolbarPaper {...primaryToolbarPaperProps} />
    </DisplayGroup>
  );
}
