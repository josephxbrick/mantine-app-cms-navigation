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
  domainLabel: string;
  selectedNodeLabel: string;
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
  const demoTitleSuffix =
    selectedTool === "Edit"
      ? " (x45)"
      : selectedTool === "Preview"
        ? " (x336)"
        : "";

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
        <>
          <Box
            bg="white"
            w="100%"
            px={24}
            py={14}
            style={{
              borderBottom:
                "1px solid var(--mantine-color-gray-4)",
            }}
          >
            <Text
              c="asxGray.9"
              fw={500}
              style={{ fontSize: 20, lineHeight: 1.2 }}
            >
              {selectedNodeLabel}
              {demoTitleSuffix}
            </Text>
          </Box>

          <Box
            w="100%"
            style={{
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            <Box
              component="img"
              src={demoImage}
              alt={previewLabel}
              w="100%"
              style={{
                display: "block",
                height: "auto",
              }}
            />
          </Box>
        </>
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
  domainLabel,
  selectedNodeLabel,
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
    domainLabel,
    selectedNodeLabel,
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
