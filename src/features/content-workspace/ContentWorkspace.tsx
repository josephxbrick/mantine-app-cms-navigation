/*
 * Content workspace region.
 * - Stacks the primary toolbar, secondary toolbar, and selected-node preview area.
 * - Receives the selected tree label and active tool from the app shell.
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
  tools: ToolbarTool[];
  onSelectTool: (tool: ToolKey) => void;
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
  tools,
  onSelectTool,
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
  };

  return (
    <DisplayGroup>
      <PrimaryToolbar {...primaryToolbarProps} />
      <SecondaryToolbar {...secondaryToolbarProps} />
      <SelectedNodePreview {...selectedNodePreviewProps} />
    </DisplayGroup>
  );
}
