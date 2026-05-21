/*
 * New megamenu content.
 * - Displays create-new options for content and other item types.
 * - Provides the visual menu options; creation behavior is not implemented yet.
 */
import {
  Group,
  SimpleGrid,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import type { Icon } from "@tabler/icons-react";
import type { ReactNode } from "react";
import { useState } from "react";

import {
  IconAtom,
  IconFile,
  IconFolder,
  IconMap,
} from "@tabler/icons-react";

const columns = [
  {
    title: "Content",
    items: [
      {
        label: "Page",
        icon: IconFile,
      },
      {
        label: "Component",
        icon: IconAtom,
      },
    ],
  },
  {
    title: "Other",
    items: [
      {
        label: "Folder",
        icon: IconFolder,
      },
      {
        label: "DITA Alias",
        icon: IconMap,
      },
    ],
  },
];

type MenuItem = {
  label: string;
  icon: Icon;
};

type MenuColumn = {
  title: string;
  items: MenuItem[];
};

type DisplayGroupProps = {
  children: ReactNode;
};

type MenuColumnsProps = {
  columns: MenuColumn[];
};

function DisplayGroup({ children }: DisplayGroupProps) {
  return (
    <SimpleGrid
      cols={2}
      spacing={80}
      style={{
        width: 2 * 240 + 1 * 48,
      }}
    >
      {children}
    </SimpleGrid>
  );
}

function MenuColumns({ columns }: MenuColumnsProps) {
  return (
    <>
      {columns.map((column) => (
        <MenuColumn key={column.title} column={column} />
      ))}
    </>
  );
}

type MenuColumnProps = {
  column: MenuColumn;
};

function MenuColumn({ column }: MenuColumnProps) {
  return (
    <Stack gap={8} w={240}>
      <ColumnTitle title={column.title} />
      <MenuItems items={column.items} />
    </Stack>
  );
}

type ColumnTitleProps = {
  title: string;
};

function ColumnTitle({ title }: ColumnTitleProps) {
  return (
    <Text size="xs" fw={700} c="asxGray.6" tt="uppercase">
      {title}
    </Text>
  );
}

type MenuItemsProps = {
  items: MenuItem[];
};

function MenuItems({ items }: MenuItemsProps) {
  return (
    <Stack gap={8}>
      {items.map((item) => (
        <MenuItem key={item.label} item={item} />
      ))}
    </Stack>
  );
}

type MenuItemProps = {
  item: MenuItem;
};

function MenuItem({ item }: MenuItemProps) {
  const Icon = item.icon;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <UnstyledButton
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: "100%",
        padding: "0 10px",
        borderRadius: 8,
        border: isHovered
          ? "1px solid var(--mantine-color-asxBlue-1)"
          : "1px solid transparent",
        background: isHovered
          ? "var(--mantine-color-asxBlue-0)"
          : "transparent",
      }}
    >
      <Group gap={12} py={6}>
        <Icon
          size={28}
          stroke={1.3}
          color="var(--mantine-color-asxGray-7)"
        />

        <Text size="sm" fw={600} c="asxGray.7">
          {item.label}
        </Text>
      </Group>
    </UnstyledButton>
  );
}

export default function MegamenuNew() {
  return (
    <DisplayGroup>
      <MenuColumns columns={columns} />
    </DisplayGroup>
  );
}
