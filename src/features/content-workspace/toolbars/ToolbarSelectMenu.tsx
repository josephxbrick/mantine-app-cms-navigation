/*
 * File purpose: Reusable custom pill dropdown for toolbar-style selectors with optional surrounding label chrome.
 *
 * Imports:
 * - Group, Menu, Paper, Stack, Text, UnstyledButton from "@mantine/core" provides Mantine UI primitives, theme helpers, component types, or styling utilities used in this file.
 * - IconChevronDown from "@tabler/icons-react" provides icon components used by dropdown triggers.
 * - forwardRef, useLayoutEffect, useRef, useState from "react" provides React hooks, refs, component helpers, or React-only types used in this file.
 * - type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, ReactNode } from "react" provides React hooks, refs, component helpers, or React-only types used in this file.
 * - MegamenuColumnLayout, MegamenuCommandItem, MegamenuCommandLabel from "../megamenus/MegamenuRenderer" provides the shared dropdown menu presentation.
 */
import {
  Box,
  Group,
  Menu,
  Paper,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import {
  forwardRef,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type {
  ButtonHTMLAttributes,
  CSSProperties,
  HTMLAttributes,
  ReactNode,
} from "react";

import {
  MegamenuColumnLayout,
  MegamenuCommandItem,
  MegamenuCommandLabel,
} from "../megamenus/MegamenuRenderer";

export type ToolbarSelectMenuOption = {
  value: string;
  label: string;
  icon?: ReactNode;
};

type ToolbarSelectMenuProps = {
  label: string;
  options: ToolbarSelectMenuOption[];
  value: string;
  onChange: (value: string) => void;
  animateWidthToContent?: boolean;
  buttonWidth?: CSSProperties["width"];
  menuWidth?: number | "target";
  mode?: "surrounded" | "dropdown-only";
  labelSize?: "xs" | "sm" | "md" | "lg" | "xl";
  pillFill?: CSSProperties["background"];
  pillStroke?: CSSProperties["border"];
  showTriggerIcon?: boolean;
  showMenuIcons?: boolean;
  withinPortal?: boolean;
};

const TOOLBAR_BUBBLE_PADDING_Y = 6;
const SELECT_TRIGGER_WIDTH_TRANSITION = "width 50ms ease-out";
const SELECT_TRIGGER_WIDTH_GUARD_PX = 2;

type SelectorLabelProps = {
  label: string;
  size: "xs" | "sm" | "md" | "lg" | "xl";
  variant: "surrounded" | "dropdown-only";
};

function SelectorLabel({
  label,
  size,
  variant,
}: SelectorLabelProps) {
  const isSurrounded = variant === "surrounded";

  return (
    <Text
      size={size}
      fw={isSurrounded ? 500 : 400}
      c={isSurrounded ? "asxIndigo.8" : "asxGray.7"}
      tt={isSurrounded ? "uppercase" : undefined}
    >
      {label}
    </Text>
  );
}

type ToolbarBubbleProps =
  HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

const ToolbarBubble = forwardRef<
  HTMLDivElement,
  ToolbarBubbleProps
>(function ToolbarBubble(
  { children, style, ...props },
  ref
) {
  return (
    <Paper
      ref={ref}
      {...props}
      radius="xl"
      pl={18}
      pr={TOOLBAR_BUBBLE_PADDING_Y}
      py={TOOLBAR_BUBBLE_PADDING_Y}
      bg="white"
      shadow="xs"
      style={{
        ...style,
        display: "inline-flex",
        flexShrink: 0,
      }}
    >
      <Group gap="md" wrap="nowrap">
        {children}
      </Group>
    </Paper>
  );
});

type TriggerButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
  selected: ToolbarSelectMenuOption;
  animateWidthToContent: boolean;
  width?: CSSProperties["width"];
  pillFill: CSSProperties["background"];
  pillStroke: CSSProperties["border"];
  showTriggerIcon: boolean;
};

const TriggerButton = forwardRef<
  HTMLButtonElement,
  TriggerButtonProps
>(function TriggerButton(
  {
    selected,
    animateWidthToContent,
    width,
    pillFill,
    pillStroke,
    showTriggerIcon,
    style,
    ...props
  },
  ref
) {
  const shouldTruncate =
    Boolean(width) || animateWidthToContent;
  const measureRef = useRef<HTMLDivElement | null>(null);
  const [measuredWidth, setMeasuredWidth] = useState<
    number | null
  >(null);

  useLayoutEffect(() => {
    const element = measureRef.current;

    if (!animateWidthToContent || !element) {
      return;
    }

    const updateWidth = () => {
      setMeasuredWidth(
        Math.ceil(element.getBoundingClientRect().width) +
          SELECT_TRIGGER_WIDTH_GUARD_PX
      );
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [animateWidthToContent, selected.label, selected.icon]);

  const triggerWidth =
    width ??
    (animateWidthToContent && measuredWidth
      ? measuredWidth
      : "max-content");
  const hasMeasuredWidth =
    width !== undefined ||
    (animateWidthToContent && measuredWidth !== null);

  return (
    <UnstyledButton
      ref={ref}
      {...props}
      style={{
        ...style,
        width: triggerWidth,
        minWidth: hasMeasuredWidth ? 0 : "max-content",
        height: 38,
        paddingInline: 14,
        borderRadius: 999,
        display: "flex",
        position: "relative",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--mantine-spacing-xs)",
        background: pillFill,
        border: pillStroke,
        color: "var(--mantine-color-asxGray-7)",
        transition: SELECT_TRIGGER_WIDTH_TRANSITION,
      }}
    >
      {animateWidthToContent ? (
        <Box
          ref={measureRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            visibility: "hidden",
            pointerEvents: "none",
            width: "max-content",
            height: 38,
            paddingInline: 14,
            boxSizing: "border-box",
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--mantine-spacing-xs)",
            whiteSpace: "nowrap",
          }}
        >
          <Group gap="xs" wrap="nowrap">
            {showTriggerIcon ? selected.icon : null}

            <Text size="16px" fw={400}>
              {selected.label}
            </Text>
          </Group>

          <IconChevronDown size={20} />
        </Box>
      ) : null}

      <Group
        gap="xs"
        wrap="nowrap"
        style={{ minWidth: 0, overflow: "hidden" }}
      >
        {showTriggerIcon ? selected.icon : null}

        <Text
          size="16px"
          fw={400}
          truncate={shouldTruncate}
          style={{
            minWidth: 0,
            lineHeight: 1.35,
            whiteSpace: "nowrap",
          }}
        >
          {selected.label}
        </Text>
      </Group>

      <IconChevronDown
        size={20}
        style={{ flexShrink: 0 }}
      />
    </UnstyledButton>
  );
});

