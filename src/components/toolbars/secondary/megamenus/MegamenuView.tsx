import {
  Box,
  Group,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";

import { IconAdjustmentsHorizontal } from "@tabler/icons-react";

type EditMode =
  | "Index Mode"
  | "Form Mode"
  | "In Context Mode";

type MegamenuViewProps = {
  selectedMode: EditMode;
  onSelectMode: (mode: EditMode) => void;
  showFormIndex: boolean;
  onToggleFormIndex: () => void;
  showInContextIndex: boolean;
  onToggleInContextIndex: () => void;
};

type ToggleItem = {
  type: "toggle";
  label: string;
  selected: boolean;
  onClick: () => void;
};

type CommandItem = {
  type: "command";
  label: string;
  onClick: () => void;
  icon?: React.ElementType;
};

type OptionItem = ToggleItem | CommandItem;

const editModes: EditMode[] = [
  "Index Mode",
  "Form Mode",
  "In Context Mode",
];

export default function MegamenuView({
  selectedMode,
  onSelectMode,
  showFormIndex,
  onToggleFormIndex,
  showInContextIndex,
  onToggleInContextIndex,
}: MegamenuViewProps) {
  const middleColumns: Partial<
    Record<
      EditMode,
      {
        title: string;
        items: OptionItem[];
      }
    >
  > = {
    "Form Mode": {
      title: "Form Options",
      items: [
        {
          type: "toggle",
          label: "Show Index",
          selected: showFormIndex,
          onClick: onToggleFormIndex,
        },
      ],
    },
    "In Context Mode": {
      title: "In Context Options",
      items: [
        {
          type: "toggle",
          label: "Show Index",
          selected: showInContextIndex,
          onClick: onToggleInContextIndex,
        },
        {
          type: "command",
          label: "Preview Options",
          icon: IconAdjustmentsHorizontal,
          onClick: () => {
            console.log("Preview Options");
          },
        },
      ],
    },
  };

  const otherItems: CommandItem[] = [
    {
      type: "command",
      label: "Show Path",
      onClick: () => {
        console.log("Show Path");
      },
    },
    {
      type: "command",
      label: "Preview",
      onClick: () => {
        console.log("Preview");
      },
    },
  ];

  const middleColumn = middleColumns[selectedMode];
  const hasMiddleSection = Boolean(middleColumn);

  const toggleRowStyle = (selected: boolean) => ({
    width: "100%",
    padding: "8px 10px",
    borderRadius: 8,
    background: selected
      ? "var(--mantine-color-indigo-1)"
      : "transparent",
    color: selected
      ? "var(--mantine-color-indigo-9)"
      : "var(--mantine-color-asxGray-8)",
    fontWeight: selected ? 700 : 500,
  });

  const commandRowStyle = {
    width: "100%",
    padding: "8px 10px",
    borderRadius: 8,
    color: "var(--mantine-color-asxGray-8)",
    fontWeight: 500,
  };

  const checkStyle = (selected: boolean) => ({
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
    textAlign: "center" as const,
    flexShrink: 0,
  });

  const renderOptionItem = (item: OptionItem) => {
    if (item.type === "toggle") {
      return (
        <UnstyledButton
          key={item.label}
          onClick={item.onClick}
          style={toggleRowStyle(item.selected)}
        >
          <Group gap="xs" wrap="nowrap">
            <Box style={checkStyle(item.selected)}>
              {item.selected ? "✓" : ""}
            </Box>

            <Text size="sm">{item.label}</Text>
          </Group>
        </UnstyledButton>
      );
    }

    const Icon = item.icon;

    return (
      <UnstyledButton
        key={item.label}
        onClick={item.onClick}
        style={commandRowStyle}
      >
        <Group gap="xs" wrap="nowrap">
          {Icon && (
            <Icon
              size={28}
              stroke={1.3}
              color="var(--mantine-color-asxGray-7)"
            />
          )}

          <Text size="sm">{item.label}</Text>
        </Group>
      </UnstyledButton>
    );
  };

  return (
    <Group align="stretch" gap={0}>
      <Stack gap={8} pr="xl" w={240}>
        <Text
          size="xs"
          fw={700}
          c="asxGray.6"
          tt="uppercase"
        >
          Edit Modes
        </Text>

        {editModes.map((mode) => {
          const selected = selectedMode === mode;

          return (
            <UnstyledButton
              key={mode}
              onClick={() => onSelectMode(mode)}
              style={{
                minWidth: 180,
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
              <Text size="sm">{mode}</Text>
            </UnstyledButton>
          );
        })}
      </Stack>

      <Box
        style={{
          width: hasMiddleSection ? 240 : 0,
          overflow: "hidden",
          transition: "width 180ms ease",
        }}
      >
        <Group
          gap={0}
          align="stretch"
          style={{
            width: 240,
            transform: hasMiddleSection
              ? "translateX(0)"
              : "translateX(-12px)",
            opacity: hasMiddleSection ? 1 : 0,
            transition:
              "transform 180ms ease, opacity 120ms ease",
          }}
        >
          {middleColumn && (
            <Stack gap={8} pl="xl" w="100%">
              <Text
                size="xs"
                fw={700}
                c="asxGray.6"
                tt="uppercase"
              >
                {middleColumn.title}
              </Text>

              {middleColumn.items.map(renderOptionItem)}
            </Stack>
          )}
        </Group>
      </Box>

      <Stack gap={8} px="xl">
        <Text
          size="xs"
          fw={700}
          c="asxGray.6"
          tt="uppercase"
        >
          Other Options
        </Text>

        {otherItems.map(renderOptionItem)}
      </Stack>
    </Group>
  );
}