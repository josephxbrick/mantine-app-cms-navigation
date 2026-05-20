/*
 * Secondary content toolbar.
 * - Shows edit menus such as View, Actions, Publish, and New.
 * - Manages hover/click menu activation and renders the active megamenu panel.
 */
import MegamenuView from "../tools/edit/megamenus/MegamenuView";
import MegamenuActions from "../tools/edit/megamenus/MegamenuActions";
import MegamenuPublish from "../tools/edit/megamenus/MegamenuPublish";
import MegamenuNew from "../tools/edit/megamenus/MegamenuNew";

import { useRef, useState } from "react";
import type { ReactNode } from "react";

import {
  IconArrowBackUp,
  IconChevronDown,
  IconDeviceFloppy,
  IconSearch,
} from "@tabler/icons-react";

import {
  Box,
  Flex,
  Group,
  Paper,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";

type MenuKey =
  | "view"
  | "actions"
  | "publish"
  | "new"
  | null;

type DisplayGroupProps = {
  children: ReactNode;
  onMouseLeave: () => void;
};

function DisplayGroup({
  children,
  onMouseLeave,
}: DisplayGroupProps) {
  return (
    <Box bg="white" onMouseLeave={onMouseLeave}>
      {children}
    </Box>
  );
}

type ToolbarRowProps = {
  children: ReactNode;
};

function ToolbarRow({ children }: ToolbarRowProps) {
  return (
    <Flex
      h={52}
      px="xl"
      align="center"
      justify="space-between"
      style={{
        borderBottom:
          "1px solid var(--mantine-color-indigo-2)",
      }}
    >
      {children}
    </Flex>
  );
}

type ToolbarMenuTabsProps = {
  activeMenu: MenuKey;
  onActivateMenu: (
    menu: Exclude<MenuKey, null>
  ) => void;
  onHoverMenu: (
    menu: Exclude<MenuKey, null>
  ) => void;
};

const toolbarMenus = [
  "view",
  "actions",
  "publish",
  "new",
] as Exclude<MenuKey, null>[];

function ToolbarMenuTabs({
  activeMenu,
  onActivateMenu,
  onHoverMenu,
}: ToolbarMenuTabsProps) {
  return (
    <Group gap="xl" wrap="nowrap">
      {toolbarMenus.map((menu) => (
        <ToolbarMenuTab
          key={menu}
          menu={menu}
          active={activeMenu === menu}
          onActivateMenu={onActivateMenu}
          onHoverMenu={onHoverMenu}
        />
      ))}
    </Group>
  );
}

type ToolbarMenuTabProps = {
  menu: Exclude<MenuKey, null>;
  active: boolean;
  onActivateMenu: (
    menu: Exclude<MenuKey, null>
  ) => void;
  onHoverMenu: (
    menu: Exclude<MenuKey, null>
  ) => void;
};

function ToolbarMenuTab({
  menu,
  active,
  onActivateMenu,
  onHoverMenu,
}: ToolbarMenuTabProps) {
  return (
    <UnstyledButton
      onClick={() => onActivateMenu(menu)}
      onMouseEnter={() => onHoverMenu(menu)}
      style={{
        height: 52,
        display: "flex",
        alignItems: "center",
        borderBottom: active
          ? "2px solid var(--mantine-color-indigo-6)"
          : "2px solid transparent",
        color: "var(--mantine-color-gray-7)",
        fontWeight: active ? 700 : 500,
      }}
    >
      <ToolbarMenuTabLabel>
        <Text tt="capitalize">{menu}</Text>
        <IconChevronDown size={20} />
      </ToolbarMenuTabLabel>
    </UnstyledButton>
  );
}

function ToolbarMenuTabLabel({
  children,
}: ToolbarRowProps) {
  return (
    <Group gap={6} wrap="nowrap">
      {children}
    </Group>
  );
}

function ToolbarActions() {
  return (
    <Group gap="lg" wrap="nowrap">
      <IconArrowBackUp size={28} stroke={1} />
      <IconDeviceFloppy size={28} stroke={1} />
      <IconSearch size={28} stroke={1} />
    </Group>
  );
}

type ActiveMegamenuProps = {
  activeMenu: MenuKey;
  selectedViewMode:
    | "Index Mode"
    | "Form Mode"
    | "In Context Mode";
  onSelectViewMode: (
    mode:
      | "Index Mode"
      | "Form Mode"
      | "In Context Mode"
  ) => void;
  showFormIndex: boolean;
  onToggleFormIndex: () => void;
  showInContextIndex: boolean;
  onToggleInContextIndex: () => void;
  showPath: boolean;
  onToggleShowPath: () => void;
};

function ActiveMegamenu({
  activeMenu,
  selectedViewMode,
  onSelectViewMode,
  showFormIndex,
  onToggleFormIndex,
  showInContextIndex,
  onToggleInContextIndex,
  showPath,
  onToggleShowPath,
}: ActiveMegamenuProps) {
  if (!activeMenu) {
    return null;
  }

  return (
    <Paper
      radius={0}
      px="xl"
      py="lg"
      bg="gray.0"
      style={{
        borderBottom:
          "1px solid var(--mantine-color-indigo-2)",
      }}
    >
      <Stack gap="sm">
        {activeMenu === "view" ? (
          <MegamenuView
            selectedMode={selectedViewMode}
            onSelectMode={onSelectViewMode}
            showFormIndex={showFormIndex}
            onToggleFormIndex={onToggleFormIndex}
            showInContextIndex={showInContextIndex}
            onToggleInContextIndex={
              onToggleInContextIndex
            }
            showPath={showPath}
            onToggleShowPath={onToggleShowPath}
          />
        ) : activeMenu === "actions" ? (
          <MegamenuActions />
        ) : activeMenu === "publish" ? (
          <MegamenuPublish />
        ) : activeMenu === "new" ? (
          <MegamenuNew />
        ) : null}
      </Stack>
    </Paper>
  );
}

export default function SecondaryToolbar() {
  const [activeMenu, setActiveMenu] =
    useState<MenuKey>(null);

  const hoverTimeoutRef = useRef<number | null>(null);

  const [selectedViewMode, setSelectedViewMode] =
    useState<
      "Index Mode" |
      "Form Mode" |
      "In Context Mode"
    >("Index Mode");

  const [showFormIndex, setShowFormIndex] =
    useState(false);

  const [
    showInContextIndex,
    setShowInContextIndex,
  ] = useState(false);

  const [showPath, setShowPath] =
    useState(false);

  const clearHoverTimeout = () => {
    if (hoverTimeoutRef.current) {
      window.clearTimeout(hoverTimeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    clearHoverTimeout();
    setActiveMenu(null);
  };

  const handleActivateMenu = (
    menu: Exclude<MenuKey, null>
  ) => {
    clearHoverTimeout();
    setActiveMenu(menu);
  };

  const handleHoverMenu = (
    menu: Exclude<MenuKey, null>
  ) => {
    clearHoverTimeout();

    if (activeMenu) {
      setActiveMenu(menu);
      return;
    }

    hoverTimeoutRef.current = window.setTimeout(() => {
      setActiveMenu(menu);
    }, 200);
  };

  const toolbarMenuTabsProps = {
    activeMenu,
    onActivateMenu: handleActivateMenu,
    onHoverMenu: handleHoverMenu,
  };

  const activeMegamenuProps = {
    activeMenu,
    selectedViewMode,
    onSelectViewMode: setSelectedViewMode,
    showFormIndex,
    onToggleFormIndex: () =>
      setShowFormIndex((current) => !current),
    showInContextIndex,
    onToggleInContextIndex: () =>
      setShowInContextIndex((current) => !current),
    showPath,
    onToggleShowPath: () =>
      setShowPath((current) => !current),
  };

  return (
    <DisplayGroup onMouseLeave={handleMouseLeave}>
      <ToolbarRow>
        <ToolbarMenuTabs {...toolbarMenuTabsProps} />
        <ToolbarActions />
      </ToolbarRow>
      <ActiveMegamenu {...activeMegamenuProps} />
    </DisplayGroup>
  );
}
