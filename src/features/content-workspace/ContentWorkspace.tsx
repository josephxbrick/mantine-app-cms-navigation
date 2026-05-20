/*
 * Content workspace region.
 * - Stacks the primary toolbar, secondary toolbar, and selected-node preview area.
 * - Receives the selected site-tree label from the app shell.
 */
import { Box, Flex, Text } from "@mantine/core";
import type { ReactNode } from "react";

import { PrimaryToolbar } from "./toolbars/primary-toolbar/PrimaryToolbar";
import SecondaryToolbar from "./toolbars/SecondaryToolbar";

type ContentWorkspaceProps = {
  selectedNodeLabel: string;
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
};

function SelectedNodePreview({
  selectedNodeLabel,
}: SelectedNodePreviewProps) {
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
        {selectedNodeLabel}
      </Text>
    </Box>
  );
}

export function ContentWorkspace({
  selectedNodeLabel,
}: ContentWorkspaceProps) {
  const selectedNodePreviewProps = {
    selectedNodeLabel,
  };

  return (
    <DisplayGroup>
      <PrimaryToolbar selectedNodeLabel={selectedNodeLabel} />
      <SecondaryToolbar />
      <SelectedNodePreview {...selectedNodePreviewProps} />
    </DisplayGroup>
  );
}
