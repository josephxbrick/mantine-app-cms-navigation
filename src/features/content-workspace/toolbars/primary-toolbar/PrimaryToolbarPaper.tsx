/*
 * Primary toolbar tool surface.
 * - Displays the Content Tools selector and view-site menu as separate paper controls.
 * - Keeps the toolbar controls readable as named display pieces.
 */
import {
  Group,
  Menu,
  Paper,
  Text,
  UnstyledButton,
} from "@mantine/core";

import {
  IconChevronDown,
  IconExternalLink,
  IconLayoutSidebarRight,
} from "@tabler/icons-react";

import type { ToolbarTool, ToolKey } from "./types";
import type { ReactNode } from "react";
import { useState } from "react";
import {
  MEGAMENU_COLUMN_WIDTH,
  MegamenuColumnLayout,
  MegamenuCommandLabel,
  MegamenuCommandItem,
} from "../../megamenus/MegamenuRenderer";

type PrimaryToolbarPaperProps = {
  buttonWidth: number;
  selected: ToolbarTool | null;
  tools: ToolbarTool[];
  onSelectTool: (tool: ToolKey) => void;
};

type ToolbarGroupProps = {
  children: ReactNode;
};

type ToolbarBubbleProps = ToolbarGroupProps & {
  px?: number;
  pl?: number;
  pr?: number;
  py?: number;
};

const TOOLBAR_BUBBLE_PADDING_X = 14;
const TOOLBAR_BUBBLE_PADDING_Y = 6;

function DisplayGroup({ children }: ToolbarGroupProps) {
  return (
    <Group gap={16} wrap="nowrap">
      {children}
    </Group>
  );
}

function ToolbarBubble({
  children,
  px = TOOLBAR_BUBBLE_PADDING_X,
  pl,
  pr,
  py = TOOLBAR_BUBBLE_PADDING_Y,
}: ToolbarBubbleProps) {
  return (
    <Paper
      radius="xl"
      pl={pl ?? px}
      pr={pr ?? px}
      py={py}
      bg="white"
      shadow="xs"
    >
      <Group gap="md">{children}</Group>
    </Paper>
  );
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
  const [opened, setOpened] = useState(false);

  const handleSelectTool = (tool: ToolKey) => {
    onSelectTool(tool);
    setOpened(false);
  };

  return (
    <Menu
      shadow="md"
      width={MEGAMENU_COLUMN_WIDTH}
      position="bottom-end"
      opened={opened}
      onChange={setOpened}
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
            gap: 8,
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

      <Menu.Dropdown px={12} pt={16} pb={12}>
        <MegamenuColumnLayout header="Choose a Tool">
          {tools.map((tool) => (
            <ToolSelectorMenuItem
              key={tool.label}
              tool={tool}
              selected={selected}
              onSelectTool={handleSelectTool}
            />
          ))}
        </MegamenuColumnLayout>
      </Menu.Dropdown>
    </Menu>
  );
}

type ToolSelectorMenuItemProps = {
  tool: ToolbarTool;
  selected: ToolbarTool;
  onSelectTool: (tool: ToolKey) => void;
};

function ToolSelectorMenuItem({
  tool,
  selected,
  onSelectTool,
}: ToolSelectorMenuItemProps) {
  const isSelected = tool.label === selected.label;

  return (
    <MegamenuCommandItem
      selected={isSelected}
      onClick={() => onSelectTool(tool.label)}
    >
      {tool.icon}
      <MegamenuCommandLabel>
        {tool.label}
      </MegamenuCommandLabel>
    </MegamenuCommandItem>
  );
}

function ViewMenu() {
  const [opened, setOpened] = useState(false);

  const handleLaunch = (label: string) => {
    console.log(label);
    setOpened(false);
  };

  return (
    <Menu
      shadow="md"
      width={MEGAMENU_COLUMN_WIDTH}
      position="bottom-end"
      opened={opened}
      onChange={setOpened}
    >
      <Menu.Target>
        <UnstyledButton
          style={{
            height: 38,
            paddingInline: 12,
            borderRadius: 999,
            display: "flex",
            alignItems: "center",
            gap: 6,
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

      <Menu.Dropdown px={12} pt={16} pb={12}>
        <MegamenuColumnLayout header="Launch in Browser">
          <MegamenuCommandItem
            onClick={() => handleLaunch("Site in Staging")}
          >
            <IconExternalLink size={28} stroke={1} />
            <MegamenuCommandLabel>
              Site in Staging
            </MegamenuCommandLabel>
          </MegamenuCommandItem>

          <MegamenuCommandItem
            onClick={() =>
              handleLaunch("Site in Production")
            }
          >
            <IconExternalLink size={28} stroke={1} />
            <MegamenuCommandLabel>
              Site in Production
            </MegamenuCommandLabel>
          </MegamenuCommandItem>
        </MegamenuColumnLayout>
      </Menu.Dropdown>
    </Menu>
  );
}

type ContentToolsBubbleProps = {
  buttonWidth: number;
  selected: ToolbarTool;
  tools: ToolbarTool[];
  onSelectTool: (tool: ToolKey) => void;
};

function ContentToolsBubble({
  buttonWidth,
  selected,
  tools,
  onSelectTool,
}: ContentToolsBubbleProps) {
  const toolSelectorMenuProps = {
    buttonWidth,
    selected,
    tools,
    onSelectTool,
  };

  return (
    <ToolbarBubble
      pl={18}
      pr={TOOLBAR_BUBBLE_PADDING_Y}
    >
      <ContentToolsLabel />
      <ToolSelectorMenu {...toolSelectorMenuProps} />
    </ToolbarBubble>
  );
}

function ViewSiteBubble() {
  return (
    <ToolbarBubble px={10}>
      <ViewMenu />
    </ToolbarBubble>
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
        <ViewSiteBubble />
      </DisplayGroup>
    );
  }

  const contentToolsBubbleProps = {
    buttonWidth,
    selected,
    tools,
    onSelectTool,
  };

  return (
    <DisplayGroup>
      <ContentToolsBubble
        {...contentToolsBubbleProps}
      />
      <ViewSiteBubble />
    </DisplayGroup>
  );
}
