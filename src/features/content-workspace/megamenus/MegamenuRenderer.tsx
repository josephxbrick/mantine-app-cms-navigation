/*
 * Generic megamenu renderer.
 * - Converts megamenu config objects into visible columns and menu items.
 * - Handles radio, checkbox, command, and conditionally visible columns.
 */
import {
  Box,
  Button,
  Group,
  Select,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import type { ReactNode } from "react";

import type {
  MegamenuCheckboxValues,
  MegamenuColumn,
  MegamenuConfig,
  MegamenuFieldValues,
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
  fieldValues?: MegamenuFieldValues;
  onRadioChange: (groupId: string, value: string) => void;
  onCheckboxChange: (itemId: string) => void;
  onFieldChange?: (itemId: string, value: string) => void;
  onCommand: (itemId: string) => void;
};

type ColumnSlot = {
  key: string;
  columns: MegamenuColumn[];
  animated: boolean;
};

type DisplayGroupProps = {
  children: ReactNode;
};

function DisplayGroup({ children }: DisplayGroupProps) {
  return (
    <Group align="stretch" gap={0}>
      {children}
    </Group>
  );
}

type MenuColumnSlotsProps = {
  slots: ColumnSlot[];
  radioValues: MegamenuRadioValues;
  checkboxValues: MegamenuCheckboxValues;
  fieldValues: MegamenuFieldValues;
  onRadioChange: (groupId: string, value: string) => void;
  onCheckboxChange: (itemId: string) => void;
  onFieldChange: (itemId: string, value: string) => void;
  onCommand: (itemId: string) => void;
};

function MenuColumnSlots({
  slots,
  radioValues,
  checkboxValues,
  fieldValues,
  onRadioChange,
  onCheckboxChange,
  onFieldChange,
  onCommand,
}: MenuColumnSlotsProps) {
  const columnViewProps = {
    radioValues,
    checkboxValues,
    fieldValues,
    onRadioChange,
    onCheckboxChange,
    onFieldChange,
    onCommand,
  };

  return (
    <>
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
                  {...columnViewProps}
                />
              ) : null}
            </AnimatedColumnSlot>
          );
        }

        if (!visibleColumn) {
          return null;
        }

        return (
          <StaticColumnSlot
            key={slot.key}
            hasLeadingGap={index > 0}
          >
            <MenuColumnView
              column={visibleColumn}
              {...columnViewProps}
            />
          </StaticColumnSlot>
        );
      })}
    </>
  );
}

type StaticColumnSlotProps = {
  children: ReactNode;
  hasLeadingGap: boolean;
};

function ColumnSlotDisplay({
  children,
  hasLeadingGap,
}: StaticColumnSlotProps) {
  return (
    <Box
      w={COLUMN_WIDTH}
      ml={hasLeadingGap ? COLUMN_GAP : 0}
      style={{ flexShrink: 0 }}
    >
      {children}
    </Box>
  );
}

function StaticColumnSlot(
  props: StaticColumnSlotProps
) {
  return <ColumnSlotDisplay {...props} />;
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

  const displayGroupProps = {
    visible,
    expandedWidth,
    hasLeadingGap,
  };

  return (
    <AnimatedColumnDisplay {...displayGroupProps}>
      {children}
    </AnimatedColumnDisplay>
  );
}

type AnimatedColumnDisplayProps = {
  children: ReactNode;
  visible: boolean;
  expandedWidth: number;
  hasLeadingGap: boolean;
};

