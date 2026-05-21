/*
 * Secondary content toolbar.
 * - Shows menus for the active workspace domain and content tool.
 * - Manages hover/click menu activation and renders the active megamenu panel.
 */
import MegamenuView from "../tools/edit/megamenus/MegamenuView";
import MegamenuActions from "../tools/edit/megamenus/MegamenuActions";
import MegamenuPublish from "../tools/edit/megamenus/MegamenuPublish";
import MegamenuNew from "../tools/edit/megamenus/MegamenuNew";
import MegamenuPreviewActions from "../tools/preview/megamenus/MegamenuPreviewActions";
import MegamenuPreviewAdvanced from "../tools/preview/megamenus/MegamenuPreviewAdvanced";
import MegamenuPreviewView from "../tools/preview/megamenus/MegamenuPreviewView";
import type { PreviewDevice } from "../tools/preview/megamenus/PreviewDeviceColumn";
import {
  ADVANCED_OPTIONS_ID,
  ADVANCED_SITE_ID,
} from "../tools/preview/megamenus/advancedMenu";
import type { MegamenuFieldValues } from "../megamenus/types";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import {
  IconArrowBackUp,
  IconChevronDown,
  IconDeviceDesktop,
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

import type {
  SelectedToolKey,
  ToolKey,
} from "./primary-toolbar/types";
import type { WorkspaceDomain } from "../../workspace/types";

type MenuKey = string | null;

type MegamenuRendererKey =
  | "edit-view"
  | "preview-view"
  | "preview-advanced"
  | "edit-actions"
  | "preview-actions"
  | "edit-publish"
  | "edit-new"
  | "placeholder";

type SecondaryMenu = {
  key: string;
  label: string;
  renderer: MegamenuRendererKey;
};

type SecondaryToolbarProps = {
  domain: WorkspaceDomain;
  tool: SelectedToolKey;
};

function placeholderMenus(
  ...labels: string[]
): SecondaryMenu[] {
  return labels.map((label) => ({
    key: label.toLowerCase().replaceAll(" ", "-"),
    label,
    renderer: "placeholder",
  }));
}

const editMenus: SecondaryMenu[] = [
  {
    key: "view",
    label: "View",
    renderer: "edit-view",
  },
  {
    key: "actions",
    label: "Actions",
    renderer: "edit-actions",
  },
  {
    key: "publish",
    label: "Publish",
    renderer: "edit-publish",
  },
  {
    key: "new",
    label: "New",
    renderer: "edit-new",
  },
];

const secondaryMenusByDomain: Record<
  WorkspaceDomain,
  Record<ToolKey, SecondaryMenu[]>
> = {
  dashboard: {},
  site: {
    "Folder Content": editMenus,
    Edit: editMenus,
    Preview: [
      {
        key: "view",
        label: "View",
        renderer: "preview-view",
      },
      {
        key: "simulate",
        label: "Simulate",
        renderer: "preview-advanced",
      },
      {
        key: "actions",
        label: "Actions",
        renderer: "preview-actions",
      },
      {
        key: "publish",
        label: "Publish",
        renderer: "edit-publish",
      },
    ],
    Categorize: placeholderMenus(
      "Categories",
      "Tags",
      "Audience"
    ),
    History: placeholderMenus(
      "Versions",
      "Compare",
      "Restore"
    ),
    XML: placeholderMenus("Source", "Validate", "Export"),
    Properties: placeholderMenus(
      "General",
      "SEO",
      "Advanced"
    ),
    Analytics: placeholderMenus(
      "Traffic",
      "Engagement",
      "Reports"
    ),
    Accessibility: placeholderMenus(
      "Checks",
      "Issues",
      "Guidance"
    ),
  },
  assets: {
    "Folder Content": editMenus,
    Overview: editMenus,
    Edit: placeholderMenus("Edit", "Replace", "Download"),
    Categorize: placeholderMenus(
      "Categories",
      "Tags",
      "Rights"
    ),
    History: placeholderMenus(
      "Versions",
      "Activity",
      "Restore"
    ),
    Properties: placeholderMenus(
      "General",
      "Security",
      "Advanced"
    ),
    "DITA Properties": placeholderMenus(
      "Topics",
      "Maps",
      "Metadata"
    ),
    Authoring: placeholderMenus(
      "Checkout",
      "Review",
      "Publish"
    ),
  },
  ctp: {
    Campaigns: placeholderMenus(
      "Campaigns",
      "Segments",
      "Schedule"
    ),
    Taxonomy: placeholderMenus(
      "Terms",
      "Groups",
      "Import"
    ),
    Reports: placeholderMenus(
      "Overview",
      "Performance",
      "Export"
    ),
  },
  administration: {
    Users: placeholderMenus("Users", "Groups", "Invite"),
    Roles: placeholderMenus(
      "Roles",
      "Permissions",
      "Policies"
    ),
    Settings: placeholderMenus(
      "General",
      "Security",
      "Integrations"
    ),
  },
  apps: {
    Apps: placeholderMenus("Installed", "Browse", "Manage"),
    Search: placeholderMenus("Index", "Rules", "Logs"),
    Properties: placeholderMenus(
      "General",
      "Access",
      "Advanced"
    ),
  },
};

type DisplayGroupProps = {
  children: ReactNode;
  onMouseLeave: () => void;
};

function DisplayGroup({
  children,
  onMouseLeave,
}: DisplayGroupProps) {
  return (
    <Box
      bg="white"
      onMouseLeave={onMouseLeave}
      style={{
        position: "relative",
        zIndex: 20,
        flexShrink: 0,
      }}
    >
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
  menus: SecondaryMenu[];
  activeMenu: MenuKey;
  onActivateMenu: (
    menu: SecondaryMenu
  ) => void;
  onHoverMenu: (
    menu: SecondaryMenu
  ) => void;
};

function ToolbarMenuTabs({
  menus,
  activeMenu,
  onActivateMenu,
  onHoverMenu,
}: ToolbarMenuTabsProps) {
  return (
    <Group gap="xl" wrap="nowrap">
      {menus.map((menu) => (
        <ToolbarMenuTab
          key={menu.key}
          menu={menu}
          active={activeMenu === menu.key}
          onActivateMenu={onActivateMenu}
          onHoverMenu={onHoverMenu}
        />
      ))}
    </Group>
  );
}

type ToolbarMenuTabProps = {
  menu: SecondaryMenu;
  active: boolean;
  onActivateMenu: (
    menu: SecondaryMenu
  ) => void;
  onHoverMenu: (
    menu: SecondaryMenu
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
        <Text>{menu.label}</Text>
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

type ToolbarActionsProps = {
  domain: WorkspaceDomain;
  tool: SelectedToolKey;
};

function ToolbarActions({
  domain,
  tool,
}: ToolbarActionsProps) {
  const showPreviewAction =
    domain === "site" && tool === "Preview";

  return (
    <Group gap="lg" wrap="nowrap">
      {showPreviewAction ? (
        <>
          <IconDeviceDesktop size={28} stroke={1} />
          <Box
            h={26}
            w={1}
            bg="asxGray.4"
            aria-hidden="true"
          />
        </>
      ) : null}
      <IconArrowBackUp size={28} stroke={1} />
      <IconDeviceFloppy size={28} stroke={1} />
      <IconSearch size={28} stroke={1} />
    </Group>
  );
}

type ActiveMegamenuProps = {
  menus: SecondaryMenu[];
  activeMenu: MenuKey;
  tool: SelectedToolKey;
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
  selectedPreviewDevice: PreviewDevice;
  onSelectPreviewDevice: (device: PreviewDevice) => void;
  previewAdvancedFieldValues: MegamenuFieldValues;
  onChangePreviewAdvancedField: (
    itemId: string,
    value: string
  ) => void;
  includeBrowserCookies: boolean;
  onToggleIncludeBrowserCookies: () => void;
  showAllPages: boolean;
  onToggleShowAllPages: () => void;
};

function ActiveMegamenu({
  menus,
  activeMenu,
  tool,
  selectedViewMode,
  onSelectViewMode,
  showFormIndex,
  onToggleFormIndex,
  showInContextIndex,
  onToggleInContextIndex,
  showPath,
  onToggleShowPath,
  selectedPreviewDevice,
  onSelectPreviewDevice,
  previewAdvancedFieldValues,
  onChangePreviewAdvancedField,
  includeBrowserCookies,
  onToggleIncludeBrowserCookies,
  showAllPages,
  onToggleShowAllPages,
}: ActiveMegamenuProps) {
  const activeMenuConfig =
    menus.find((menu) => menu.key === activeMenu) ??
    null;

  if (!activeMenuConfig) {
    return null;
  }

  return (
    <Paper
      radius={0}
      px="xl"
      py="lg"
      bg="gray.0"
      style={{
        position: "absolute",
        top: 52,
        left: 0,
        right: 0,
        zIndex: 20,
        borderBottom:
          "1px solid var(--mantine-color-indigo-2)",
        boxShadow: "0 12px 28px rgba(61,68,109,0.12)",
      }}
    >
      <Stack gap="sm">
        {activeMenuConfig.renderer === "edit-view" ? (
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
        ) : activeMenuConfig.renderer ===
          "preview-view" ? (
          <MegamenuPreviewView
            selectedDevice={selectedPreviewDevice}
            onSelectDevice={onSelectPreviewDevice}
          />
        ) : activeMenuConfig.renderer ===
          "preview-advanced" ? (
          <MegamenuPreviewAdvanced
            fieldValues={previewAdvancedFieldValues}
            onFieldChange={
              onChangePreviewAdvancedField
            }
            selectedDevice={selectedPreviewDevice}
            onSelectDevice={onSelectPreviewDevice}
            includeBrowserCookies={
              includeBrowserCookies
            }
            onToggleIncludeBrowserCookies={
              onToggleIncludeBrowserCookies
            }
            showAllPages={showAllPages}
            onToggleShowAllPages={onToggleShowAllPages}
          />
        ) : activeMenuConfig.renderer ===
          "edit-actions" ? (
          <MegamenuActions
            hideSave={tool === "Folder Content"}
          />
        ) : activeMenuConfig.renderer ===
          "preview-actions" ? (
          <MegamenuPreviewActions />
        ) : activeMenuConfig.renderer ===
          "edit-publish" ? (
          <MegamenuPublish />
        ) : activeMenuConfig.renderer === "edit-new" ? (
          <MegamenuNew />
        ) : (
          <PlaceholderMegamenu
            label={activeMenuConfig.label}
          />
        )}
      </Stack>
    </Paper>
  );
}

type PlaceholderMegamenuProps = {
  label: string;
};

function PlaceholderMegamenu({
  label,
}: PlaceholderMegamenuProps) {
  return (
    <Text size="sm" c="asxGray.7" fw={500}>
      {label} menu
    </Text>
  );
}

export default function SecondaryToolbar({
  domain,
  tool,
}: SecondaryToolbarProps) {
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

  const [
    selectedPreviewDevice,
    setSelectedPreviewDevice,
  ] = useState<PreviewDevice>("Desktop");

  const [
    previewAdvancedFieldValues,
    setPreviewAdvancedFieldValues,
  ] = useState<MegamenuFieldValues>({
    [ADVANCED_SITE_ID]: "Default",
    [ADVANCED_OPTIONS_ID]: "Default",
  });

  const [
    includeBrowserCookies,
    setIncludeBrowserCookies,
  ] = useState(true);

  const [showAllPages, setShowAllPages] =
    useState(true);

  useEffect(() => {
    setActiveMenu(null);
  }, [domain, tool]);

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
    menu: SecondaryMenu
  ) => {
    clearHoverTimeout();
    setActiveMenu(menu.key);
  };

  const handleHoverMenu = (
    menu: SecondaryMenu
  ) => {
    clearHoverTimeout();

    if (activeMenu) {
      setActiveMenu(menu.key);
      return;
    }

    hoverTimeoutRef.current = window.setTimeout(() => {
      setActiveMenu(menu.key);
    }, 200);
  };

  const handleChangePreviewAdvancedField = (
    itemId: string,
    value: string
  ) => {
    setPreviewAdvancedFieldValues((current) => ({
      ...current,
      [itemId]: value,
    }));
  };

  const toolMenus =
    tool ? secondaryMenusByDomain[domain][tool] ?? [] : [];
  const menus =
    domain === "assets"
      ? toolMenus.filter((menu) => menu.key !== "view")
      : toolMenus;

  const toolbarMenuTabsProps = {
    menus,
    activeMenu,
    onActivateMenu: handleActivateMenu,
    onHoverMenu: handleHoverMenu,
  };

  const toolbarActionsProps = {
    domain,
    tool,
  };

  const activeMegamenuProps = {
    menus,
    activeMenu,
    tool,
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
    selectedPreviewDevice,
    onSelectPreviewDevice: setSelectedPreviewDevice,
    previewAdvancedFieldValues,
    onChangePreviewAdvancedField:
      handleChangePreviewAdvancedField,
    includeBrowserCookies,
    onToggleIncludeBrowserCookies: () =>
      setIncludeBrowserCookies((current) => !current),
    showAllPages,
    onToggleShowAllPages: () =>
      setShowAllPages((current) => !current),
  };

  return (
    <DisplayGroup onMouseLeave={handleMouseLeave}>
      <ToolbarRow>
        <ToolbarMenuTabs {...toolbarMenuTabsProps} />
        <ToolbarActions {...toolbarActionsProps} />
      </ToolbarRow>
      <ActiveMegamenu {...activeMegamenuProps} />
    </DisplayGroup>
  );
}
