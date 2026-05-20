/*
 * Primary content toolbar.
 * - Shows the selected content node title and workspace context.
 * - Receives selected content-tool state and measures the tool selector width.
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
  domainLabel: string;
  selectedNodeLabel: string;
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
      px="xl"
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
  domainLabel: string;
  selectedNodeLabel: string;
};

function WorkspaceTitle({
  domainLabel,
  selectedNodeLabel,
}: WorkspaceTitleProps) {
  return (
    <Box>
      <Group gap={8}>
        <Text size="lg" fw={500} c="asxIndigo.9">
          {selectedNodeLabel}
        </Text>

        <IconInfoCircle
          size={18}
          color="var(--mantine-color-asxIndigo-9)"
        />
      </Group>

      <Text size="s" c="asxIndigo.8">
        x5 · {domainLabel} workspace
      </Text>
    </Box>
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
  domainLabel,
  selectedNodeLabel,
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
    domainLabel,
    selectedNodeLabel,
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
