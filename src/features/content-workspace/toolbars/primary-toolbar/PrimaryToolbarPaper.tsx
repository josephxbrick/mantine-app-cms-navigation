/*
 * Primary toolbar tool surface.
 * - Displays the Content Tools selector and view-site menu inside a paper control.
 * - Keeps the toolbar controls readable as named display pieces.
 */
import {
  Box,
  Group,
  Menu,
  Paper,
  Text,
  UnstyledButton,
} from "@mantine/core";

import {
  IconChevronDown,
  IconEye,
  IconLayoutSidebarRight,
} from "@tabler/icons-react";

import type { ToolbarTool, ToolKey } from "./types";
import type { ReactNode } from "react";

type PrimaryToolbarPaperProps = {
  buttonWidth: number;
  selected: ToolbarTool | null;
  tools: ToolbarTool[];
  onSelectTool: (tool: ToolKey) => void;
};

type ToolbarGroupProps = {
  children: ReactNode;
};

function DisplayGroup({ children }: ToolbarGroupProps) {
  return (
    <Paper
      radius="xl"
      pl={18}
      py={6}
      bg="white"
      shadow="xs"
    >
      <Group gap="md">{children}</Group>
    </Paper>
  );
}

function ToolbarDelimiter() {
  return <Box h={28} w={1} bg="asxIndigo.4" />;
}

function ContentToolsLabel() {
  return (
    <Text
      fz={13}
      fw={500}
      c="asxIndigo.8"
      tt="uppercase"
    >
      Content Tools
    </Text>
  );
}

type ToolSelectorMenuProps = {
  buttonWidth: number;
  selected: ToolbarTool;
  tools: ToolbarTool[];
  onSelectTool: (tool: ToolKey) => void;
};

function ToolSelectorMenu({
  buttonWidth,
  selected,
  tools,
  onSelectTool,
}: ToolSelectorMenuProps) {
  return (
    <Menu
      shadow="md"
      width={240}
      position="bottom-end"
    >
      <Menu.Target>
        <UnstyledButton
          style={{
            width: buttonWidth,
            height: 38,
            paddingInline: 14,
            borderRadius: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 10,
            background:
              "var(--mantine-color-asxIndigo-0)",
            border:
              "1px solid var(--mantine-color-asxIndigo-2)",
            color:
              "var(--mantine-color-asxGray-7)",
            transition: "width 180ms ease",
            overflow: "hidden",
          }}
        >
          <Group gap={8} wrap="nowrap">
            {selected.icon}

            <Text
              size="sm"
              fw={500}
              style={{
                whiteSpace: "nowrap",
              }}
            >
              {selected.label}
            </Text>
          </Group>

          <IconChevronDown
            size={20}
            style={{ flexShrink: 0 }}
          />
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        {tools.map((tool) => (
          <Menu.Item
            key={tool.label}
            leftSection={tool.icon}
            onClick={() =>
              onSelectTool(tool.label)
            }
          >
            {tool.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}

function ViewMenu() {
  return (
    <Menu
      shadow="md"
      width={240}
      position="bottom-end"
    >
      <Menu.Target>
        <UnstyledButton
          style={{
            height: 38,
            paddingInline: 12,
            borderRadius: 999,
            display: "flex",
            alignItems: "center",
            gap: 8,
            color:
              "var(--mantine-color-asxIndigo-7)",
          }}
        >
          <IconLayoutSidebarRight
            size={28}
            stroke={1.3}
            color="var(--mantine-color-asxGray-7)"
          />

          <IconChevronDown size={20} />
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          leftSection={
            <IconEye size={28} stroke={1} />
          }
        >
          View Site in Staging
        </Menu.Item>

        <Menu.Item
          leftSection={
            <IconEye size={28} stroke={1} />
          }
        >
          View Site in Production
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export function PrimaryToolbarPaper({
  buttonWidth,
  selected,
  tools,
  onSelectTool,
}: PrimaryToolbarPaperProps) {
  if (!selected || !tools.length) {
    return (
      <DisplayGroup>
        <ViewMenu />
      </DisplayGroup>
    );
  }

  const toolSelectorMenuProps = {
    buttonWidth,
    selected,
    tools,
    onSelectTool,
  };

  return (
    <DisplayGroup>
      <ContentToolsLabel />
      <ToolSelectorMenu {...toolSelectorMenuProps} />
      <ToolbarDelimiter />
      <ViewMenu />
    </DisplayGroup>
  );
}
