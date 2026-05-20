/*
 * Product toolbar.
 * - Displays the product identity and high-level CMS workspace actions.
 * - Passes search/open state controls into the product toolbar paper.
 */
import {
  Flex,
  Stack,
  Text,
} from "@mantine/core";
import type { ReactNode } from "react";

import { ProductToolbarPaper } from "./ProductToolbarPaper";

type ProductToolbarProps = {
  mode: "default" | "search";
  onGoTo: () => void;
  onCloseSearch: () => void;
};

type DisplayGroupProps = {
  children: ReactNode;
};

function DisplayGroup({ children }: DisplayGroupProps) {
  return (
    <Flex
      h={72}
      px="xl"
      align="center"
      justify="space-between"
      bg="asxBlue.8"
      c="asxGray.0"
    >
      {children}
    </Flex>
  );
}

function ProductIdentity() {
  return (
    <Stack gap={0}>
      <Text size="xl" fw={400}>
        Ingeniux CMS
      </Text>

      <Text size="s" c="asxBlue.1">
        Content management workspace
      </Text>
    </Stack>
  );
}

export function ProductToolbar({
  mode,
  onGoTo,
  onCloseSearch,
}: ProductToolbarProps) {
  const productToolbarPaperProps = {
    mode,
    onGoTo,
    onCloseSearch,
  };

  return (
    <DisplayGroup>
      <ProductIdentity />
      <ProductToolbarPaper {...productToolbarPaperProps} />
    </DisplayGroup>
  );
}
