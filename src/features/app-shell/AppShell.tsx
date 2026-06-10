/*
 * File purpose: Main CMS shell controller that owns domain, utility, tree selection, toolbar, and panel sizing state.
 *
 * Imports:
 * - useState from "react" provides React hooks, refs, component helpers, or React-only types used in this file.
 * - type { ReactNode } from "react" provides React hooks, refs, component helpers, or React-only types used in this file.
 * - Box, Flex from "@mantine/core" provides Mantine UI primitives, theme helpers, component types, or styling utilities used in this file.
 * - IconAccessible, IconBinaryTree2, IconChartBar, IconCircleDot, IconCode, IconCpu, IconEye, IconFileText, IconFolder, IconHistory, IconLayoutDashboard, IconLayoutGridAdd, IconLayoutSidebar, IconPencilCog, IconPhoto, IconSearch, IconSettings, IconSitemap, IconTags, IconTarget, IconTargetArrow, IconUserCheck, IconUserShield, IconWand, from "@tabler/icons-react" provides icon components or icon types used by the CMS navigation UI.
 * - type { Icon } from "@tabler/icons-react" provides icon components or icon types used by the CMS navigation UI.
 * - IconFontAwesomeAi from "./icons/IconFontAwesomeAi" provides the custom AI utility icon used in the Site utility palette.
 * - ContentWorkspace from "../content-workspace/ContentWorkspace" provides the main content workspace region beside the left panel.
 * - type { SelectedToolKey, ToolbarTool, ToolKey, } from "../content-workspace/toolbars/primary-toolbar/types" provides shared toolbar tool and selection types.
 * - LeftPanel from "../left-panel/LeftPanel" provides the resizable left navigation panel.
 * - assetsTreeData, editTreeData, findTreeNodeById, from "../left-panel/site-tree/siteTreeData" provides prototype tree data and lookup helpers for selected nodes.
 * - type { SiteTreeNode } from "../left-panel/site-tree/types" provides shared data types used by this feature.
 * - type { WorkspaceDomain, WorkspaceUtilityKey, } from "../workspace/types" provides shared workspace domain or utility key types.
 * - ProductToolbar from "../content-workspace/toolbars/product-toolbar/ProductToolbar" provides the top product toolbar component.
 * - WorkspaceSplitter from "./WorkspaceSplitter" provides the draggable splitter between navigation and workspace regions.
 */
import { useState } from "react";
import type { ReactNode } from "react";

import { Box, Flex } from "@mantine/core";
import {
  IconAccessible,
  IconBinaryTree2,
  IconChartBar,
  IconCircleDot,
  IconCode,
  IconCpu,
  IconEye,
  IconFileText,
  IconFolder,
  IconHistory,
  IconLayoutDashboard,
  IconLayoutGridAdd,
  IconLayoutSidebar,
  IconPencilCog,
  IconPhoto,
  IconSearch,
  IconSettings,
  IconSitemap,
  IconTags,
  IconTarget,
  IconTargetArrow,
  IconUserCheck,
  IconUserShield,
  IconWand,
} from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";

import { IconFontAwesomeAi } from "./icons/IconFontAwesomeAi";
import { ContentWorkspace } from "../content-workspace/ContentWorkspace";
import type {
  SelectedToolKey,
  ToolbarTool,
  ToolKey,
} from "../content-workspace/toolbars/primary-toolbar/types";
import { LeftPanel } from "../left-panel/LeftPanel";
import {
  assetsTreeData,
  editTreeData,
  findTreeNodeById,
} from "../left-panel/site-tree/siteTreeData";
import type { SiteTreeNode } from "../left-panel/site-tree/types";
import type {
  WorkspaceDomain,
  WorkspaceUtilityKey,
} from "../workspace/types";
import { ProductToolbar } from "../content-workspace/toolbars/product-toolbar/ProductToolbar";
import { WorkspaceSplitter } from "./WorkspaceSplitter";

const LEFT_PANEL_INITIAL_WIDTH = 414;
const LEFT_PANEL_MIN_WIDTH = 348;
const DEFAULT_EDIT_NODE_ID = "undergraduate";
const DEFAULT_ASSETS_NODE_ID = "campus-hero.png";

