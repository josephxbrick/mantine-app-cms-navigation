/*
 * Actions megamenu content.
 * - Displays Page, Assign To, and Workflow action columns.
 * - Currently wires actions to placeholder console logging.
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
  IconCalendar,
  IconDeviceFloppy,
  IconPencilCheck,
  IconRoute,
  IconTrash,
  IconUser,
  IconUsers,
  IconUserCircle,
} from "@tabler/icons-react";

const columns = [
  {
    title: "Page",
    items: [
      {
        label: "Save",
        icon: IconDeviceFloppy,
        onClick: () => console.log("Save"),
      },
      {
        label: "Rename...",
        icon: IconPencilCheck,
        onClick: () => console.log("Rename"),
      },
      {
        label: "Delete",
        icon: IconTrash,
        onClick: () => console.log("Delete"),
      },
    ],
  },
  {
    title: "Assign To",
    items: [
      {
        label: "Me",
        icon: IconUserCircle,
        onClick: () => console.log("Assign to Me"),
      },
      {
        label: "User...",
        icon: IconUser,
        onClick: () => console.log("Assign to User"),
      },
      {
        label: "Group...",
        icon: IconUsers,
        onClick: () => console.log("Assign to Group"),
      },
    ],
  },
  {
    title: "Workflow",
    items: [
      {
        label: "Advance",
        icon: IconRoute,
        onClick: () => console.log("Advance"),
      },
      {
        label: "Remove from Workflow",
        icon: IconTrash,
        onClick: () => console.log("Remove from Workflow"),
      },
      {
        label: "Show Workflow History",
        icon: IconCalendar,
        onClick: () => console.log("Show Workflow History"),
      },
    ],
  },
];

type MenuItem = {
  label: string;
  icon: Icon;
  onClick: () => void;
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
    <UnstyledButton onClick={item.onClick}>
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

export default function MegamenuActions() {
  return (
    <DisplayGroup>
      <MenuColumns columns={columns} />
    </DisplayGroup>
  );
}
