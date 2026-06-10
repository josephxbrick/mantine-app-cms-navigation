/*
 * File purpose: Main workspace region that stacks primary toolbar, secondary toolbar, and selected content preview.
 *
 * Imports:
 * - Box, Flex, Text from "@mantine/core" provides Mantine UI primitives, theme helpers, component types, or styling utilities used in this file.
 * - type { ReactNode } from "react" provides React hooks, refs, component helpers, or React-only types used in this file.
 * - PrimaryToolbar from "./toolbars/primary-toolbar/PrimaryToolbar" provides the primary workspace toolbar controller.
 * - type { SelectedToolKey, ToolbarTool, ToolKey, } from "./toolbars/primary-toolbar/types" provides shared toolbar tool and selection types.
 * - SecondaryToolbar from "./toolbars/SecondaryToolbar" provides the tool-specific secondary toolbar below the primary toolbar.
 * - type { WorkspaceDomain } from "../workspace/types" provides shared workspace domain or utility key types.
 */
import { Box, Flex, Text } from "@mantine/core";
import type { ReactNode } from "react";

import { PrimaryToolbar } from "./toolbars/primary-toolbar/PrimaryToolbar";
import type {
  SelectedToolKey,
  ToolbarTool,
  ToolKey,
} from "./toolbars/primary-toolbar/types";
import SecondaryToolbar from "./toolbars/SecondaryToolbar";
import type { WorkspaceDomain } from "../workspace/types";

type ContentWorkspaceProps = {
  domain: WorkspaceDomain;
  selectedNodeLabel: string;
  selectedNodeXId?: string;
  selectedTool: SelectedToolKey;
  demoWorkspaceVisible: boolean;
  publishTarget: string;
  tools: ToolbarTool[];
  onSelectTool: (tool: ToolKey) => void;
  onTogglePublishingTargetVisibility: () => void;
};

type DisplayGroupProps = {
  children: ReactNode;
};

function DisplayGroup({ children }: DisplayGroupProps) {
  return (
    <Flex direction="column" flex={1} h="100%">
      {children}
    </Flex>
  );
}

type SelectedNodePreviewProps = {
  domain: WorkspaceDomain;
  selectedNodeLabel: string;
  selectedTool: SelectedToolKey;
  demoWorkspaceVisible: boolean;
};

function SelectedNodePreview({
  domain,
  selectedNodeLabel,
  selectedTool,
  demoWorkspaceVisible,
}: SelectedNodePreviewProps) {
  const previewLabel = selectedTool
    ? `${selectedNodeLabel} | ${selectedTool}`
    : selectedNodeLabel;
  const demoImage =
    domain === "site" && selectedTool === "Edit"
      ? "/demo/site-edit.png"
      : domain === "site" && selectedTool === "Preview"
        ? "/demo/site-preview.png"
        : null;
  const demoMode =
    domain === "site" &&
      (selectedTool === "Edit" ||
        selectedTool === "Preview")
      ? selectedTool
      : null;

  return (
    <Box
      bg="gray.1"
      style={{
        flex: 1,
        display: demoWorkspaceVisible && demoImage ? "flex" : "grid",
        flexDirection: "column",
        placeItems:
          demoWorkspaceVisible && demoImage
            ? undefined
            : "center",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      {demoWorkspaceVisible && demoImage ? (
        demoMode === "Edit" ? (
          <Box
            bg="asxGray.2"
            p="xl"
            w="100%"
            h="100%"
            style={{
              overflow: "auto",
            }}
          >
            <Box
              component="img"
              src={demoImage}
              alt={previewLabel}
              style={{
                display: "block",
                height: "auto",
                maxWidth: "none",
              }}
            />
          </Box>
        ) : (
          <Box
            component="img"
            src={demoImage}
            alt={previewLabel}
            w="100%"
            style={{
              display: "block",
              height: "auto",
              alignSelf: "flex-start",
            }}
          />
        )
      ) : (
        <Text c="asxGray.6" fw={500} size="xl">
          {previewLabel}
        </Text>
      )}
    </Box>
  );
}

export function ContentWorkspace({
  domain,
  selectedNodeLabel,
  selectedNodeXId,
  selectedTool,
  demoWorkspaceVisible,
  publishTarget,
  tools,
  onSelectTool,
  onTogglePublishingTargetVisibility,
}: ContentWorkspaceProps) {
  const selectedNodePreviewProps = {
    domain,
    selectedNodeLabel,
    selectedTool,
    demoWorkspaceVisible,
  };

  const primaryToolbarProps = {
    selectedNodeLabel,
    selectedNodeXId,
    selectedTool,
    tools,
    onSelectTool,
  };

  const secondaryToolbarProps = {
    domain,
    tool: selectedTool,
    publishTarget,
    onTogglePublishingTargetVisibility,
  };

  return (
    <DisplayGroup>
      <PrimaryToolbar {...primaryToolbarProps} />
      <SecondaryToolbar {...secondaryToolbarProps} />
      <SelectedNodePreview {...selectedNodePreviewProps} />
    </DisplayGroup>
  );
}
