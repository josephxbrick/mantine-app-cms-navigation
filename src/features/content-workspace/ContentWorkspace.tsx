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

const DEMO_IMAGE_WIDTH = 2138;
const DEMO_TAB_HEIGHT = 67;
const DEMO_EDIT_TAB_WIDTH = 94;
const DEMO_PREVIEW_TAB_WIDTH = 132;

export type DemoWorkspaceTool = "Edit" | "Preview";

type ContentWorkspaceProps = {
  domain: WorkspaceDomain;
  domainLabel: string;
  selectedNodeLabel: string;
  selectedTool: SelectedToolKey;
  demoWorkspaceTool: DemoWorkspaceTool;
  demoWorkspaceVisible: boolean;
  tools: ToolbarTool[];
  onSelectTool: (tool: ToolKey) => void;
  onSelectDemoWorkspaceTool: (tool: DemoWorkspaceTool) => void;
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
  demoWorkspaceTool: DemoWorkspaceTool;
  demoWorkspaceVisible: boolean;
  onSelectDemoWorkspaceTool: (tool: DemoWorkspaceTool) => void;
};

function SelectedNodePreview({
  domain,
  selectedNodeLabel,
  selectedTool,
  demoWorkspaceTool,
  demoWorkspaceVisible,
  onSelectDemoWorkspaceTool,
}: SelectedNodePreviewProps) {
  const activeDemoTool =
    selectedTool === "Edit" || selectedTool === "Preview"
      ? selectedTool
      : demoWorkspaceTool;
  const previewLabel = selectedTool
    ? `${selectedNodeLabel} | ${selectedTool}`
    : selectedNodeLabel;
  const demoImage =
    domain === "site" && activeDemoTool === "Edit"
      ? "/demo/site-edit.png"
      : domain === "site" && activeDemoTool === "Preview"
        ? "/demo/site-preview.png"
        : null;
  const demoTitleSuffix =
    activeDemoTool === "Edit"
      ? " (x45)"
      : activeDemoTool === "Preview"
        ? " (x336)"
        : "";
  const demoImageHeight =
    activeDemoTool === "Preview" ? 1924 : 1783;
  const demoTabHeightPercent =
    (DEMO_TAB_HEIGHT / demoImageHeight) * 100;
  const demoEditTabWidthPercent =
    (DEMO_EDIT_TAB_WIDTH / DEMO_IMAGE_WIDTH) * 100;
  const demoPreviewTabLeftPercent =
    demoEditTabWidthPercent;
  const demoPreviewTabWidthPercent =
    (DEMO_PREVIEW_TAB_WIDTH / DEMO_IMAGE_WIDTH) * 100;

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
              style={{
                position: "relative",
                width: "100%",
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

              <Box
                component="button"
                aria-label="Switch to Site Edit"
                onClick={() => onSelectDemoWorkspaceTool("Edit")}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: `${demoEditTabWidthPercent}%`,
                  height: `${demoTabHeightPercent}%`,
                  padding: 0,
                  border: 0,
                  background: "transparent",
                  cursor: "pointer",
                }}
              />

              <Box
                component="button"
                aria-label="Switch to Site Preview"
                onClick={() =>
                  onSelectDemoWorkspaceTool("Preview")
                }
                style={{
                  position: "absolute",
                  top: 0,
                  left: `${demoPreviewTabLeftPercent}%`,
                  width: `${demoPreviewTabWidthPercent}%`,
                  height: `${demoTabHeightPercent}%`,
                  padding: 0,
                  border: 0,
                  background: "transparent",
                  cursor: "pointer",
                }}
              />
            </Box>
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
  demoWorkspaceTool,
  demoWorkspaceVisible,
  tools,
  onSelectTool,
  onSelectDemoWorkspaceTool,
}: ContentWorkspaceProps) {
  const selectedNodePreviewProps = {
    domain,
    selectedNodeLabel,
    selectedTool,
    demoWorkspaceTool,
    demoWorkspaceVisible,
    onSelectDemoWorkspaceTool,
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
