import {
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Box,
  Flex,
  Group,
  Menu,
  Paper,
  Text,
  UnstyledButton,
} from "@mantine/core";

import {
  IconAccessible,
  IconChartBar,
  IconChevronDown,
  IconCode,
  IconEye,
  IconFileText,
  IconHistory,
  IconInfoCircle,
  IconLayoutSidebarRight,
  IconPhoto,
  IconSettings,
  IconTags,
} from "@tabler/icons-react";

type ToolKey =
  | "Edit"
  | "Assets"
  | "Preview"
  | "Categorize"
  | "History"
  | "XML"
  | "Properties"
  | "Analytics"
  | "Accessibility";

const tools: {
  label: ToolKey;
  icon: ReactNode;
}[] = [
    {
      label: "Edit",
      icon: <IconFileText size={28}
        stroke={1} />,
    },
    {
      label: "Assets",
      icon: <IconPhoto size={28}
        stroke={1} />,
    },
    {
      label: "Preview",
      icon: <IconEye size={28}
        stroke={1} />,
    },
    {
      label: "Categorize",
      icon: <IconTags size={28}
        stroke={1} />,
    },
    {
      label: "History",
      icon: <IconHistory size={28}
        stroke={1} />,
    },
    {
      label: "XML",
      icon: <IconCode size={28}
        stroke={1} />,
    },
    {
      label: "Properties",
      icon: <IconSettings size={28}
        stroke={1} />,
    },
    {
      label: "Analytics",
      icon: <IconChartBar size={28}
        stroke={1} />,
    },
    {
      label: "Accessibility",
      icon: (
        <IconAccessible size={28}
          stroke={1} />
      ),
    },
  ];

type PrimaryToolbarProps = {
  selectedNodeLabel: string;
};

export function PrimaryToolbar({
  selectedNodeLabel,
}: PrimaryToolbarProps) {
  const [selectedTool, setSelectedTool] =
    useState<ToolKey>("Edit");

  const selected =
    tools.find(
      (tool) =>
        tool.label === selectedTool
    ) ?? tools[0];

  const measureRef =
    useRef<HTMLDivElement>(null);

  const [buttonWidth, setButtonWidth] =
    useState(136);

  useEffect(() => {
    if (measureRef.current) {
      setButtonWidth(
        measureRef.current
          .offsetWidth + 26
      );
    }
  }, [selectedTool]);

  return (
    <Flex
      h={72}
      px="xl"
      align="center"
      justify="space-between"
      bg="asxIndigo.1"
      style={{
        position: "relative",
        borderBottom:
          "1px solid var(--mantine-color-asxIndigo-3)",
      }}
    >
      <Box>
        <Group gap={8}>
          <Text
            size="lg"
            fw={500}
            c="asxIndigo.9"
          >
            {selectedNodeLabel}
          </Text>

          <IconInfoCircle
            size={18}
            color="var(--mantine-color-asxIndigo-9)"
          />
        </Group>

        <Text size="s" c="asxIndigo.8">
          x5 · Content workspace
        </Text>
      </Box>

      <Paper
        radius="xl"
        pl={18}
        py={6}
        bg="white"
        shadow="xs"
      >
        <Group gap="md">
          <Text
            fz={13}
            fw={500}
            c="asxIndigo.8"
            tt="uppercase"
          >
            Content Tools
          </Text>

          <Menu
            shadow="md"
            width={240}
            position="bottom-end"
          >
            <Menu.Target>
              <UnstyledButton
                style={{
                  width: buttonWidth,
                  height: 38,
                  paddingInline: 14,
                  borderRadius: 999,
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "flex-start",
                  gap: 10,
                  background:
                    "var(--mantine-color-asxIndigo-0)",
                  border:
                    "1px solid var(--mantine-color-asxIndigo-2)",
                  color:
                    "var(--mantine-color-asxGray-7)",
                  transition:
                    "width 180ms ease",
                  overflow: "hidden",
                }}
              >
                <Group
                  gap={8}
                  wrap="nowrap"
                >
                  {selected.icon}

                  <Text
                    size="sm"
                    fw={500}
                    style={{
                      whiteSpace:
                        "nowrap",
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
            </Menu.Target>

            <Menu.Dropdown>
              {tools.map((tool) => (
                <Menu.Item
                  key={tool.label}
                  leftSection={
                    tool.icon
                  }
                  onClick={() =>
                    setSelectedTool(
                      tool.label
                    )
                  }
                >
                  {tool.label}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>

          <Box
            h={28}
            w={1}
            bg="asxIndigo.4"
          />

          <Menu
            shadow="md"
            width={240}
            position="bottom-end"
          >
            <Menu.Target>
              <UnstyledButton
                style={{
                  height: 38,
                  paddingInline: 12,
                  borderRadius: 999,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color:
                    "var(--mantine-color-asxIndigo-7)",
                }}
              >

                <IconLayoutSidebarRight
                  size={28}
                  stroke={1.3}
                  color="var(--mantine-color-asxGray-7)"
                />

                <IconChevronDown
                  size={20}
                />
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                leftSection={
                  <IconEye size={28}
                    stroke={1} />
                }
              >
                View Site in Staging
              </Menu.Item>

              <Menu.Item
                leftSection={
                  <IconEye size={28}
                    stroke={1} />
                }
              >
                View Site in Production
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Paper>

      <Box
        ref={measureRef}
        style={{
          position: "absolute",
          visibility: "hidden",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        <Group
          gap={8}
          wrap="nowrap"
        >
          {selected.icon}

          <Text size="sm" fw={500}>
            {selected.label}
          </Text>

          <IconChevronDown size={20} />
        </Group>
      </Box>
    </Flex>
  );
}
