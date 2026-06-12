/*
 * File purpose: Tool-specific secondary toolbar that routes Edit and Preview tools to their megamenu controls.
 *
 * Imports:
 * - MegamenuView from "../tools/edit/megamenus/MegamenuView" provides the Edit View megamenu component.
 * - MegamenuActions from "../tools/edit/megamenus/MegamenuActions" provides the Edit Actions megamenu component.
 * - MegamenuPublish from "../tools/edit/megamenus/MegamenuPublish" provides the Edit Publish megamenu component.
 * - MegamenuNew from "../tools/edit/megamenus/MegamenuNew" provides the Edit New megamenu component.
 * - MegamenuPreviewActions from "../tools/preview/megamenus/MegamenuPreviewActions" provides the Preview Actions megamenu component.
 * - MegamenuPreviewAdvanced from "../tools/preview/megamenus/MegamenuPreviewAdvanced" provides the Preview Advanced megamenu component.
 * - MegamenuPreviewView from "../tools/preview/megamenus/MegamenuPreviewView" provides the Preview View megamenu component.
 * - type { PreviewDevice } from "../tools/preview/megamenus/PreviewDeviceColumn" provides the shared Preview device type.
 * - ADVANCED_OPTIONS_ID, ADVANCED_SITE_ID, from "../tools/preview/megamenus/advancedMenu" provides Preview Advanced menu configuration and field identifiers.
 * - type { MegamenuFieldValues } from "../megamenus/types" provides the shared megamenu configuration and value types.
 * - MegamenuActionItem, MegamenuColumnLayout, MegamenuCommandItem, MegamenuCommandLabel, from "../megamenus/MegamenuRenderer" provides the shared megamenu command and dropdown action presentation.
 * - ToolbarDelimiter from "./ToolbarDelimiter" provides the shared vertical separator between toolbar action groups.
 * - useEffect, useRef, useState from "react" provides React hooks, refs, component helpers, or React-only types used in this file.
 * - type { ReactNode, RefObject } from "react" provides React hooks, refs, component helpers, or React-only types used in this file.
 * - IconChevronDown, IconDeviceFloppy, IconLogin, IconRefresh, IconSearch, IconUser, IconUserCheck, IconUserCircle, IconUsers, from "@tabler/icons-react" provides icon components or icon types used by the CMS navigation UI.
 * - Box, Flex, Group, Menu, Paper, Stack, Text, UnstyledButton, from "@mantine/core" provides Mantine UI primitives, theme helpers, component types, or styling utilities used in this file.
 * - type { MegamenuItem } from "../megamenus/types" provides the shared megamenu configuration and value types.
 * - type { SelectedToolKey, ToolKey, } from "./primary-toolbar/types" provides shared toolbar tool and selection types.
 * - type { WorkspaceDomain } from "../../workspace/types" provides shared workspace domain or utility key types.
 */
import MegamenuView from "../tools/edit/megamenus/MegamenuView";
import MegamenuActions from "../tools/edit/megamenus/MegamenuActions";
import MegamenuPublish, {
  isPublishWizardComplete,
} from "../tools/edit/megamenus/MegamenuPublish";
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
import {
  MegamenuActionItem,
  MegamenuColumnLayout,
  MegamenuCommandItem,
  MegamenuCommandLabel,
} from "../megamenus/MegamenuRenderer";
import { ToolbarDelimiter } from "./ToolbarDelimiter";

import { useEffect, useRef, useState } from "react";
import type {
  MouseEvent,
  ReactNode,
  RefObject,
} from "react";

import {
  IconChevronDown,
  IconDeviceFloppy,
  IconLogin,
  IconRobot,
  IconRefresh,
  IconSearch,
  IconUser,
  IconUserCheck,
  IconUserCircle,
  IconUsers,
} from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";

import {
  Box,
  Flex,
  Group,
  Menu,
  Paper,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";

import type { MegamenuItem } from "../megamenus/types";
import type {
  SelectedToolKey,
  ToolKey,
} from "./primary-toolbar/types";
import type { WorkspaceDomain } from "../../workspace/types";

type MenuKey = string | null;

const MEGAMENU_CLOSE_DELAY_MS = 250;
const MEGAMENU_OPEN_DELAY_MS = 120;
const MEGAMENU_COMMAND_DISMISS_DELAY_MS = 260;
const PUBLISH_MENU_KEY = "publish";

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
  icon?: Icon;
  renderer: MegamenuRendererKey;
};

type SecondaryToolbarAction = Extract<
  MegamenuItem,
  { type: "command" | "dropdown" }
>;

