/*
 * Primary content toolbar.
 * - Shows the selected content node title and workspace context.
 * - Owns selected content-tool state and measures the tool selector width.
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
  IconAccessible,
  IconChartBar,
  IconChevronDown,
  IconCode,
  IconEye,
  IconFileText,
  IconHistory,
  IconInfoCircle,
  IconPhoto,
  IconSettings,
  IconTags,
} from "@tabler/icons-react";

import { PrimaryToolbarPaper } from "./PrimaryToolbarPaper";
import type {
  ToolbarTool,
  ToolKey,
} from "./types";

const tools: ToolbarTool[] = [
  {
    label: "Edit",
    icon: <IconFileText size={28} stroke={1} />,
  },
  {
    label: "Assets",
    icon: <IconPhoto size={28} stroke={1} />,
  },
  {
    label: "Preview",
    icon: <IconEye size={28} stroke={1} />,
  },
  {
    label: "Categorize",
    icon: <IconTags size={28} stroke={1} />,
  },
  {
    label: "History",
    icon: <IconHistory size={28} stroke={1} />,
  },
  {
    label: "XML",
    icon: <IconCode size={28} stroke={1} />,
  },
  {
    label: "Properties",
    icon: <IconSettings size={28} stroke={1} />,
  },
  {
    label: "Analytics",
    icon: <IconChartBar size={28} stroke={1} />,
  },
  {
    label: "Accessibility",
    icon: <IconAccessible size={28} stroke={1} />,
  },
];

type PrimaryToolbarProps = {
  selectedNodeLabel: string;
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
  selectedNodeLabel: string;
};

function WorkspaceTitle({
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
        x5 · Content workspace
      </Text>
    </Box>
  );
}

type MeasurementProbeProps = {
  measureRef: RefObject<HTMLDivElement | null>;
  selected: ToolbarTool;
};

function MeasurementProbe({
  measureRef,
  selected,
}: MeasurementProbeProps) {
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
}: PrimaryToolbarProps) {
  const [selectedTool, setSelectedTool] =
    useState<ToolKey>("Edit");

  const selected =
    tools.find(
      (tool) => tool.label === selectedTool
    ) ?? tools[0];

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
  }, [selectedTool]);

  const workspaceTitleProps = {
    selectedNodeLabel,
  };

  const primaryToolbarPaperProps = {
    buttonWidth,
    selected,
    tools,
    onSelectTool: setSelectedTool,
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
