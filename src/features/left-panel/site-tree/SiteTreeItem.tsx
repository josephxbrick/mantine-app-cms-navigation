import {
  Box,
  Group,
  Text,
  Transition,
  UnstyledButton,
} from "@mantine/core";
import { useState } from "react";

import {
  ChevronClosedIcon,
  ChevronOpenIcon,
  FolderClosedIcon,
  FolderOpenIcon,
  PageIcon,
} from "./SiteTreeIcons";
import { SiteTreeIndent } from "./SiteTreeIndent";
import type { SiteTreeNode } from "./types";

type SiteTreeItemProps = {
  node: SiteTreeNode;
  level: number;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
};

export const SiteTreeItem = ({
  node,
  level,
  selectedNodeId,
  onSelectNode,
}: SiteTreeItemProps) => {
  const hasChildren = Boolean(node.children?.length);
  const [isOpen, setIsOpen] = useState(level < 2);

  const isSelected = selectedNodeId === node.id;
  const isFolder = hasChildren;

  return (
    <Box>
      <UnstyledButton
        w="100%"
        px="xs"
        py={4}
        bg={isSelected ? "asxIndigo.0" : "transparent"}
        onClick={() => onSelectNode(node.id)}
        style={{
          borderRadius: 4,
          overflow: "visible",
          border: isSelected
            ? "1px solid var(--mantine-color-asxIndigo-2)"
            : "1px solid transparent",
        }}
      >
        <Group
          gap={4}
          wrap="nowrap"
          style={{
            minWidth: "max-content",
            userSelect: "none",
          }}
        >
          <SiteTreeIndent level={level} />

          <Box
            w={18}
            h={28}
            display="flex"
            style={{
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
            onClick={(event) => {
              event.stopPropagation();

              if (hasChildren) {
                setIsOpen((current) => !current);
              }
            }}
          >
            {hasChildren ? (
              isOpen ? (
                <ChevronOpenIcon />
              ) : (
                <ChevronClosedIcon />
              )
            ) : null}
          </Box>

          <Group
            gap={6}
            wrap="nowrap"
            style={{
              flexShrink: 0,
            }}
          >
            <Box
              display="flex"
              style={{
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              {isFolder ? (
                isOpen ? (
                  <FolderOpenIcon />
                ) : (
                  <FolderClosedIcon />
                )
              ) : (
                <PageIcon />
              )}
            </Box>

            <Text
              size="sm"
              c={isSelected ? "asxIndigo.9" : "asxGray.8"}
              fw={isSelected ? 600 : 400}
              style={{
                whiteSpace: "nowrap",
              }}
            >
              {node.label}
            </Text>
          </Group>
        </Group>
      </UnstyledButton>

      {hasChildren ? (
        <Transition
          mounted={isOpen}
          transition="fade-down"
          duration={140}
          timingFunction="ease"
        >
          {(styles) => (
            <Box style={styles}>
              {node.children?.map((childNode) => (
                <SiteTreeItem
                  key={childNode.id}
                  node={childNode}
                  level={level + 1}
                  selectedNodeId={selectedNodeId}
                  onSelectNode={onSelectNode}
                />
              ))}
            </Box>
          )}
        </Transition>
      ) : null}
    </Box>
  );
};