function AnimatedColumnDisplay({
  children,
  visible,
  expandedWidth,
  hasLeadingGap,
}: AnimatedColumnDisplayProps) {
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

type MenuColumnViewProps = {
  column: MegamenuColumn;
  radioValues: MegamenuRadioValues;
  checkboxValues: MegamenuCheckboxValues;
  fieldValues: MegamenuFieldValues;
  onRadioChange: (groupId: string, value: string) => void;
  onCheckboxChange: (itemId: string) => void;
  onFieldChange: (itemId: string, value: string) => void;
  onCommand: (itemId: string) => void;
};

function MenuColumnView({
  column,
  radioValues,
  checkboxValues,
  fieldValues,
  onRadioChange,
  onCheckboxChange,
  onFieldChange,
  onCommand,
}: MenuColumnViewProps) {
  const menuItemsProps = {
    items: column.items,
    radioValues,
    checkboxValues,
    fieldValues,
    onRadioChange,
    onCheckboxChange,
    onFieldChange,
    onCommand,
  };

  return (
    <MenuColumnDisplay>
      {column.header ? (
        <MenuColumnHeader title={column.header} />
      ) : null}
      <MenuItems {...menuItemsProps} />
    </MenuColumnDisplay>
  );
}

function MenuColumnDisplay({
  children,
}: DisplayGroupProps) {
  return (
    <Stack gap={8} w="100%">
      {children}
    </Stack>
  );
}

type MenuColumnHeaderProps = {
  title: string;
};

function MenuColumnHeader({
  title,
}: MenuColumnHeaderProps) {
  return (
    <Text size="xs" fw={700} c="asxGray.6" tt="uppercase">
      {title}
    </Text>
  );
}

type MenuItemsProps = Omit<
  MenuColumnViewProps,
  "column"
> & {
  items: MegamenuItem[];
};

function MenuItems({
  items,
  radioValues,
  checkboxValues,
  fieldValues,
  onRadioChange,
  onCheckboxChange,
  onFieldChange,
  onCommand,
}: MenuItemsProps) {
  return (
    <>
      {items.map((item) => (
        <MenuItemView
          key={item.id}
          item={item}
          radioValues={radioValues}
          checkboxValues={checkboxValues}
          fieldValues={fieldValues}
          onRadioChange={onRadioChange}
          onCheckboxChange={onCheckboxChange}
          onFieldChange={onFieldChange}
          onCommand={onCommand}
        />
      ))}
    </>
  );
}

type MenuItemViewProps = {
  item: MegamenuItem;
  radioValues: MegamenuRadioValues;
  checkboxValues: MegamenuCheckboxValues;
  fieldValues: MegamenuFieldValues;
  onRadioChange: (groupId: string, value: string) => void;
  onCheckboxChange: (itemId: string) => void;
  onFieldChange: (itemId: string, value: string) => void;
  onCommand: (itemId: string) => void;
};

function MenuItemView({
  item,
  radioValues,
  checkboxValues,
  fieldValues,
  onRadioChange,
  onCheckboxChange,
  onFieldChange,
  onCommand,
}: MenuItemViewProps) {
  if (item.type === "radio") {
    const selected =
      radioValues[item.groupId] === item.value;

    return (
      <RadioMenuItem
        selected={selected}
        onClick={() =>
          onRadioChange(item.groupId, item.value)
        }
      >
        <Text size="sm">{item.label}</Text>
      </RadioMenuItem>
    );
  }

  if (item.type === "checkbox") {
    const selected = Boolean(checkboxValues[item.id]);

    return (
      <CheckboxMenuItem
        selected={selected}
        onClick={() => onCheckboxChange(item.id)}
      >
        <CheckboxMark selected={selected} />
        <Text size="sm">{item.label}</Text>
      </CheckboxMenuItem>
    );
  }

  if (item.type === "select") {
    return (
      <FieldMenuItem label={item.label}>
        <Select
          size="xs"
          value={fieldValues[item.id] ?? null}
          placeholder={item.placeholder}
          data={item.options}
          onChange={(value) =>
            onFieldChange(item.id, value ?? "")
          }
          styles={{
            input: {
              minHeight: 36,
            },
          }}
        />
      </FieldMenuItem>
    );
  }

  if (item.type === "text-input") {
    return (
      <FieldMenuItem label={item.label}>
        <TextInput
          size="xs"
          value={fieldValues[item.id] ?? ""}
          placeholder={item.placeholder}
          onChange={(event) =>
            onFieldChange(
              item.id,
              event.currentTarget.value
            )
          }
          styles={{
            input: {
              minHeight: 36,
            },
          }}
        />
      </FieldMenuItem>
    );
  }

  if (item.type === "button") {
    return (
      <Button
        size="xs"
        radius={4}
        onClick={() => onCommand(item.id)}
        style={{ alignSelf: "flex-start" }}
      >
        {item.label}
      </Button>
    );
  }

  const Icon = item.icon;

  return (
    <CommandMenuItem onClick={() => onCommand(item.id)}>
      <CommandIcon Icon={Icon} />
      <Text size="sm">{item.label}</Text>
    </CommandMenuItem>
  );
}

type FieldMenuItemProps = {
  children: ReactNode;
  label: string;
};

function FieldMenuItem({
  children,
  label,
}: FieldMenuItemProps) {
  return (
    <Stack gap={4}>
      <Text size="sm" fw={500} c="asxGray.8">
        {label}
      </Text>
      {children}
    </Stack>
  );
}

type RadioMenuItemProps = {
  children: ReactNode;
  selected: boolean;
  onClick: () => void;
};

function RadioMenuItem({
  children,
  selected,
  onClick,
}: RadioMenuItemProps) {
  return (
    <UnstyledButton
      onClick={onClick}
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
      {children}
    </UnstyledButton>
  );
}

type CheckboxMenuItemProps = {
  children: ReactNode;
  selected: boolean;
  onClick: () => void;
};

function CheckboxMenuItem({
  children,
  selected,
  onClick,
}: CheckboxMenuItemProps) {
  return (
    <UnstyledButton
      onClick={onClick}
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
      <InlineMenuItemDisplay>
        {children}
      </InlineMenuItemDisplay>
    </UnstyledButton>
  );
}

type CheckboxMarkProps = {
  selected: boolean;
};

function CheckboxMark({ selected }: CheckboxMarkProps) {
  return (
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
  );
}

type CommandMenuItemProps = {
  children: ReactNode;
  onClick: () => void;
};

function CommandMenuItem({
  children,
  onClick,
}: CommandMenuItemProps) {
  return (
    <UnstyledButton
      onClick={onClick}
      style={{
        width: "100%",
        padding: ITEM_PADDING,
        borderRadius: 8,
        color: "var(--mantine-color-asxGray-8)",
        fontWeight: 500,
      }}
    >
      <InlineMenuItemDisplay>
        {children}
      </InlineMenuItemDisplay>
    </UnstyledButton>
  );
}

type CommandIconProps = {
  Icon: Extract<
    MegamenuItem,
    { type: "command" }
  >["icon"];
};

function CommandIcon({ Icon }: CommandIconProps) {
  return Icon ? (
    <Icon
      size={28}
      stroke={1.3}
      color="var(--mantine-color-asxGray-7)"
    />
  ) : null;
}

function InlineMenuItemDisplay({
  children,
}: DisplayGroupProps) {
  return (
    <Group gap="xs" wrap="nowrap">
      {children}
    </Group>
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

export function MegamenuRenderer({
  config,
  radioValues,
  checkboxValues,
  fieldValues = {},
  onRadioChange,
  onCheckboxChange,
  onFieldChange = () => {},
  onCommand,
}: MegamenuRendererProps) {
  const slots = groupColumnsIntoSlots(config.columns);

  const menuColumnSlotsProps = {
    slots,
    radioValues,
    checkboxValues,
    fieldValues,
    onRadioChange,
    onCheckboxChange,
    onFieldChange,
    onCommand,
  };

  return (
    <DisplayGroup>
      <MenuColumnSlots {...menuColumnSlotsProps} />
    </DisplayGroup>
  );
}
