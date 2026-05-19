import {
  Box,
  Group,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";

import type {
  MegamenuCheckboxValues,
  MegamenuColumn,
  MegamenuConfig,
  MegamenuItem,
  MegamenuRadioValues,
} from "./types";

const COLUMN_WIDTH = 240;
const COLUMN_GAP = 32;
const ITEM_PADDING = "8px 10px";

type MegamenuRendererProps = {
  config: MegamenuConfig;
  radioValues: MegamenuRadioValues;
  checkboxValues: MegamenuCheckboxValues;
  onRadioChange: (groupId: string, value: string) => void;
  onCheckboxChange: (itemId: string) => void;
  onCommand: (itemId: string) => void;
};

type ColumnSlot = {
  key: string;
  columns: MegamenuColumn[];
  animated: boolean;
};

export function MegamenuRenderer({
  config,
  radioValues,
  checkboxValues,
  onRadioChange,
  onCheckboxChange,
  onCommand,
}: MegamenuRendererProps) {
  const slots = groupColumnsIntoSlots(config.columns);

  return (
    <Group align="stretch" gap={0}>
      {slots.map((slot, index) => {
        const visibleColumn =
          slot.columns.find((column) =>
            isColumnVisible(
              column,
              radioValues,
              checkboxValues
            )
          ) ?? null;

        if (slot.animated) {
          return (
            <AnimatedColumnSlot
              key={slot.key}
              visible={Boolean(visibleColumn)}
              hasLeadingGap={index > 0}
            >
              {visibleColumn ? (
                <MenuColumnView
                  column={visibleColumn}
                  radioValues={radioValues}
                  checkboxValues={checkboxValues}
                  onRadioChange={onRadioChange}
                  onCheckboxChange={onCheckboxChange}
                  onCommand={onCommand}
                />
              ) : null}
            </AnimatedColumnSlot>
          );
        }

        if (!visibleColumn) {
          return null;
        }

        return (
          <Box
            key={slot.key}
            w={COLUMN_WIDTH}
            ml={index > 0 ? COLUMN_GAP : 0}
            style={{ flexShrink: 0 }}
          >
            <MenuColumnView
              column={visibleColumn}
              radioValues={radioValues}
              checkboxValues={checkboxValues}
              onRadioChange={onRadioChange}
              onCheckboxChange={onCheckboxChange}
              onCommand={onCommand}
            />
          </Box>
        );
      })}
    </Group>
  );
}

function AnimatedColumnSlot({
  visible,
  hasLeadingGap,
  children,
}: {
  visible: boolean;
  hasLeadingGap: boolean;
  children: React.ReactNode;
}) {
  const expandedWidth =
    COLUMN_WIDTH + (hasLeadingGap ? COLUMN_GAP : 0);

  return (
    <Box
      style={{
        width: visible ? expandedWidth : 0,
        overflow: "hidden",
        flexShrink: 0,
        transition: "width 180ms ease",
      }}
    >
      <Box
        ml={hasLeadingGap ? COLUMN_GAP : 0}
        w={COLUMN_WIDTH}
        style={{
          transform: visible
            ? "translateX(0)"
            : "translateX(-12px)",
          opacity: visible ? 1 : 0,
          transition:
            "transform 180ms ease, opacity 120ms ease",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

function MenuColumnView({
  column,
  radioValues,
  checkboxValues,
  onRadioChange,
  onCheckboxChange,
  onCommand,
}: {
  column: MegamenuColumn;
  radioValues: MegamenuRadioValues;
  checkboxValues: MegamenuCheckboxValues;
  onRadioChange: (groupId: string, value: string) => void;
  onCheckboxChange: (itemId: string) => void;
  onCommand: (itemId: string) => void;
}) {
  return (
    <Stack gap={8} w="100%">
      <Text
        size="xs"
        fw={700}
        c="asxGray.6"
        tt="uppercase"
      >
        {column.header}
      </Text>

      {column.items.map((item) => (
        <MenuItemView
          key={item.id}
          item={item}
          radioValues={radioValues}
          checkboxValues={checkboxValues}
          onRadioChange={onRadioChange}
          onCheckboxChange={onCheckboxChange}
          onCommand={onCommand}
        />
      ))}
    </Stack>
  );
}

function MenuItemView({
  item,
  radioValues,
  checkboxValues,
  onRadioChange,
  onCheckboxChange,
  onCommand,
}: {
  item: MegamenuItem;
  radioValues: MegamenuRadioValues;
  checkboxValues: MegamenuCheckboxValues;
  onRadioChange: (groupId: string, value: string) => void;
  onCheckboxChange: (itemId: string) => void;
  onCommand: (itemId: string) => void;
}) {
  if (item.type === "radio") {
    const selected =
      radioValues[item.groupId] === item.value;

    return (
      <UnstyledButton
        onClick={() =>
          onRadioChange(item.groupId, item.value)
        }
        style={{
          width: "100%",
          padding: ITEM_PADDING,
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
        <Text size="sm">{item.label}</Text>
      </UnstyledButton>
    );
  }

  if (item.type === "checkbox") {
    const selected = Boolean(checkboxValues[item.id]);

    return (
      <UnstyledButton
        onClick={() => onCheckboxChange(item.id)}
        style={{
          width: "100%",
          padding: ITEM_PADDING,
          borderRadius: 8,
          background: selected
            ? "var(--mantine-color-indigo-1)"
            : "transparent",
          color: selected
            ? "var(--mantine-color-indigo-9)"
            : "var(--mantine-color-asxGray-8)",
          fontWeight: selected ? 700 : 500,
        }}
      >
        <Group gap="xs" wrap="nowrap">
          <Box
            style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              border: selected
                ? "1px solid var(--mantine-color-indigo-6)"
                : "1px solid var(--mantine-color-asxGray-4)",
              background: selected
                ? "var(--mantine-color-indigo-6)"
                : "transparent",
              color: "white",
              fontSize: 11,
              lineHeight: "14px",
              textAlign: "center",
              flexShrink: 0,
            }}
          >
            {selected ? "✓" : ""}
          </Box>

          <Text size="sm">{item.label}</Text>
        </Group>
      </UnstyledButton>
    );
  }

  const Icon = item.icon;

  return (
    <UnstyledButton
      onClick={() => onCommand(item.id)}
      style={{
        width: "100%",
        padding: ITEM_PADDING,
        borderRadius: 8,
        color: "var(--mantine-color-asxGray-8)",
        fontWeight: 500,
      }}
    >
      <Group gap="xs" wrap="nowrap">
        {Icon ? (
          <Icon
            size={28}
            stroke={1.3}
            color="var(--mantine-color-asxGray-7)"
          />
        ) : null}

        <Text size="sm">{item.label}</Text>
      </Group>
    </UnstyledButton>
  );
}

function isColumnVisible(
  column: MegamenuColumn,
  radioValues: MegamenuRadioValues,
  checkboxValues: MegamenuCheckboxValues
) {
  if (!column.visibleWhen) {
    return true;
  }

  if (column.visibleWhen.source === "checkbox") {
    return (
      Boolean(
        checkboxValues[column.visibleWhen.checkboxId]
      ) === column.visibleWhen.checked
    );
  }

  return (
    radioValues[column.visibleWhen.radioGroupId] ===
    column.visibleWhen.value
  );
}

function groupColumnsIntoSlots(
  columns: MegamenuColumn[]
): ColumnSlot[] {
  const slots: ColumnSlot[] = [];
  const slottedIds = new Set<string>();

  columns.forEach((column) => {
    if (!column.slotId) {
      slots.push({
        key: column.id,
        columns: [column],
        animated: false,
      });
      return;
    }

    if (slottedIds.has(column.slotId)) {
      return;
    }

    slottedIds.add(column.slotId);
    slots.push({
      key: column.slotId,
      columns: columns.filter(
        (candidate) =>
          candidate.slotId === column.slotId
      ),
      animated: true,
    });
  });

  return slots;
}
