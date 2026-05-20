/*
 * Main CMS shell layout.
 * - Owns top-level workspace state such as selected tree node, active tool, and panel width.
 * - Renders the product toolbar, left panel, splitter, and content workspace.
 */
import { useState } from "react";
import type { ReactNode } from "react";

import { Box, Flex } from "@mantine/core";
import {
  IconAccessible,
  IconBinaryTree2,
  IconChartBar,
  IconCircleArrowUp,
  IconCircleDot,
  IconCode,
  IconCpu,
  IconEye,
  IconFileText,
  IconHistory,
  IconLayoutGridAdd,
  IconPhoto,
  IconSearch,
  IconSettings,
  IconSitemap,
  IconTags,
  IconTargetArrow,
  IconUserCheck,
  IconUserShield,
  IconWand,
} from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";

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
const DEFAULT_EDIT_NODE_ID = "central-university";
const DEFAULT_ASSETS_NODE_ID = "asset-library";

type TreeConfig = {
  title: string;
  nodes: SiteTreeNode[];
  defaultNodeId: string;
};

type DomainConfig = {
  label: string;
  tree: TreeConfig | null;
  defaultTool: SelectedToolKey;
  tools: ToolbarTool[];
  defaultUtility: WorkspaceUtilityKey;
  utilities: DomainUtility[];
};

type DomainUtility = {
  id: WorkspaceUtilityKey;
  label: string;
  icon: Icon;
};

const domainConfigs: Record<
  WorkspaceDomain,
  DomainConfig
> = {
  site: {
    label: "Site",
    tree: {
      title: "Site Tree",
      nodes: editTreeData,
      defaultNodeId: DEFAULT_EDIT_NODE_ID,
    },
    defaultTool: "Edit",
    defaultUtility: "tree",
    utilities: [
      {
        id: "tree",
        label: "Site Tree",
        icon: IconSitemap,
      },
      {
        id: "search",
        label: "Search",
        icon: IconSearch,
      },
      {
        id: "workflow",
        label: "Workflow",
        icon: IconUserCheck,
      },
      {
        id: "tools",
        label: "Tools",
        icon: IconWand,
      },
    ],
    tools: [
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
    tree: {
      title: "Asset Tree",
      nodes: assetsTreeData,
      defaultNodeId: DEFAULT_ASSETS_NODE_ID,
    },
    defaultTool: "Browse",
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
    tools: [
      {
        label: "Browse",
        icon: <IconPhoto size={28} stroke={1} />,
      },
      {
        label: "Upload",
        icon: <IconCircleArrowUp size={28} stroke={1} />,
      },
      {
        label: "Metadata",
        icon: <IconTags size={28} stroke={1} />,
      },
      {
        label: "Renditions",
        icon: <IconEye size={28} stroke={1} />,
      },
      {
        label: "Usage",
        icon: <IconChartBar size={28} stroke={1} />,
      },
      {
        label: "Properties",
        icon: <IconSettings size={28} stroke={1} />,
      },
    ],
  },
  ctp: {
    label: "CT&P",
    tree: null,
    defaultTool: null,
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
    tools: [],
  },
  administration: {
    label: "Administration",
    tree: null,
    defaultTool: "Users",
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
    tools: [
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
    tree: null,
    defaultTool: "Apps",
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
    tools: [
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
        gridTemplateRows: "72px minmax(0, 1fr)",
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
    Record<WorkspaceDomain, SelectedToolKey>
  >({
    site: domainConfigs.site.defaultTool,
    assets: domainConfigs.assets.defaultTool,
    ctp: domainConfigs.ctp.defaultTool,
    administration:
      domainConfigs.administration.defaultTool,
    apps: domainConfigs.apps.defaultTool,
  });
  const [selectedUtilities, setSelectedUtilities] =
    useState<
      Record<WorkspaceDomain, WorkspaceUtilityKey>
    >({
      site: domainConfigs.site.defaultUtility,
      assets: domainConfigs.assets.defaultUtility,
      ctp: domainConfigs.ctp.defaultUtility,
      administration:
        domainConfigs.administration.defaultUtility,
      apps: domainConfigs.apps.defaultUtility,
    });

  const [leftPaneWidth, setLeftPaneWidth] = useState(
    LEFT_PANEL_INITIAL_WIDTH
  );
  const [selectedNodeIds, setSelectedNodeIds] = useState<
    Record<WorkspaceDomain, string | null>
  >({
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
  const selectedTool =
    selectedTools[selectedDomain] ??
    domainConfig.defaultTool;
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

  const handleSelectNode = (nodeId: string) => {
    setSelectedNodeIds((current) => ({
      ...current,
      [selectedDomain]: nodeId,
    }));
  };

  const handleSelectTool = (tool: ToolKey) => {
    setSelectedTools((current) => ({
      ...current,
      [selectedDomain]: tool,
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
    onGoTo: () => setProductToolbarMode("search"),
    onCloseSearch: () =>
      setProductToolbarMode("default"),
  };

  const leftPanelProps = {
    width: leftPaneWidth,
    title:
      selectedTreeConfig?.title ??
      selectedUtility?.label ??
      "Workspace",
    nodes: selectedTreeConfig?.nodes ?? null,
    selectedDomain,
    utilityItems: domainConfig.utilities,
    selectedUtilityId,
    selectedNodeId,
    onSelectDomain: handleSelectDomain,
    onSelectUtility: handleSelectUtility,
    onSelectNode: handleSelectNode,
  };

  const workspaceSplitterProps = {
    value: leftPaneWidth,
    onChange: setLeftPaneWidth,
    min: LEFT_PANEL_MIN_WIDTH,
  };

  const contentWorkspaceProps = {
    domain: selectedDomain,
    domainLabel: domainConfig.label,
    selectedNodeLabel:
      selectedNode?.label ??
      (selectedTreeConfig
        ? "No selection"
        : domainConfig.label),
    selectedTool,
    tools: domainConfig.tools,
    onSelectTool: handleSelectTool,
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
