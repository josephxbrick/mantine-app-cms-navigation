/*
 * File purpose: Product toolbar wrapper that renders domain selection and global shell controls.
 *
 * Imports:
 * - Flex, Group, Text, UnstyledButton, from "@mantine/core" provides Mantine UI primitives, theme helpers, component types, or styling utilities used in this file.
 * - type { Icon } from "@tabler/icons-react" provides icon components or icon types used by the CMS navigation UI.
 * - type { ReactNode } from "react" provides React hooks, refs, component helpers, or React-only types used in this file.
 * - ProductToolbarPaper from "./ProductToolbarPaper" provides the visual toolbar surface used by the product toolbar wrapper.
 * - type { WorkspaceDomain } from "../../../workspace/types" provides shared workspace domain or utility key types.
 */
import {
  Flex,
  Group,
  Text,
  UnstyledButton,
} from "@mantine/core";
import type { Icon } from "@tabler/icons-react";
import type { ReactNode } from "react";

import { ProductToolbarPaper } from "./ProductToolbarPaper";
import type { WorkspaceDomain } from "../../../workspace/types";

type ProductToolbarProps = {
  mode: "default" | "search";
  demoWorkspaceVisible: boolean;
  domainItems: ProductToolbarDomainItem[];
  selectedDomain: WorkspaceDomain;
  onGoTo: () => void;
  onCloseSearch: () => void;
  onSelectDomain: (domain: WorkspaceDomain) => void;
  onToggleDemoWorkspace: () => void;
};

type ProductToolbarDomainItem = {
  id: WorkspaceDomain;
  label: string;
  icon: Icon;
};

type DisplayGroupProps = {
  children: ReactNode;
};

function DisplayGroup({ children }: DisplayGroupProps) {
  return (
    <Flex
      h={68}
      px="xl"
      align="center"
      justify="space-between"
      bg="asxBlue.9"
      c="asxGray.0"
    >
      {children}
    </Flex>
  );
}

function ProductIdentity() {
  return (
    <Text fz={24} fw={400}>
      Ingeniux CMS
    </Text>
  );
}

type DomainTabsProps = {
  items: ProductToolbarDomainItem[];
  selectedDomain: WorkspaceDomain;
  onSelectDomain: (domain: WorkspaceDomain) => void;
};

function DomainTabs({
  items,
  selectedDomain,
  onSelectDomain,
}: DomainTabsProps) {
  return (
    <Group gap={8} wrap="nowrap">
      {items.map((item) => (
        <DomainTab
          key={item.id}
          item={item}
          selected={item.id === selectedDomain}
          onSelectDomain={onSelectDomain}
        />
      ))}
    </Group>
  );
}

type DomainTabProps = {
  item: ProductToolbarDomainItem;
  selected: boolean;
  onSelectDomain: (domain: WorkspaceDomain) => void;
};

function DomainTab({
  item,
  selected,
  onSelectDomain,
}: DomainTabProps) {
  const Icon = item.icon;

  return (
    <UnstyledButton
      px={16}
      py={7}
      c={selected ? "asxGray.8" : "asxGray.0"}
      bg={selected ? "asxBlue.1" : "transparent"}
      style={{
        borderRadius: 999,
        transition:
          "background-color 120ms ease,color 120ms ease",
      }}
      onClick={() => onSelectDomain(item.id)}
    >
      <Group gap={6} wrap="nowrap">
        <Icon size={28} stroke={1.4} />
        <Text fz={17} fw={selected ? 500 : 450}>
          {item.label}
        </Text>
      </Group>
    </UnstyledButton>
  );
}

export function ProductToolbar({
  mode,
  demoWorkspaceVisible,
  domainItems,
  selectedDomain,
  onGoTo,
  onCloseSearch,
  onSelectDomain,
  onToggleDemoWorkspace,
}: ProductToolbarProps) {
  const domainTabsProps = {
    items: domainItems,
    selectedDomain,
    onSelectDomain,
  };

  const productToolbarPaperProps = {
    mode,
    demoWorkspaceVisible,
    onGoTo,
    onCloseSearch,
    onToggleDemoWorkspace,
  };

  return (
    <DisplayGroup>
      <ProductIdentity />
      <DomainTabs {...domainTabsProps} />
      <ProductToolbarPaper {...productToolbarPaperProps} />
    </DisplayGroup>
  );
}
