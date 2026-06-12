/*
 * File purpose: Generic megamenu renderer for command, radio, checkbox, select, text input, and button menu layouts.
 *
 * Imports:
 * - Box, Button, Group, Select, Stack, Text, TextInput, UnstyledButton, from "@mantine/core" provides Mantine UI primitives, theme helpers, component types, or styling utilities used in this file.
 * - IconChevronDown from "@tabler/icons-react" provides icon components used by dropdown-style megamenu actions.
 * - useEffect, useLayoutEffect, useRef, useState from "react" provides React hooks, refs, component helpers, or React-only types used in this file.
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
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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

const MIN_COLUMN_GAP = 40;
const MAX_COLUMN_GAP = 72;
const WRAPPED_ROW_GAP = 44;
const VIEWPORT_HORIZONTAL_MARGIN = 32;
const COLUMN_GROUP_PADDING = 32;
const COLUMN_HEADER_GAP = 12;
const COLUMN_ITEM_GAP = 4;
const ITEM_PADDING = "8px 10px";
const COMMAND_ITEM_PADDING = "6px 10px";
const ITEM_INLINE_GAP = 10;
const ITEM_HORIZONTAL_PADDING = 20;
const COMMAND_ICON_WIDTH = 20;
const DROPDOWN_ICON_WIDTH = 17;
const CHECKBOX_MARK_WIDTH = 16;
const DEFAULT_TEXT_WIDTH_MULTIPLIER = 8;
const COMMAND_CLICK_FEEDBACK_STEP_MS = 130;
const DEFAULT_MAX_COLUMNS_PER_ROW = Number.MAX_SAFE_INTEGER;

let measurementContext: CanvasRenderingContext2D | null =
  null;

function getMeasurementContext() {
  if (typeof document === "undefined") {
    return null;
  }

  if (!measurementContext) {
    measurementContext = document
      .createElement("canvas")
      .getContext("2d");
  }

  return measurementContext;
}

function getMenuFontFamily() {
  if (typeof window === "undefined") {
    return "Arial, sans-serif";
  }

  return (
    window.getComputedStyle(document.body).fontFamily ||
    "Arial, sans-serif"
  );
}

function measureMenuText(
  text: string,
  size: number,
  weight: number
) {
  const context = getMeasurementContext();

  if (!context) {
    return text.length * DEFAULT_TEXT_WIDTH_MULTIPLIER;
  }

  context.font = `${weight} ${size}px ${getMenuFontFamily()}`;

  return context.measureText(text).width;
}

function getItemMeasurementLabel(item: MegamenuItem) {
  if (item.type === "delimiter") {
    return "";
  }

  if (item.type === "select") {
    const labels = [
      item.label,
      item.placeholder ?? "",
      ...item.options.map((option) => option.label),
    ];

    return labels.reduce(
      (longest, label) =>
        label.length > longest.length ? label : longest,
      ""
    );
  }

  if (item.type === "text-input") {
    return item.placeholder &&
      item.placeholder.length > item.label.length
      ? item.placeholder
      : item.label;
  }

  return item.label;
}

function getItemMeasurementWeight(item: MegamenuItem) {
  return item.type === "radio" || item.type === "checkbox"
    ? 700
    : 500;
}

function getMenuItemWidth(item: MegamenuItem) {
  const labelWidth = measureMenuText(
    getItemMeasurementLabel(item),
    16,
    getItemMeasurementWeight(item)
  );

  if (item.type === "command") {
    const iconWidth = item.icon
      ? COMMAND_ICON_WIDTH + ITEM_INLINE_GAP
      : 0;

    return (
      labelWidth + iconWidth + ITEM_HORIZONTAL_PADDING
    );
  }

  if (item.type === "dropdown") {
    const iconWidth = item.icon
      ? COMMAND_ICON_WIDTH + ITEM_INLINE_GAP
      : 0;

    return (
      labelWidth +
      iconWidth +
      ITEM_INLINE_GAP +
      DROPDOWN_ICON_WIDTH +
      ITEM_HORIZONTAL_PADDING
    );
  }

  if (item.type === "checkbox") {
    return (
      labelWidth +
      CHECKBOX_MARK_WIDTH +
      ITEM_INLINE_GAP +
      ITEM_HORIZONTAL_PADDING
    );
  }

  if (item.type === "button") {
    return labelWidth + ITEM_HORIZONTAL_PADDING;
  }

  return labelWidth + ITEM_HORIZONTAL_PADDING;
}

function getMegamenuColumnWidth(column: MegamenuColumn) {
  if (column.width) {
    return column.width;
  }

  const headerWidth = column.header
    ? measureMenuText(column.header.toUpperCase(), 15, 700)
    : 0;
  const itemWidth = column.items.reduce(
    (widest, item) =>
      Math.max(widest, getMenuItemWidth(item)),
    0
  );

  return Math.ceil(Math.max(headerWidth, itemWidth));
}

function getResponsiveColumnGap(
  totalColumnWidth: number,
  visibleColumnCount: number,
  viewportWidth: number
) {
  const gapCount = Math.max(visibleColumnCount - 1, 0);

  if (gapCount === 0) {
    return 0;
  }

  const availableWidth = Math.max(
    0,
    viewportWidth - VIEWPORT_HORIZONTAL_MARGIN
  );
  const preferredWidth =
    totalColumnWidth + gapCount * MAX_COLUMN_GAP;

  if (preferredWidth <= availableWidth) {
    return MAX_COLUMN_GAP;
  }

  const availableGap =
    (availableWidth - totalColumnWidth) / gapCount;

  return Math.max(
    MIN_COLUMN_GAP,
    Math.min(MAX_COLUMN_GAP, availableGap)
  );
}

function useResponsiveColumnGap(
  totalColumnWidth: number,
  visibleColumnCount: number
) {
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window === "undefined"
      ? Number.POSITIVE_INFINITY
      : window.innerWidth
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleResize = () =>
      setViewportWidth(window.innerWidth);

    handleResize();
    window.addEventListener("resize", handleResize);

    return () =>
      window.removeEventListener("resize", handleResize);
  }, []);

  return getResponsiveColumnGap(
    totalColumnWidth,
    visibleColumnCount,
    viewportWidth
  );
}

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

type ColumnDisplayGroupProps = {
  columnGap: number;
  rows: ReactNode[][];
  wrapRows: boolean;
};

type InlineMenuItemDisplayProps = {
  children: ReactNode;
};

type MegamenuColumnLayoutProps = {
  children: ReactNode;
  header?: string;
};

function ColumnDisplayGroup({
  columnGap,
  rows,
  wrapRows,
}: ColumnDisplayGroupProps) {
  const groupRef = useRef<HTMLDivElement | null>(null);
  const delimiterTops =
    useWrappedColumnDelimiterTops(groupRef);

  return (
    <Box pos="relative">
      <Box
        ref={groupRef}
        style={{
          padding: COLUMN_GROUP_PADDING,
          display: "flex",
          flexDirection: wrapRows ? "row" : "column",
          flexWrap: wrapRows ? "wrap" : "nowrap",
          alignItems: "stretch",
          columnGap,
          rowGap: WRAPPED_ROW_GAP,
        }}
      >
        {wrapRows
          ? rows.flat()
          : rows.map((row, rowIndex) => (
            <Group
              key={rowIndex}
              align="stretch"
              wrap="nowrap"
              style={{
                columnGap,
                flexShrink: 0,
              }}
            >
              {row}
            </Group>
          ))}
      </Box>
      {delimiterTops.map((delimiterTop) => (
        <Box
          key={delimiterTop}
          aria-hidden="true"
          style={{
            position: "absolute",
            left: COLUMN_GROUP_PADDING,
            right: COLUMN_GROUP_PADDING,
            top: delimiterTop,
            height: 1,
            background:
              "var(--mantine-color-asxGray-4)",
            pointerEvents: "none",
          }}
        />
      ))}
    </Box>
  );
}

function useWrappedColumnDelimiterTops(
  groupRef: React.RefObject<HTMLDivElement | null>
) {
  const [delimiterTops, setDelimiterTops] = useState<
    number[]
  >([]);

  useLayoutEffect(() => {
    const groupElement = groupRef.current;

    if (!groupElement) {
      setDelimiterTops([]);
      return;
    }

    const updateDelimiterTops = () => {
      const groupRect =
        groupElement.getBoundingClientRect();
      const columnElements = Array.from(
        groupElement.children
      ).filter(
        (child): child is HTMLElement =>
          child instanceof HTMLElement &&
          child.offsetParent !== null
      );

      if (columnElements.length < 2) {
        setDelimiterTops([]);
        return;
      }

      const rows = columnElements.reduce<
        {
          top: number;
          bottom: number;
        }[]
      >((rowGroups, element) => {
        const elementRect =
          element.getBoundingClientRect();
        const existingRow = rowGroups.find(
          (row) =>
            Math.abs(row.top - elementRect.top) < 1
        );

        if (existingRow) {
          existingRow.bottom = Math.max(
            existingRow.bottom,
            elementRect.bottom
          );
          return rowGroups;
        }

        rowGroups.push({
          top: elementRect.top,
          bottom: elementRect.bottom,
        });
        return rowGroups;
      }, []);

      rows.sort((firstRow, secondRow) =>
        firstRow.top - secondRow.top
      );

      const nextDelimiterTops = rows
        .slice(1)
        .map((row, rowIndex) =>
          Math.round(
            (rows[rowIndex].bottom + row.top) / 2 -
              groupRect.top
          )
        );

      setDelimiterTops((currentDelimiterTops) =>
        currentDelimiterTops.length ===
          nextDelimiterTops.length &&
        currentDelimiterTops.every(
          (delimiterTop, index) =>
            delimiterTop === nextDelimiterTops[index]
        )
          ? currentDelimiterTops
          : nextDelimiterTops
      );
    };

    updateDelimiterTops();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateDelimiterTops);

      return () =>
        window.removeEventListener(
          "resize",
          updateDelimiterTops
        );
    }

    const resizeObserver = new ResizeObserver(
      updateDelimiterTops
    );
    resizeObserver.observe(groupElement);
    Array.from(groupElement.children).forEach((child) => {
      resizeObserver.observe(child);
    });
    window.addEventListener("resize", updateDelimiterTops);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener(
        "resize",
        updateDelimiterTops
      );
    };
  });

  return delimiterTops;
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
  maxColumnsPerRow: number;
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
  maxColumnsPerRow,
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
  const slotViews = slots.map((slot) => {
    const visibleColumn =
      slot.columns.find((column) =>
        isColumnVisible(
          column,
          radioValues,
          checkboxValues
        )
      ) ?? null;

    return {
      slot,
      visibleColumn,
      columnWidth: visibleColumn
        ? getMegamenuColumnWidth(visibleColumn)
        : 0,
    };
  });
  const visibleColumnCount = slotViews.filter(
    ({ visibleColumn }) => Boolean(visibleColumn)
  ).length;
  const sharedColumnWidth = slotViews.reduce(
    (widest, { columnWidth }) =>
      Math.max(widest, columnWidth),
    0
  );
  const shouldForceColumnRows =
    maxColumnsPerRow < visibleColumnCount;
  const layoutColumnCount = shouldForceColumnRows
    ? Math.min(maxColumnsPerRow, visibleColumnCount)
    : visibleColumnCount;
  const totalColumnWidth =
    layoutColumnCount * sharedColumnWidth;
  const columnGap = useResponsiveColumnGap(
    totalColumnWidth,
    layoutColumnCount
  );
  const visibleSlotViews = slotViews.filter(
    ({ visibleColumn }) => Boolean(visibleColumn)
  );
  const renderColumnSlot = ({
    slot,
    visibleColumn,
  }: (typeof visibleSlotViews)[number]) => {
    if (!visibleColumn) {
      return null;
    }

    if (slot.animated) {
      return (
        <AnimatedColumnSlot
          key={slot.key}
          columnWidth={sharedColumnWidth}
        >
          <MenuColumnView
            column={visibleColumn}
            {...columnViewProps}
          />
        </AnimatedColumnSlot>
      );
    }

    return (
      <StaticColumnSlot
        key={slot.key}
        columnWidth={sharedColumnWidth}
      >
        <MenuColumnView
          column={visibleColumn}
          {...columnViewProps}
        />
      </StaticColumnSlot>
    );
  };
  const columnSlotViews = visibleSlotViews.map(
    renderColumnSlot
  );
  const rows = shouldForceColumnRows
    ? chunkItems(columnSlotViews, maxColumnsPerRow)
    : [columnSlotViews];

  return (
    <ColumnDisplayGroup
      columnGap={columnGap}
      rows={rows}
      wrapRows={!shouldForceColumnRows}
    />
  );
}

type StaticColumnSlotProps = {
  children: ReactNode;
  columnWidth: number;
};

function ColumnSlotDisplay({
  children,
  columnWidth,
}: StaticColumnSlotProps) {
  return (
    <Box
      w={columnWidth}
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
  columnWidth,
  children,
}: {
  columnWidth: number;
  children: React.ReactNode;
}) {
  const displayGroupProps = {
    columnWidth,
  };

  return (
    <AnimatedColumnDisplay {...displayGroupProps}>
      {children}
    </AnimatedColumnDisplay>
  );
}

type AnimatedColumnDisplayProps = {
  children: ReactNode;
  columnWidth: number;
};

function AnimatedColumnDisplay({
  children,
  columnWidth,
}: AnimatedColumnDisplayProps) {
  return (
    <Box
      style={{
        width: columnWidth,
        overflow: "hidden",
        flexShrink: 0,
        transition: "width 180ms ease",
      }}
    >
      <Box
        w={columnWidth}
        style={{
          transform: "translateX(0)",
          opacity: 1,
          transition:
            "transform 180ms ease, opacity 120ms ease",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

function chunkItems<T>(items: T[], chunkSize: number) {
  const chunks: T[][] = [];
  const normalizedChunkSize = Math.max(
    1,
    Math.floor(chunkSize)
  );

  for (
    let index = 0;
    index < items.length;
    index += normalizedChunkSize
  ) {
    chunks.push(
      items.slice(index, index + normalizedChunkSize)
    );
  }

  return chunks;
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
      {column.content ?? <MenuItems {...menuItemsProps} />}
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
  if (item.type === "delimiter") {
    return <MegamenuDelimiter />;
  }

  if (item.type === "radio") {
    const selected =
      radioValues[item.groupId] === item.value;

    return (
      <MegamenuRadioItem
        selected={selected}
        onClick={() =>
          onRadioChange(item.groupId, item.value)
        }
      >
        <Text size="16px">{item.label}</Text>
      </MegamenuRadioItem>
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

export function MegamenuDelimiter() {
  return (
    <Box
      my={6}
      style={{
        height: 1,
        background: "var(--mantine-color-asxGray-3)",
        width: "100%",
      }}
    />
  );
}

type RadioMenuItemProps = {
  children: ReactNode;
  selected: boolean;
  onClick: () => void;
};

export function MegamenuRadioItem({
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
          ? `1px solid var(--mantine-color-${
              selected ? "asxIndigo-2" : "asxBlue-1"
            })`
          : "1px solid transparent",
        borderLeft: selected
          ? "4px solid var(--mantine-color-indigo-6)"
          : isHovered
            ? "3px solid var(--mantine-color-asxBlue-1)"
            : "3px solid transparent",
        background: selected
          ? "var(--mantine-color-asxIndigo-0)"
          : isHovered
            ? "var(--mantine-color-asxBlue-0)"
            : "transparent",
        color: selected
          ? "var(--mantine-color-asxGray-8)"
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
  width?: CSSProperties["width"];
};

export function CheckboxMenuItem({
  children,
  selected,
  onClick,
  width = "100%",
}: CheckboxMenuItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isHighlighted = selected || isHovered;

  return (
    <UnstyledButton
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width,
        padding: ITEM_PADDING,
        borderRadius: 8,
        border: isHighlighted
          ? `1px solid var(--mantine-color-${
              selected ? "asxIndigo-2" : "asxBlue-1"
            })`
          : "1px solid transparent",
        background: selected
          ? "var(--mantine-color-asxIndigo-0)"
          : isHovered
            ? "var(--mantine-color-asxBlue-0)"
            : "transparent",
        color: "var(--mantine-color-asxGray-8)",
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

export function CheckboxMark({ selected }: CheckboxMarkProps) {
  return (
    <Box
      style={{
        width: 16,
        height: 16,
        borderRadius: 4,
        border: selected
          ? "1px solid var(--mantine-color-indigo-6)"
          : "1px solid var(--mantine-color-asxGray-6)",
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
  closeParentMegamenu?: boolean;
  selected?: boolean;
  width?: CSSProperties["width"];
  paddingBlock?: CSSProperties["paddingBlock"];
  hoverStyle?: CSSProperties;
};

type CommandClickFeedbackState = "idle" | "active";

export function MegamenuCommandItem({
  children,
  onClick,
  ariaLabel,
  closeParentMegamenu = true,
  selected = false,
  width = "100%",
  paddingBlock,
  hoverStyle,
}: CommandMenuItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [
    clickFeedbackState,
    setClickFeedbackState,
  ] = useState<CommandClickFeedbackState>("idle");
  const clickFlashTimeoutsRef = useRef<number[]>([]);
  const isClickFeedbackActive =
    clickFeedbackState === "active";
  const isHighlighted = isHovered;
  const hoverBorder =
    hoverStyle?.border ??
    "1px solid var(--mantine-color-asxBlue-1)";
  const hoverBackground =
    hoverStyle?.background ??
    "var(--mantine-color-asxBlue-0)";
  const hoverColor =
    hoverStyle?.color ??
    "var(--mantine-color-asxGray-8)";
  const clickBorder =
    "1px solid var(--mantine-color-asxBlue-2)";
  const clickBackground =
    "var(--mantine-color-asxBlue-1)";

  useEffect(() => {
    return () => {
      clickFlashTimeoutsRef.current.forEach((timeoutId) =>
        window.clearTimeout(timeoutId)
      );
    };
  }, []);

  const clearClickFlashTimeouts = () => {
    clickFlashTimeoutsRef.current.forEach((timeoutId) =>
      window.clearTimeout(timeoutId)
    );
    clickFlashTimeoutsRef.current = [];
  };

  const handleClick = () => {
    setClickFeedbackState("active");
    clearClickFlashTimeouts();

    clickFlashTimeoutsRef.current = [
      window.setTimeout(() => {
        setClickFeedbackState("idle");
        clickFlashTimeoutsRef.current = [];
      }, COMMAND_CLICK_FEEDBACK_STEP_MS),
    ];

    onClick();
  };

  return (
    <UnstyledButton
      aria-label={ariaLabel}
      data-megamenu-command={
        closeParentMegamenu ? "true" : undefined
      }
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width,
        padding: COMMAND_ITEM_PADDING,
        paddingBlock,
        borderRadius: 8,
        border: selected
          ? "1px solid var(--mantine-color-asxIndigo-2)"
          : isClickFeedbackActive
            ? clickBorder
          : isHighlighted
            ? hoverBorder
            : "1px solid transparent",
        background: selected
          ? "var(--mantine-color-asxIndigo-0)"
          : isClickFeedbackActive
            ? clickBackground
          : isHighlighted
            ? hoverBackground
            : "transparent",
        color: selected
          ? "var(--mantine-color-asxIndigo-9)"
          : isHighlighted || isClickFeedbackActive
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
          size={20}
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
}: InlineMenuItemDisplayProps) {
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
    maxColumnsPerRow:
      config.maxColumnsPerRow ??
      DEFAULT_MAX_COLUMNS_PER_ROW,
  };

  return <MenuColumnSlots {...menuColumnSlotsProps} />;
}