type SecondaryToolbarProps = {
  domain: WorkspaceDomain;
  tool: SelectedToolKey;
  publishTarget: string;
  onTogglePublishingTargetVisibility: () => void;
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
    key: "new",
    label: "New",
    renderer: "edit-new",
  },
  {
    key: "actions",
    label: "Actions",
    renderer: "edit-actions",
  },
  {
    key: "publish",
    label: "Publish Now",
    icon: IconRobot,
    renderer: "edit-publish",
  },
];

const secondaryToolbarActions: SecondaryToolbarAction[] = [
  {
    type: "command",
    id: "secondary-check-in",
    label: "Check in",
    icon: IconLogin,
  },
  {
    type: "dropdown",
    id: "secondary-assign-to",
    label: "Assign to",
    icon: IconUserCheck,
  },
];

const secondaryToolbarIconActions: SecondaryToolbarAction[] = [
  {
    type: "command",
    id: "secondary-refresh",
    label: "Refresh",
    icon: IconRefresh,
  },
  {
    type: "command",
    id: "secondary-save",
    label: "Save",
    icon: IconDeviceFloppy,
  },
  {
    type: "command",
    id: "secondary-search",
    label: "Search",
    icon: IconSearch,
  },
];

const assignToOptions: SecondaryToolbarAction[] = [
  {
    type: "command",
    id: "secondary-assign-me",
    label: "Me",
    icon: IconUserCircle,
  },
  {
    type: "command",
    id: "secondary-assign-user",
    label: "User...",
    icon: IconUser,
  },
  {
    type: "command",
    id: "secondary-assign-group",
    label: "Group...",
    icon: IconUsers,
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
        label: "Preview Settings",
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
  containerRef: RefObject<HTMLDivElement | null>;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

function DisplayGroup({
  children,
  containerRef,
  onMouseEnter,
  onMouseLeave,
}: DisplayGroupProps) {
  return (
    <Box
      ref={containerRef}
      bg="white"
      onMouseEnter={onMouseEnter}
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
      px="lg"
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
  onLeaveMenu: () => void;
};

function ToolbarMenuTabs({
  menus,
  activeMenu,
  onActivateMenu,
  onHoverMenu,
  onLeaveMenu,
}: ToolbarMenuTabsProps) {
  return (
    <Group gap="lg" wrap="nowrap">
      {menus.map((menu) => (
        <ToolbarMenuTab
          key={menu.key}
          menu={menu}
          active={activeMenu === menu.key}
          onActivateMenu={onActivateMenu}
          onHoverMenu={onHoverMenu}
          onLeaveMenu={onLeaveMenu}
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
  onLeaveMenu: () => void;
};

function ToolbarMenuTab({
  menu,
  active,
  onActivateMenu,
  onHoverMenu,
  onLeaveMenu,
}: ToolbarMenuTabProps) {
  const MenuIcon = menu.icon;

  return (
    <UnstyledButton
      data-optional-click="true"
      onClick={() => onActivateMenu(menu)}
      onMouseEnter={() => onHoverMenu(menu)}
      onMouseLeave={onLeaveMenu}
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
        {MenuIcon ? (
          <MenuIcon
            size={24}
            stroke={1.5}
            style={{ flex: "0 0 24px" }}
          />
        ) : null}
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

type ToolbarActionButtonProps = {
  action: SecondaryToolbarAction;
};

function ToolbarActionButton({
  action,
}: ToolbarActionButtonProps) {
  if (action.type === "dropdown") {
    return <AssignToMenu action={action} />;
  }

  return (
    <MegamenuActionItem
      item={action}
      width="auto"
      paddingBlock={4}
      onClick={() => console.log(action.id)}
    />
  );
}

type AssignToMenuProps = {
  action: SecondaryToolbarAction;
};

function AssignToMenu({ action }: AssignToMenuProps) {
  const [opened, setOpened] = useState(false);

  const handleAssign = (option: SecondaryToolbarAction) => {
    console.log(option.id);
    setOpened(false);
  };

  return (
    <Menu
      shadow="md"
      width="target"
      position="bottom-end"
      offset={4}
      opened={opened}
      onChange={setOpened}
    >
      <Menu.Target>
        <Box component="span" style={{ display: "inline-flex" }}>
          <MegamenuActionItem
            item={action}
            width="auto"
            paddingBlock={4}
            onClick={() => {}}
          />
        </Box>
      </Menu.Target>

      <Menu.Dropdown px={12} py={12}>
        <MegamenuColumnLayout>
          {assignToOptions.map((option) => {
            const Icon = option.icon;

            return (
              <MegamenuCommandItem
                key={option.id}
                onClick={() => handleAssign(option)}
              >
                {Icon ? (
                  <Icon size={28} stroke={1} />
                ) : null}
                <MegamenuCommandLabel>
                  {option.label}
                </MegamenuCommandLabel>
              </MegamenuCommandItem>
            );
          })}
        </MegamenuColumnLayout>
      </Menu.Dropdown>
    </Menu>
  );
}

type ToolbarIconActionButtonProps = {
  action: SecondaryToolbarAction;
  onClick?: () => void;
};

function ToolbarIconActionButton({
  action,
  onClick,
}: ToolbarIconActionButtonProps) {
  return (
    <MegamenuActionItem
      item={action}
      width="auto"
      paddingBlock={4}
      showLabel={false}
      onClick={onClick ?? (() => console.log(action.id))}
    />
  );
}

type ToolbarActionsProps = {
  showReviewActions: boolean;
  onToggleReviewActions: () => void;
  onTogglePublishingTargetVisibility: () => void;
  onTogglePublishSiteScope: () => void;
};

function ToolbarActions({
  showReviewActions,
  onToggleReviewActions,
  onTogglePublishingTargetVisibility,
  onTogglePublishSiteScope,
}: ToolbarActionsProps) {
  return (
    <Group gap="md" wrap="nowrap">
      {showReviewActions ? (
        <>
          <Group gap={6} wrap="nowrap">
            {secondaryToolbarActions.map((action) => (
              <ToolbarActionButton
                key={action.id}
                action={action}
              />
            ))}
          </Group>
          <ToolbarDelimiter />
        </>
      ) : null}
      <Group gap={6} wrap="nowrap">
        {secondaryToolbarIconActions.map((action) => (
          <ToolbarIconActionButton
            key={action.id}
            action={action}
            onClick={
              action.id === "secondary-save"
                ? onToggleReviewActions
                : action.id === "secondary-refresh"
                  ? onTogglePublishingTargetVisibility
                : action.id === "secondary-search"
                  ? onTogglePublishSiteScope
                : undefined
            }
          />
        ))}
      </Group>
    </Group>
  );
}

type ActiveMegamenuProps = {
  menus: SecondaryMenu[];
  activeMenu: MenuKey;
  tool: SelectedToolKey;
  publishTarget: string;
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
  showPublishSiteScope: boolean;
  onDismiss: () => void;
};

function ActiveMegamenu({
  menus,
  activeMenu,
  tool,
  publishTarget,
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
  showPublishSiteScope,
  onDismiss,
}: ActiveMegamenuProps) {
  const activeMenuConfig =
    menus.find((menu) => menu.key === activeMenu) ??
    null;

  if (!activeMenuConfig) {
    return null;
  }

  const activeMenuIsPublish =
    activeMenuConfig.renderer === "edit-publish";
  const activeMenuUsesOwnPadding =
    activeMenuConfig.renderer !== "placeholder" &&
    !activeMenuIsPublish;
  const activeMenuContent =
    activeMenuConfig.renderer === "edit-view" ? (
      <MegamenuView
        selectedMode={selectedViewMode}
        onSelectMode={onSelectViewMode}
        showFormIndex={showFormIndex}
        onToggleFormIndex={onToggleFormIndex}
        showInContextIndex={showInContextIndex}
        onToggleInContextIndex={onToggleInContextIndex}
        showPath={showPath}
        onToggleShowPath={onToggleShowPath}
      />
    ) : activeMenuConfig.renderer === "preview-view" ? (
      <MegamenuPreviewView
        selectedDevice={selectedPreviewDevice}
        onSelectDevice={onSelectPreviewDevice}
      />
    ) : activeMenuConfig.renderer ===
      "preview-advanced" ? (
      <MegamenuPreviewAdvanced
        fieldValues={previewAdvancedFieldValues}
        onFieldChange={onChangePreviewAdvancedField}
        selectedDevice={selectedPreviewDevice}
        onSelectDevice={onSelectPreviewDevice}
        includeBrowserCookies={includeBrowserCookies}
        onToggleIncludeBrowserCookies={
          onToggleIncludeBrowserCookies
        }
        showAllPages={showAllPages}
        onToggleShowAllPages={onToggleShowAllPages}
      />
    ) : activeMenuConfig.renderer === "edit-actions" ? (
      <MegamenuActions hideSave={tool === "Folder Content"} />
    ) : activeMenuConfig.renderer ===
      "preview-actions" ? (
      <MegamenuPreviewActions />
    ) : activeMenuConfig.renderer === "edit-publish" ? (
      <MegamenuPublish
        sitePublishTarget={publishTarget}
        showSiteScope={showPublishSiteScope}
      />
    ) : activeMenuConfig.renderer === "edit-new" ? (
      <MegamenuNew />
    ) : (
      <PlaceholderMegamenu label={activeMenuConfig.label} />
    );
  const handleClick = (
    event: MouseEvent<HTMLDivElement>
  ) => {
    const target = event.target;

    if (
      target instanceof Element &&
      target.closest('[data-megamenu-command="true"]')
    ) {
      window.setTimeout(
        onDismiss,
        MEGAMENU_COMMAND_DISMISS_DELAY_MS
      );
    }
  };

  return (
    <Paper
      radius={0}
      px={
        activeMenuIsPublish || activeMenuUsesOwnPadding
          ? 0
          : "xl"
      }
      bg="white"
      onClick={handleClick}
      style={{
        position: "absolute",
        top: 52,
        left: 0,
        right: 0,
        zIndex: 20,
        paddingBlock:
          activeMenuIsPublish || activeMenuUsesOwnPadding
            ? 0
            : 32,
        borderBottom:
          "1px solid var(--mantine-color-indigo-2)",
        boxShadow: "0 16px 18px -18px rgba(61,68,109,0.45)",
      }}
    >
      {activeMenuIsPublish ? (
        activeMenuContent
      ) : (
        <Stack gap="sm">{activeMenuContent}</Stack>
      )}
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
  publishTarget,
  onTogglePublishingTargetVisibility,
}: SecondaryToolbarProps) {
  const [activeMenu, setActiveMenu] =
    useState<MenuKey>(null);

  const hoverTimeoutRef = useRef<number | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const toolbarContainerRef =
    useRef<HTMLDivElement | null>(null);

  const [selectedViewMode, setSelectedViewMode] =
    useState<
      "Index Mode" |
      "Form Mode" |
      "In Context Mode"
    >("Form Mode");

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

  const [
    showReviewActions,
    setShowReviewActions,
  ] = useState(true);
  const [
    showPublishSiteScope,
    setShowPublishSiteScope,
  ] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setActiveMenu(null);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [domain, tool]);

  const clearHoverTimeout = () => {
    if (hoverTimeoutRef.current) {
      window.clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearHoverTimeout();
      clearCloseTimeout();
    };
  }, []);

  useEffect(() => {
    if (!activeMenu) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const container = toolbarContainerRef.current;

      if (
        container &&
        event.target instanceof Node &&
        container.contains(event.target)
      ) {
        return;
      }

      clearHoverTimeout();
      clearCloseTimeout();
      setActiveMenu(null);
    };

    document.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown
      );
    };
  }, [activeMenu]);

  const handleMouseEnter = () => {
    clearCloseTimeout();
  };

  const handleMouseLeave = () => {
    clearHoverTimeout();
    clearCloseTimeout();

    if (
      activeMenu === PUBLISH_MENU_KEY &&
      !isPublishWizardComplete()
    ) {
      return;
    }

    closeTimeoutRef.current = window.setTimeout(() => {
      setActiveMenu(null);
      closeTimeoutRef.current = null;
    }, MEGAMENU_CLOSE_DELAY_MS);
  };

  const handleActivateMenu = (
    menu: SecondaryMenu
  ) => {
    clearHoverTimeout();
    clearCloseTimeout();
    setActiveMenu(menu.key);
  };

  const handleHoverMenu = (
    menu: SecondaryMenu
  ) => {
    clearHoverTimeout();
    clearCloseTimeout();

    hoverTimeoutRef.current = window.setTimeout(() => {
      setActiveMenu(menu.key);
      hoverTimeoutRef.current = null;
    }, MEGAMENU_OPEN_DELAY_MS);
  };

  const handleLeaveMenu = () => {
    clearHoverTimeout();
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
    onLeaveMenu: handleLeaveMenu,
  };

  const toolbarActionsProps = {
    showReviewActions,
    onToggleReviewActions: () =>
      setShowReviewActions((current) => !current),
    onTogglePublishingTargetVisibility,
    onTogglePublishSiteScope: () =>
      setShowPublishSiteScope((current) => !current),
  };

  const activeMegamenuProps = {
    menus,
    activeMenu,
    tool,
    publishTarget,
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
    showPublishSiteScope,
    onDismiss: () => {
      clearHoverTimeout();
      clearCloseTimeout();
      setActiveMenu(null);
    },
  };

  return (
    <DisplayGroup
      containerRef={toolbarContainerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ToolbarRow>
        <ToolbarMenuTabs {...toolbarMenuTabsProps} />
        <ToolbarActions {...toolbarActionsProps} />
      </ToolbarRow>
      <ActiveMegamenu {...activeMegamenuProps} />
    </DisplayGroup>
  );
}
