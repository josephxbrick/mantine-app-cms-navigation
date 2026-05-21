/*
 * Preview actions megamenu content.
 * - Mirrors Edit Actions without Page-specific commands.
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
import { useState } from "react";

import {
  IconCalendar,
  IconRoute,
  IconTrash,
  IconUser,
  IconUsers,
  IconUserCircle,
} from "@tabler/icons-react";

const actionColumns = [
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

type ActionItem = {
  label: string;
  icon: Icon;
  onClick: () => void;
};

type ActionColumn = {
  title: string;
  items: ActionItem[];
};

type DisplayGroupProps = {
  children: ReactNode;
};

type ActionColumnsProps = {
  columns: ActionColumn[];
};

function DisplayGroup({ children }: DisplayGroupProps) {
  return (
    <SimpleGrid
      cols={2}
      spacing={48}
      style={{
        width: 2 * 240 + 48,
      }}
    >
      {children}
    </SimpleGrid>
  );
}

function ActionColumns({ columns }: ActionColumnsProps) {
  return (
    <>
      {columns.map((column) => (
        <ActionColumn
          key={column.title}
          column={column}
        />
      ))}
    </>
  );
}

type ActionColumnProps = {
  column: ActionColumn;
};

function ActionColumn({ column }: ActionColumnProps) {
  return (
    <Stack gap={8} w={240}>
      <ColumnTitle title={column.title} />
      <ActionItems items={column.items} />
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

type ActionItemsProps = {
  items: ActionItem[];
};

function ActionItems({ items }: ActionItemsProps) {
  return (
    <>
      {items.map((item) => (
        <ActionItem key={item.label} item={item} />
      ))}
    </>
  );
}

type ActionItemProps = {
  item: ActionItem;
};

function ActionItem({ item }: ActionItemProps) {
  const Icon = item.icon;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <UnstyledButton
      onClick={item.onClick}
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

        <Text size="sm" fw={500} c="asxGray.7">
          {item.label}
        </Text>
      </Group>
    </UnstyledButton>
  );
}

export default function MegamenuPreviewActions() {
  return (
    <DisplayGroup>
      <ActionColumns columns={actionColumns} />
    </DisplayGroup>
  );
}
