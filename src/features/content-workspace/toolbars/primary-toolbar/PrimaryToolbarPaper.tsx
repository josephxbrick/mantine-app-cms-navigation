/*
 * File purpose: Primary toolbar surface for selected-item context, tool buttons, and tool overflow behavior.
 *
 * Imports:
 * - Group, Menu, Paper, UnstyledButton, from "@mantine/core" provides Mantine UI primitives, theme helpers, component types, or styling utilities used in this file.
 * - IconChevronDown, IconExternalLink from "@tabler/icons-react" provides icon components or icon types used by the CMS navigation UI.
 * - type { ToolbarTool, ToolKey } from "./types" provides shared data types used by this feature.
 * - type { ReactNode } from "react" provides React hooks, refs, component helpers, or React-only types used in this file.
 * - useState from "react" provides React hooks, refs, component helpers, or React-only types used in this file.
 * - MegamenuColumnLayout, MegamenuCommandLabel, MegamenuCommandItem, from "../../megamenus/MegamenuRenderer" provides the shared renderer for configurable megamenu columns and items.
 * - ToolbarSelectMenu from "../ToolbarSelectMenu" provides the reusable custom toolbar dropdown component.
 */
import {
  Group,
  Menu,
  Paper,
  UnstyledButton,
} from "@mantine/core";

import {
  IconChevronDown,
  IconExternalLink,
} from "@tabler/icons-react";

import type { ToolbarTool, ToolKey } from "./types";
import type { ReactNode } from "react";
import { useState } from "react";
import {
  MegamenuColumnLayout,
  MegamenuCommandLabel,
  MegamenuCommandItem,
} from "../../megamenus/MegamenuRenderer";
import { ToolbarSelectMenu } from "../ToolbarSelectMenu";

type PrimaryToolbarPaperProps = {
  selected: ToolbarTool | null;
  tools: ToolbarTool[];
  onSelectTool: (tool: ToolKey) => void;
};

type ToolbarGroupProps = {
  children: ReactNode;
};

type ToolbarBubbleProps = ToolbarGroupProps & {
  px?: number;
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
  py = TOOLBAR_BUBBLE_PADDING_Y,
}: ToolbarBubbleProps) {
  return (
    <Paper
      radius="xl"
      px={px}
      py={py}
      bg="white"
      shadow="xs"
    >
      <Group gap="md">{children}</Group>
    </Paper>
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
          <IconExternalLink
            size={28}
            stroke={1.3}
            color="var(--mantine-color-asxGray-7)"
          />

          <IconChevronDown size={20} />
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown
        px={12}
        pt={16}
        pb={12}
        style={{ width: "max-content" }}
      >
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
  selected: ToolbarTool;
  tools: ToolbarTool[];
  onSelectTool: (tool: ToolKey) => void;
};

function ContentToolsBubble({
  selected,
  tools,
  onSelectTool,
}: ContentToolsBubbleProps) {
  return (
    <ToolbarSelectMenu
      label="Content Tools"
      mode="surrounded"
      value={selected.label}
      animateWidthToContent
      options={tools.map((tool) => ({
        value: tool.label,
        label: tool.label,
        icon: tool.icon,
      }))}
      onChange={(tool) => onSelectTool(tool as ToolKey)}
    />
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
