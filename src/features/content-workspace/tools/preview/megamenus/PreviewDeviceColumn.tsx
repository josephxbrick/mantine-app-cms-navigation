/*
 * Preview device selector column.
 * - Lets preview menus share the same selected-device radio list.
 * - Tracks selection through caller-owned state.
 */
import { Group, Stack, Text, UnstyledButton } from "@mantine/core";
import type { Icon } from "@tabler/icons-react";
import { useState } from "react";

export type PreviewDevice =
  | "Desktop"
  | "Tablet"
  | "Mobile";

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

type PreviewDeviceColumnProps = {
  selectedDevice: PreviewDevice;
  onSelectDevice: (device: PreviewDevice) => void;
};

export function PreviewDeviceColumn({
  selectedDevice,
  onSelectDevice,
}: PreviewDeviceColumnProps) {
  return (
    <Stack gap={8} w={240}>
      <ColumnTitle title="Form Factors" />
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
}: PreviewDeviceColumnProps) {
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
  const [isHovered, setIsHovered] = useState(false);
  const isHighlighted = selected || isHovered;

  return (
    <UnstyledButton
      onClick={() => onSelectDevice(item.label)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: "100%",
        padding: "8px 10px",
        borderRadius: 8,
        border: isHighlighted
          ? `1px solid var(--mantine-color-${
              selected ? "indigo-2" : "asxBlue-1"
            })`
          : "1px solid transparent",
        borderLeft: selected
          ? "3px solid var(--mantine-color-indigo-6)"
          : isHovered
            ? "3px solid var(--mantine-color-asxBlue-1)"
            : "3px solid transparent",
        background: selected
          ? "var(--mantine-color-indigo-1)"
          : isHovered
            ? "var(--mantine-color-asxBlue-0)"
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