type SelectorMenuProps = {
  selected: ToolbarSelectMenuOption;
  options: ToolbarSelectMenuOption[];
  target: ReactNode;
  menuWidth: number | "target";
  showMenuIcons: boolean;
  withinPortal: boolean;
  onChange: (value: string) => void;
};

function SelectorMenu({
  selected,
  options,
  target,
  menuWidth,
  showMenuIcons,
  withinPortal,
  onChange,
}: SelectorMenuProps) {
  const [opened, setOpened] = useState(false);

  const handleSelect = (value: string) => {
    onChange(value);
    setOpened(false);
  };

  return (
    <Menu
      shadow="md"
      width={menuWidth}
      position="bottom-end"
      offset={4}
      withinPortal={withinPortal}
      opened={opened}
      onChange={setOpened}
    >
      <Menu.Target>{target}</Menu.Target>

      <Menu.Dropdown
        px={12}
        py={12}
        onClick={(event) => event.stopPropagation()}
      >
        <MegamenuColumnLayout>
          {options.map((option) => (
            <MegamenuCommandItem
              key={option.value}
              selected={option.value === selected.value}
              closeParentMegamenu={false}
              onClick={() => handleSelect(option.value)}
            >
              {showMenuIcons ? option.icon : null}
              <MegamenuCommandLabel>
                {option.label}
              </MegamenuCommandLabel>
            </MegamenuCommandItem>
          ))}
        </MegamenuColumnLayout>
      </Menu.Dropdown>
    </Menu>
  );
}

export function ToolbarSelectMenu({
  label,
  options,
  value,
  onChange,
  animateWidthToContent = false,
  buttonWidth,
  menuWidth = "target",
  mode = "dropdown-only",
  labelSize = "sm",
  pillFill = "var(--mantine-color-asxIndigo-0)",
  pillStroke = "1px solid var(--mantine-color-asxIndigo-2)",
  showTriggerIcon = true,
  showMenuIcons = true,
  withinPortal = true,
}: ToolbarSelectMenuProps) {
  const selected =
    options.find((option) => option.value === value) ??
    options[0];

  if (!selected) {
    return null;
  }

  const triggerButton = (
    <TriggerButton
      selected={selected}
      animateWidthToContent={animateWidthToContent}
      width={buttonWidth}
      pillFill={pillFill}
      pillStroke={pillStroke}
      showTriggerIcon={showTriggerIcon}
    />
  );

  const selectorMenuProps = {
    selected,
    options,
    menuWidth,
    showMenuIcons,
    withinPortal,
    onChange,
  };

  if (mode === "surrounded") {
    return (
      <SelectorMenu
        {...selectorMenuProps}
        target={
          <ToolbarBubble>
            <SelectorLabel
              label={label}
              size={labelSize}
              variant="surrounded"
            />
            {triggerButton}
          </ToolbarBubble>
        }
      />
    );
  }

  return (
    <Stack gap={4} style={{ width: "100%", minWidth: 0 }}>
      <SelectorLabel
        label={label}
        size={labelSize}
        variant="dropdown-only"
      />
      <SelectorMenu
        {...selectorMenuProps}
        target={triggerButton}
      />
    </Stack>
  );
}
