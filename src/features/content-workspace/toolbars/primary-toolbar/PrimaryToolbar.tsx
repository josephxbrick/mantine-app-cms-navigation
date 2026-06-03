/*
 * File purpose: Primary toolbar controller that measures available space and chooses visible versus overflow tools.
 *
 * Imports:
 * - useEffect, useRef, useState, from "react" provides React hooks, refs, component helpers, or React-only types used in this file.
 * - type { ReactNode, RefObject } from "react" provides React hooks, refs, component helpers, or React-only types used in this file.
 * - Box, Flex, Group, Text, from "@mantine/core" provides Mantine UI primitives, theme helpers, component types, or styling utilities used in this file.
 * - IconChevronDown, IconInfoCircle, from "@tabler/icons-react" provides icon components or icon types used by the CMS navigation UI.
 * - PrimaryToolbarPaper from "./PrimaryToolbarPaper" provides the visual primary toolbar surface.
 * - type { SelectedToolKey, ToolbarTool, ToolKey, } from "./types" provides shared data types used by this feature.
 */
import {
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode, RefObject } from "react";

import {
  Box,
  Flex,
  Group,
  Text,
} from "@mantine/core";

import {
  IconChevronDown,
  IconInfoCircle,
} from "@tabler/icons-react";

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

type MeasurementProbeProps = {
  measureRef: RefObject<HTMLDivElement | null>;
  selected: ToolbarTool | null;
};

function MeasurementProbe({
  measureRef,
  selected,
}: MeasurementProbeProps) {
  if (!selected) {
    return null;
  }

  return (
    <Box
      ref={measureRef}
      style={{
        position: "absolute",
        visibility: "hidden",
        pointerEvents: "none",
        whiteSpace: "nowrap",
      }}
    >
      <Group gap={8} wrap="nowrap">
        {selected.icon}

        <Text size="sm" fw={500}>
          {selected.label}
        </Text>

        <IconChevronDown size={20} />
      </Group>
    </Box>
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

  const measureRef =
    useRef<HTMLDivElement>(null);

  const [buttonWidth, setButtonWidth] =
    useState(136);

  useEffect(() => {
    if (measureRef.current) {
      setButtonWidth(
        measureRef.current.offsetWidth + 26
      );
    }
  }, [selectedTool, tools]);

  const workspaceTitleProps = {
    selectedNodeLabel,
    selectedNodeXId,
  };

  const primaryToolbarPaperProps = {
    buttonWidth,
    selected,
    tools,
    onSelectTool,
  };

  const measurementProbeProps = {
    measureRef,
    selected,
  };

  return (
    <DisplayGroup>
      <WorkspaceTitle {...workspaceTitleProps} />
      <PrimaryToolbarPaper {...primaryToolbarPaperProps} />
      <MeasurementProbe {...measurementProbeProps} />
    </DisplayGroup>
  );
}