type TreeConfig = {
  title: string;
  nodes: SiteTreeNode[];
  defaultNodeId: string;
};

type DomainConfig = {
  label: string;
  icon: Icon;
  tree: TreeConfig | null;
  defaultContentTool: SelectedToolKey;
  folderTools?: ToolbarTool[];
  contentTools: ToolbarTool[];
  defaultUtility: WorkspaceUtilityKey;
  utilities: DomainUtility[];
};

type DomainUtility = {
  id: WorkspaceUtilityKey;
  label: string;
  icon: Icon;
  dividerAfter?: boolean;
};

type ContentToolContext = "folder" | "content";

type DomainToolSelection = Record<
  ContentToolContext,
  SelectedToolKey
>;

function getDefaultFolderTool(
  config: DomainConfig
): SelectedToolKey {
  return config.folderTools?.[0]?.label ?? null;
}

const domainConfigs: Record<
  WorkspaceDomain,
  DomainConfig
> = {
  dashboard: {
    label: "Dashboard",
    icon: IconLayoutDashboard,
    tree: null,
    defaultContentTool: null,
    defaultUtility: "dashboard",
    utilities: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: IconLayoutDashboard,
      },
    ],
    contentTools: [],
  },
  site: {
    label: "Site",
    icon: IconLayoutSidebar,
    tree: {
      title: "Site Tree",
      nodes: editTreeData,
      defaultNodeId: DEFAULT_EDIT_NODE_ID,
    },
    defaultContentTool: "Edit",
    folderTools: [
      {
        label: "Folder Content",
        icon: <IconFolder size={28} stroke={1} />,
      },
      {
        label: "Properties",
        icon: <IconSettings size={28} stroke={1} />,
      },
    ],
    defaultUtility: "tree",
    utilities: [
      {
        id: "tree",
        label: "Site Tree",
        icon: IconSitemap,
      },
      {
        id: "assets",
        label: "Asset Tree",
        icon: IconPhoto,
      },
      {
        id: "taxonomy",
        label: "Taxonomy",
        icon: IconTags,
      },
      {
        id: "ai",
        label: "AI",
        icon: IconFontAwesomeAi,
      },
      {
        id: "ctp",
        label: "CT&P",
        icon: IconTarget,
      },
      {
        id: "workflow",
        label: "Assignments",
        icon: IconUserCheck,
      },
      {
        id: "search",
        label: "Search",
        icon: IconSearch,
      },
      {
        id: "tools",
        label: "Mystery Feature",
        icon: IconWand,
      },
    ],
    contentTools: [
      {
        label: "Edit",
        icon: <IconFileText size={28} stroke={1} />,
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
    ],
  },
  assets: {
    label: "Assets",
    icon: IconPhoto,
    tree: {
      title: "Asset Tree",
      nodes: assetsTreeData,
      defaultNodeId: DEFAULT_ASSETS_NODE_ID,
    },
    defaultContentTool: "Overview",
    folderTools: [
      {
        label: "Folder Content",
        icon: <IconFolder size={28} stroke={1} />,
      },
      {
        label: "Properties",
        icon: <IconSettings size={28} stroke={1} />,
      },
      {
        label: "Authoring",
        icon: <IconPencilCog size={28} stroke={1} />,
      },
    ],
    defaultUtility: "tree",
    utilities: [
      {
        id: "tree",
        label: "Asset Tree",
        icon: IconBinaryTree2,
      },
      {
        id: "search",
        label: "Search",
        icon: IconSearch,
      },
      {
        id: "metadata",
        label: "Metadata",
        icon: IconTags,
      },
      {
        id: "automation",
        label: "Automation",
        icon: IconCpu,
      },
    ],
    contentTools: [
      {
        label: "Overview",
        icon: <IconPhoto size={28} stroke={1} />,
      },
      {
        label: "Edit",
        icon: <IconFileText size={28} stroke={1} />,
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
        label: "Properties",
        icon: <IconSettings size={28} stroke={1} />,
      },
      {
        label: "DITA Properties",
        icon: <IconCode size={28} stroke={1} />,
      },
      {
        label: "Authoring",
        icon: <IconPencilCog size={28} stroke={1} />,
      },
    ],
  },
  ctp: {
    label: "CT&P",
    icon: IconTargetArrow,
    tree: null,
    defaultContentTool: null,
    defaultUtility: "campaigns",
    utilities: [
      {
        id: "campaigns",
        label: "Campaigns",
        icon: IconTargetArrow,
      },
      {
        id: "taxonomy",
        label: "Taxonomy",
        icon: IconTags,
      },
      {
        id: "records",
        label: "Records",
        icon: IconCircleDot,
      },
    ],
    contentTools: [],
  },
  administration: {
    label: "Admin",
    icon: IconUserShield,
    tree: null,
    defaultContentTool: "Users",
    defaultUtility: "users",
    utilities: [
      {
        id: "users",
        label: "Users",
        icon: IconUserShield,
      },
      {
        id: "workflow",
        label: "Workflow",
        icon: IconUserCheck,
      },
      {
        id: "settings",
        label: "Settings",
        icon: IconSettings,
      },
    ],
    contentTools: [
      {
        label: "Users",
        icon: <IconUserShield size={28} stroke={1} />,
      },
      {
        label: "Roles",
        icon: <IconAccessible size={28} stroke={1} />,
      },
      {
        label: "Settings",
        icon: <IconSettings size={28} stroke={1} />,
      },
    ],
  },
  apps: {
    label: "Apps",
    icon: IconLayoutGridAdd,
    tree: null,
    defaultContentTool: "Apps",
    defaultUtility: "apps",
    utilities: [
      {
        id: "apps",
        label: "Apps",
        icon: IconLayoutGridAdd,
      },
      {
        id: "search",
        label: "Search",
        icon: IconSearch,
      },
      {
        id: "tools",
        label: "Tools",
        icon: IconWand,
      },
    ],
    contentTools: [
      {
        label: "Apps",
        icon: <IconLayoutGridAdd size={28} stroke={1} />,
      },
      {
        label: "Search",
        icon: <IconSearch size={28} stroke={1} />,
      },
      {
        label: "Properties",
        icon: <IconSettings size={28} stroke={1} />,
      },
    ],
  },
};

