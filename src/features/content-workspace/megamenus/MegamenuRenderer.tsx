/*
 * File purpose: Generic megamenu renderer for command, radio, checkbox, select, text input, and button menu layouts.
 *
 * Imports:
 * - Box, Button, Group, Select, Stack, Text, TextInput, UnstyledButton, from "@mantine/core" provides Mantine UI primitives, theme helpers, component types, or styling utilities used in this file.
 * - IconChevronDown from "@tabler/icons-react" provides icon components used by dropdown-style megamenu actions.
 * - useState from "react" provides React hooks, refs, component helpers, or React-only types used in this file.
 * - type { CSSProperties, ReactNode } from "react" provides React hooks, refs, component helpers, or React-only types used in this file.
 * - type { MegamenuCheckboxValues, MegamenuColumn, MegamenuConfig, MegamenuFieldValues, MegamenuItem, MegamenuRadioValues, } from "./types" provides shared data types used by this feature.
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
import { IconChevronDown } from "@tabler/icons-react";
import { useState } from "react";
import type {
  CSSProperties,
  ReactNode,
} from "react";

import type {
  MegamenuCheckboxValues,
  MegamenuColumn,
  MegamenuConfig,
  MegamenuFieldValues,
  MegamenuItem,
  MegamenuRadioValues,
} from "./types";

export const MEGAMENU_COLUMN_WIDTH = 280;
const COLUMN_GAP = 48;
const COLUMN_HEADER_GAP = 12;
const COLUMN_ITEM_GAP = 4;
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

type MegamenuColumnLayoutProps = {
  children: ReactNode;
  header?: string;
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
      w={MEGAMENU_COLUMN_WIDTH}
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
    MEGAMENU_COLUMN_WIDTH +
    (hasLeadingGap ? COLUMN_GAP : 0);

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
        w={MEGAMENU_COLUMN_WIDTH}
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
    <MegamenuColumnLayout header={column.header}>
      <MenuItems {...menuItemsProps} />
    </MegamenuColumnLayout>
  );
}

export function MegamenuColumnLayout({
  children,
  header,
}: MegamenuColumnLayoutProps) {
  return (
    <Stack gap={COLUMN_HEADER_GAP} w="100%">
      {header ? <MenuColumnHeader title={header} /> : null}
      <Stack gap={COLUMN_ITEM_GAP}>{children}</Stack>
    </Stack>
  );
}

function MenuColumnHeader({
  title,
}: MenuColumnHeaderProps) {
  return (
    <Text size="15px" fw={700} c="asxGray.6" tt="uppercase">
      {title}
    </Text>
  );
}

type MenuColumnHeaderProps = {
  title: string;
};

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
        <Text size="16px">{item.label}</Text>
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
        <Text size="16px">{item.label}</Text>
      </CheckboxMenuItem>
    );
  }

  if (item.type === "select") {
    return (
      <Box my={6}>
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
                fontSize: 15,
                minHeight: 36,
              },
            }}
          />
        </FieldMenuItem>
      </Box>
    );
  }

  if (item.type === "text-input") {
    return (
      <Box my={6}>
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
                fontSize: 15,
                minHeight: 36,
              },
            }}
          />
        </FieldMenuItem>
      </Box>
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

  return (
    <MegamenuActionItem
      item={item}
      onClick={() => onCommand(item.id)}
    />
  );
}

type MegamenuCommandLabelProps = {
  children: ReactNode;
};

export function MegamenuCommandLabel({
  children,
}: MegamenuCommandLabelProps) {
  return <Text size="16px">{children}</Text>;
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
      <Text size="16px" fw={500} c="asxGray.8">
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
  const [isHovered, setIsHovered] = useState(false);
  const isHighlighted = selected || isHovered;

  return (
    <UnstyledButton
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: "100%",
        padding: ITEM_PADDING,
        borderRadius: 8,
        border: isHighlighted
          ? `1px solid var(--mantine-color-${selected ? "indigo-2" : "asxBlue-1"
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
  const [isHovered, setIsHovered] = useState(false);
  const isHighlighted = selected || isHovered;

  return (
    <UnstyledButton
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: "100%",
        padding: ITEM_PADDING,
        borderRadius: 8,
        border: isHighlighted
          ? `1px solid var(--mantine-color-${selected ? "indigo-2" : "asxBlue-1"
          })`
          : "1px solid transparent",
        background: selected
          ? "var(--mantine-color-indigo-1)"
          : isHovered
            ? "var(--mantine-color-asxBlue-0)"
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
  ariaLabel?: string;
  selected?: boolean;
  width?: CSSProperties["width"];
  paddingBlock?: CSSProperties["paddingBlock"];
  hoverStyle?: CSSProperties;
};

export function MegamenuCommandItem({
  children,
  onClick,
  ariaLabel,
  selected = false,
  width = "100%",
  paddingBlock,
  hoverStyle,
}: CommandMenuItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const hoverBorder =
    hoverStyle?.border ??
    "1px solid var(--mantine-color-asxBlue-1)";
  const hoverBackground =
    hoverStyle?.background ??
    "var(--mantine-color-asxBlue-0)";
  const hoverColor =
    hoverStyle?.color ??
    "var(--mantine-color-asxGray-8)";

  return (
    <UnstyledButton
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width,
        padding: ITEM_PADDING,
        paddingBlock,
        borderRadius: 8,
        border: selected
          ? "1px solid var(--mantine-color-indigo-2)"
          : isHovered
            ? hoverBorder
            : "1px solid transparent",
        background: selected
          ? "var(--mantine-color-indigo-1)"
          : isHovered
            ? hoverBackground
            : "transparent",
        color: selected
          ? "var(--mantine-color-indigo-9)"
          : isHovered
            ? hoverColor
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

type MegamenuActionItemProps = {
  item: Extract<
    MegamenuItem,
    { type: "command" | "dropdown" }
  >;
  onClick: () => void;
  width?: CSSProperties["width"];
  paddingBlock?: CSSProperties["paddingBlock"];
  hoverStyle?: CSSProperties;
  showLabel?: boolean;
};

export function MegamenuActionItem({
  item,
  onClick,
  width,
  paddingBlock,
  hoverStyle,
  showLabel = true,
}: MegamenuActionItemProps) {
  const Icon = item.icon;

  return (
    <MegamenuCommandItem
      ariaLabel={item.label}
      width={width}
      paddingBlock={paddingBlock}
      hoverStyle={hoverStyle}
      onClick={onClick}
    >
      {Icon ? (
        <Icon
          size={28}
          stroke={1.3}
          color="var(--mantine-color-asxGray-7)"
        />
      ) : null}
      {showLabel ? (
        <MegamenuCommandLabel>
          {item.label}
        </MegamenuCommandLabel>
      ) : null}
      {item.type === "dropdown" ? (
        <IconChevronDown size={17} stroke={1.5} />
      ) : null}
    </MegamenuCommandItem>
  );
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
  onFieldChange = () => { },
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
