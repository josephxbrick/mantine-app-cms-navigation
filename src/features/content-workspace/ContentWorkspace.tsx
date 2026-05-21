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
  selectedNodeLabel: string;
  selectedTool: SelectedToolKey;
};

function SelectedNodePreview({
  selectedNodeLabel,
  selectedTool,
}: SelectedNodePreviewProps) {
  const previewLabel = selectedTool
    ? `${selectedNodeLabel} | ${selectedTool}`
    : selectedNodeLabel;

  return (
    <Box
      bg="gray.1"
      style={{
        flex: 1,
        display: "grid",
        placeItems: "center",
      }}
    >
      <Text c="asxGray.6" fw={500} size="xl">
        {previewLabel}
      </Text>
    </Box>
  );
}

export function ContentWorkspace({
  domain,
  domainLabel,
  selectedNodeLabel,
  selectedTool,
  tools,
  onSelectTool,
}: ContentWorkspaceProps) {
  const selectedNodePreviewProps = {
    selectedNodeLabel,
    selectedTool,
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
