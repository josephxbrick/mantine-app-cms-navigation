import { Box, ScrollArea } from "@mantine/core";
import { useState } from "react";

import { siteTreeData } from "./SiteTreeData";
import { SiteTreeItem } from "./SiteTreeItem";

export const SiteTree = () => {
const [selectedNodeId, setSelectedNodeId] =
  useState<string | null>("central-university");

  return (
    <Box
      h="100%"
      bg="white"
      p="xs"
      miw={260}
    >
      <ScrollArea h="100%" type="auto">
        {siteTreeData.map((node) => (
          <SiteTreeItem
            key={node.id}
            node={node}
            level={0}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
          />
        ))}
      </ScrollArea>
    </Box>
  );
};