/*
 * Publish megamenu content.
 * - Displays check-in, mark-for-publish, and publish action columns.
 * - Provides the visual menu options; publish behavior is not implemented yet.
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

import {
  IconCheck,
  IconChecks,
  IconFile,
  IconFiles,
  IconFolderCheck,
  IconHistory,
  IconLogin,
  IconRotate,
} from "@tabler/icons-react";

const columns = [
  {
    title: "Actions",
    items: [
      {
        label: "Check In",
        icon: IconLogin,
      },
      {
        label: "Undo Checkout",
        icon: IconRotate,
      },
      {
        label: "Rollback",
        icon: IconHistory,
      },
    ],
  },
  {
    title: "Mark for Publish",
    items: [
      {
        label: "Mark Page",
        icon: IconCheck,
      },
      {
        label: "Mark Page & Children",
        icon: IconChecks,
      },
    ],
  },
  {
    title: "Publish",
    items: [
      {
        label: "Publish Page",
        icon: IconFile,
      },
      {
        label: "Publish Page & Children",
        icon: IconFiles,
      },
      {
        label: "Publish Site",
        icon: IconFolderCheck,
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
      cols={3}
      spacing={48}
      style={{
        width: 3 * 240 + 2 * 48,
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
    <>
      {items.map((item) => (
        <MenuItem key={item.label} item={item} />
      ))}
    </>
  );
}

type MenuItemProps = {
  item: MenuItem;
};

function MenuItem({ item }: MenuItemProps) {
  const Icon = item.icon;

  return (
    <UnstyledButton>
      <Group gap={12} py={6}>
        <Icon
          size={28}
          stroke={1.3}
          color="var(--mantine-color-asxGray-7)"
        />

        <Text size="sm" fw={500} c="asxGray.7">
          {item.label}
        </Text>
      </Group>
    </UnstyledButton>
  );
}

export default function MegamenuPublish() {
  return (
    <DisplayGroup>
      <MenuColumns columns={columns} />
    </DisplayGroup>
  );
}
