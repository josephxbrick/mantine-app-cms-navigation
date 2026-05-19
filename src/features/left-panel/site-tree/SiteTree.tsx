import { Box, ScrollArea } from "@mantine/core";

import { siteTreeData } from "./siteTreeData";
import { SiteTreeItem } from "./SiteTreeItem";

type SiteTreeProps = {
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
};

export const SiteTree = ({
  selectedNodeId,
  onSelectNode,
}: SiteTreeProps) => {
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
            onSelectNode={onSelectNode}
          />
        ))}
      </ScrollArea>
    </Box>
  );
};