const domainItems = (
  [
    "dashboard",
    "site",
    "assets",
    "ctp",
    "administration",
    "apps",
  ] satisfies WorkspaceDomain[]
).map((domain) => ({
  id: domain,
  label: domainConfigs[domain].label,
  icon: domainConfigs[domain].icon,
}));

type DisplayGroupProps = {
  children: ReactNode;
};

function DisplayGroup({ children }: DisplayGroupProps) {
  return (
    <Box
      h="100vh"
      bg="gray.0"
      style={{
        display: "grid",
        gridTemplateRows: "68px minmax(0, 1fr)",
        gridTemplateColumns: "auto 1px minmax(0, 1fr)",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      {children}
    </Box>
  );
}

type ProductToolbarSlotProps = {
  children: ReactNode;
};

function ProductToolbarSlot({
  children,
}: ProductToolbarSlotProps) {
  return (
    <Box style={{ gridColumn: "1 / -1", gridRow: 1 }}>
      {children}
    </Box>
  );
}

type LeftPanelSlotProps = ProductToolbarSlotProps;

function LeftPanelSlot({ children }: LeftPanelSlotProps) {
  return (
    <Box
      style={{
        gridColumn: 1,
        gridRow: 2,
        minHeight: 0,
      }}
    >
      {children}
    </Box>
  );
}

type WorkspaceSplitterSlotProps = ProductToolbarSlotProps;

function WorkspaceSplitterSlot({
  children,
}: WorkspaceSplitterSlotProps) {
  return (
    <Box
      style={{
        gridColumn: 2,
        gridRow: 2,
        minHeight: 0,
        position: "relative",
      }}
    >
      {children}
    </Box>
  );
}

type ContentWorkspaceSlotProps = ProductToolbarSlotProps;

function ContentWorkspaceSlot({
  children,
}: ContentWorkspaceSlotProps) {
  return (
    <Flex
      h="100%"
      style={{
        gridColumn: 3,
        gridRow: 2,
        minHeight: 0,
        minWidth: 0,
      }}
    >
      {children}
    </Flex>
  );
}

export function AppShell() {
  const [productToolbarMode, setProductToolbarMode] =
    useState<"default" | "search">("default");
  const [selectedDomain, setSelectedDomain] =
    useState<WorkspaceDomain>("site");
  const [selectedTools, setSelectedTools] = useState<
    Record<WorkspaceDomain, DomainToolSelection>
  >({
    dashboard: {
      folder: getDefaultFolderTool(
        domainConfigs.dashboard
      ),
      content: domainConfigs.dashboard.defaultContentTool,
    },
    site: {
      folder: getDefaultFolderTool(domainConfigs.site),
      content: domainConfigs.site.defaultContentTool,
    },
    assets: {
      folder: getDefaultFolderTool(domainConfigs.assets),
      content: domainConfigs.assets.defaultContentTool,
    },
    ctp: {
      folder: getDefaultFolderTool(domainConfigs.ctp),
      content: domainConfigs.ctp.defaultContentTool,
    },
    administration: {
      folder: getDefaultFolderTool(
        domainConfigs.administration
      ),
      content:
        domainConfigs.administration.defaultContentTool,
    },
    apps: {
      folder: getDefaultFolderTool(domainConfigs.apps),
      content: domainConfigs.apps.defaultContentTool,
    },
  });
  const [selectedUtilities, setSelectedUtilities] =
    useState<
    Record<WorkspaceDomain, WorkspaceUtilityKey>
    >({
      dashboard: domainConfigs.dashboard.defaultUtility,
      site: domainConfigs.site.defaultUtility,
      assets: domainConfigs.assets.defaultUtility,
      ctp: domainConfigs.ctp.defaultUtility,
      administration:
        domainConfigs.administration.defaultUtility,
      apps: domainConfigs.apps.defaultUtility,
    });
  const [
    demoWorkspaceVisible,
    setDemoWorkspaceVisible,
  ] = useState(true);
  const [publishTarget, setPublishTarget] =
    useState("production");
  const [
    showPublishingTarget,
    setShowPublishingTarget,
  ] = useState(false);

  const [leftPaneWidth, setLeftPaneWidth] = useState(
    LEFT_PANEL_INITIAL_WIDTH
  );
  const [selectedNodeIds, setSelectedNodeIds] = useState<
    Record<WorkspaceDomain, string | null>
  >({
    dashboard: null,
    site: DEFAULT_EDIT_NODE_ID,
    assets: DEFAULT_ASSETS_NODE_ID,
    ctp: null,
    administration: null,
    apps: null,
  });

  const domainConfig =
    domainConfigs[selectedDomain];
  const selectedUtilityId =
    selectedUtilities[selectedDomain] ??
    domainConfig.defaultUtility;
  const selectedUtility =
    domainConfig.utilities.find(
      (utility) => utility.id === selectedUtilityId
    ) ?? domainConfig.utilities[0];
  const selectedTreeConfig =
    selectedUtility?.id === "tree"
      ? domainConfig.tree
      : null;
  const selectedNodeId = selectedTreeConfig
    ? selectedNodeIds[selectedDomain] ??
      selectedTreeConfig.defaultNodeId
    : null;
  const selectedNode = selectedTreeConfig
    ? findTreeNodeById(
        selectedNodeId,
        selectedTreeConfig.nodes
      )
    : null;
  const selectedNodeIsFolder = Boolean(
    selectedNode?.children?.length
  );
  const activeTools =
    selectedTreeConfig &&
    selectedNodeIsFolder &&
    domainConfig.folderTools
      ? domainConfig.folderTools
      : domainConfig.contentTools;
  const activeToolContext =
    selectedTreeConfig &&
    selectedNodeIsFolder &&
    domainConfig.folderTools
      ? "folder"
      : "content";
  const selectedToolCandidate =
    selectedTools[selectedDomain]?.[
      activeToolContext
    ] ??
    (activeToolContext === "folder"
      ? getDefaultFolderTool(domainConfig)
      : domainConfig.defaultContentTool);
  const selectedTool =
    activeTools.some(
      (tool) => tool.label === selectedToolCandidate
    )
      ? selectedToolCandidate
      : activeTools[0]?.label ?? null;

  const handleSelectNode = (nodeId: string) => {
    const nextNode = selectedTreeConfig
      ? findTreeNodeById(
          nodeId,
          selectedTreeConfig.nodes
        )
      : null;
    const nextNodeIsFolder = Boolean(
      nextNode?.children?.length
    );
    const nextToolContext =
      selectedTreeConfig &&
      nextNodeIsFolder &&
      domainConfig.folderTools
        ? "folder"
        : "content";
    const nextTools =
      nextToolContext === "folder"
        ? domainConfig.folderTools ?? []
        : domainConfig.contentTools;

    setSelectedNodeIds((current) => ({
      ...current,
      [selectedDomain]: nodeId,
    }));

    if (nextToolContext !== activeToolContext) {
      setSelectedTools((current) => {
        const domainCurrent = current[selectedDomain] ?? {};

        // If there's already a selection for the target context, don't overwrite it.
        if (domainCurrent[nextToolContext]) {
          return current;
        }

        return {
          ...current,
          [selectedDomain]: {
            ...domainCurrent,
            [nextToolContext]: nextTools[0]?.label ?? null,
          },
        };
      });
    }
  };

  const handleSelectTool = (tool: ToolKey) => {
    setSelectedTools((current) => ({
      ...current,
      [selectedDomain]: {
        ...current[selectedDomain],
        [activeToolContext]: tool,
      },
    }));
  };

  const handleSelectDomain = (
    domain: WorkspaceDomain
  ) => {
    setSelectedDomain(domain);

    if (domain === "site") {
      setSelectedUtilities((current) => ({
        ...current,
        site: domainConfigs.site.defaultUtility,
      }));
    }
  };

  const handleSelectUtility = (
    utilityId: WorkspaceUtilityKey
  ) => {
    setSelectedUtilities((current) => ({
      ...current,
      [selectedDomain]: utilityId,
    }));
  };

  const productToolbarProps = {
    mode: productToolbarMode,
    demoWorkspaceVisible,
    domainItems,
    selectedDomain,
    onGoTo: () => setProductToolbarMode("search"),
    onCloseSearch: () =>
      setProductToolbarMode("default"),
    onSelectDomain: handleSelectDomain,
    onToggleDemoWorkspace: () =>
      setDemoWorkspaceVisible((visible) => !visible),
  };

  const leftPanelProps = {
    width: leftPaneWidth,
    title: domainConfig.label,
    icon: domainConfig.icon,
    nodes: selectedTreeConfig?.nodes ?? null,
    utilityItems: domainConfig.utilities,
    selectedUtilityId,
    selectedNodeId,
    publishTarget,
    showPublishingTarget,
    onSelectUtility: handleSelectUtility,
    onSelectNode: handleSelectNode,
    onChangePublishTarget: setPublishTarget,
  };

  const workspaceSplitterProps = {
    value: leftPaneWidth,
    onChange: setLeftPaneWidth,
    min: LEFT_PANEL_MIN_WIDTH,
  };

  const contentWorkspaceProps = {
    domain: selectedDomain,
    selectedNodeLabel:
      selectedNode?.label ??
      (selectedTreeConfig
        ? "No selection"
        : domainConfig.label),
    selectedNodeXId: selectedNode?.xId,
    selectedTool,
    demoWorkspaceVisible,
    publishTarget,
    tools: activeTools,
    onSelectTool: handleSelectTool,
    onTogglePublishingTargetVisibility: () =>
      setShowPublishingTarget((current) => !current),
  };

  return (
    <DisplayGroup>
      <ProductToolbarSlot>
        <ProductToolbar {...productToolbarProps} />
      </ProductToolbarSlot>
      <LeftPanelSlot>
        <LeftPanel {...leftPanelProps} />
      </LeftPanelSlot>
      <WorkspaceSplitterSlot>
        <WorkspaceSplitter {...workspaceSplitterProps} />
      </WorkspaceSplitterSlot>
      <ContentWorkspaceSlot>
        <ContentWorkspace {...contentWorkspaceProps} />
      </ContentWorkspaceSlot>
    </DisplayGroup>
  );
}
