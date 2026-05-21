/*
 * Preview actions megamenu content.
 * - Mirrors Edit Actions, replacing the Page column with preview device radios.
 * - Tracks the selected preview device through caller-owned state.
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
  IconRoute,
  IconTrash,
  IconUser,
  IconUsers,
  IconUserCircle,
} from "@tabler/icons-react";

export type PreviewDevice =
  | "Desktop"
  | "Tablet"
  | "Mobile";

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

type DeviceItem = {
  label: PreviewDevice;
  icon?: Icon;
};

const deviceItems: DeviceItem[] = [
  {
    label: "Desktop",
  },
  {
    label: "Tablet",
  },
  {
    label: "Mobile",
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

type DeviceColumnProps = {
  selectedDevice: PreviewDevice;
  onSelectDevice: (device: PreviewDevice) => void;
};

type ActionColumnsProps = {
  columns: ActionColumn[];
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

function DeviceColumn({
  selectedDevice,
  onSelectDevice,
}: DeviceColumnProps) {
  return (
    <Stack gap={8} w={240}>
      <ColumnTitle title="Device" />
      <DeviceItems
        selectedDevice={selectedDevice}
        onSelectDevice={onSelectDevice}
      />
    </Stack>
  );
}

function DeviceItems({
  selectedDevice,
  onSelectDevice,
}: DeviceColumnProps) {
  return (
    <>
      {deviceItems.map((item) => (
        <DeviceRadioItem
          key={item.label}
          item={item}
          selected={selectedDevice === item.label}
          onSelectDevice={onSelectDevice}
        />
      ))}
    </>
  );
}

type DeviceRadioItemProps = {
  item: DeviceItem;
  selected: boolean;
  onSelectDevice: (device: PreviewDevice) => void;
};

function DeviceRadioItem({
  item,
  selected,
  onSelectDevice,
}: DeviceRadioItemProps) {
  const Icon = item.icon;

  return (
    <UnstyledButton
      onClick={() => onSelectDevice(item.label)}
      style={{
        width: "100%",
        padding: "8px 10px",
        borderRadius: 8,
        borderLeft: selected
          ? "3px solid var(--mantine-color-indigo-6)"
          : "3px solid transparent",
        background: selected
          ? "var(--mantine-color-indigo-1)"
          : "transparent",
        color: selected
          ? "var(--mantine-color-indigo-9)"
          : "var(--mantine-color-asxGray-7)",
        fontWeight: selected ? 700 : 500,
      }}
    >
      <Group gap="xs" wrap="nowrap">
        {Icon ? (
          <Icon
            size={24}
            stroke={1.3}
            color={
              selected
                ? "var(--mantine-color-indigo-7)"
                : "var(--mantine-color-asxGray-7)"
            }
          />
        ) : null}
        <Text size="sm">{item.label}</Text>
      </Group>
    </UnstyledButton>
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

type MegamenuPreviewActionsProps = {
  selectedDevice: PreviewDevice;
  onSelectDevice: (device: PreviewDevice) => void;
};

export default function MegamenuPreviewActions({
  selectedDevice,
  onSelectDevice,
}: MegamenuPreviewActionsProps) {
  return (
    <DisplayGroup>
      <DeviceColumn
        selectedDevice={selectedDevice}
        onSelectDevice={onSelectDevice}
      />
      <ActionColumns columns={actionColumns} />
    </DisplayGroup>
  );
}
