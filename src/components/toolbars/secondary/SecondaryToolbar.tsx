import MegamenuView from "./megamenus/MegamenuView";
import MegamenuActions from "./megamenus/MegamenuActions";
import MegamenuPublish from "./megamenus/MegamenuPublish";
import MegamenuNew from "./megamenus/MegamenuNew";

import { useRef, useState } from "react";

import {
  IconArrowBackUp,
  IconChevronDown,
  IconCircle,
  IconDeviceFloppy,
  IconSearch,
} from "@tabler/icons-react";

import {
  Box,
  Flex,
  Group,
  Paper,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";

type MenuKey =
  | "view"
  | "actions"
  | "publish"
  | "new"
  | null;

const ICON = IconCircle;

const menuContent: Record<
  Exclude<MenuKey, null>,
  string[]
> = {
  view: [
    "Index Mode",
    "Form Mode",
    "In Context Mode",
    "Show Path",
  ],
  actions: [
    "Rename",
    "Move",
    "Duplicate",
    "Delete",
  ],
  publish: [
    "Publish Now",
    "Schedule Publish",
    "Unpublish",
  ],
  new: [],
};

export default function SecondaryToolbar() {
  const [activeMenu, setActiveMenu] =
    useState<MenuKey>(null);

  const hoverTimeoutRef = useRef<number | null>(null);

  const [selectedViewMode, setSelectedViewMode] =
    useState<
      "Index Mode" |
      "Form Mode" |
      "In Context Mode"
    >("Index Mode");

  const [showFormIndex, setShowFormIndex] =
    useState(false);

  const [
    showInContextIndex,
    setShowInContextIndex,
  ] = useState(false);

  return (
    <Box
      bg="white"
      onMouseLeave={() => {
        if (hoverTimeoutRef.current) {
          window.clearTimeout(
            hoverTimeoutRef.current
          );
        }

        setActiveMenu(null);
      }}
    >
      <Flex
        h={52}
        px="xl"
        align="center"
        justify="space-between"
        style={{
          borderBottom:
            "1px solid var(--mantine-color-indigo-2)",
        }}
      >
        <Group gap="xl" wrap="nowrap">
          {(
            ["view", "actions", "publish", "new"] as Exclude<
              MenuKey,
              null
            >[]
          ).map((menu) => {
            const active = activeMenu === menu;

            return (
              <UnstyledButton
                key={menu}
                onClick={() => {
                  setActiveMenu((current) =>
                    current === menu ? null : menu
                  );
                }}
                onMouseEnter={() => {
                  if (hoverTimeoutRef.current) {
                    window.clearTimeout(
                      hoverTimeoutRef.current
                    );
                  }

                  if (activeMenu) {
                    setActiveMenu(menu);
                    return;
                  }

                  hoverTimeoutRef.current =
                    window.setTimeout(() => {
                      setActiveMenu(menu);
                    }, 200);
                }}
                style={{
                  height: 52,
                  display: "flex",
                  alignItems: "center",
                  borderBottom: active
                    ? "2px solid var(--mantine-color-indigo-6)"
                    : "2px solid transparent",
                  color:
                    "var(--mantine-color-gray-7)",
                  fontWeight: active ? 700 : 500,
                }}
              >
                <Group gap={6} wrap="nowrap">
                  <Text tt="capitalize">
                    {menu}
                  </Text>

                  <IconChevronDown size={20} />
                </Group>
              </UnstyledButton>
            );
          })}
        </Group>

        <Group gap="lg" wrap="nowrap">
          <IconArrowBackUp
            size={28}
            stroke={1}
          />

          <IconDeviceFloppy
            size={28}
            stroke={1}
          />

          <IconSearch
            size={28}
            stroke={1}
          />
        </Group>
      </Flex>

      {activeMenu && (
        <Paper
          radius={0}
          px="xl"
          py="lg"
          bg="gray.0"
          style={{
            borderBottom:
              "1px solid var(--mantine-color-indigo-2)",
          }}
        >
          <Stack gap="sm">
            {activeMenu === "view" ? (
              <MegamenuView
                selectedMode={selectedViewMode}
                onSelectMode={setSelectedViewMode}
                showFormIndex={showFormIndex}
                onToggleFormIndex={() =>
                  setShowFormIndex(
                    (current) => !current
                  )
                }
                showInContextIndex={showInContextIndex}
                onToggleInContextIndex={() =>
                  setShowInContextIndex(
                    (current) => !current
                  )
                }
              />
            ) : activeMenu === "actions" ? (
              <MegamenuActions />
            ) : activeMenu === "publish" ? (
              <MegamenuPublish />
            ) : activeMenu === "new" ? (
              <MegamenuNew />
            ) : (
              menuContent[activeMenu].map((item) => (
                <Group key={item} gap={10}>
                  <ICON size={12} />

                  <Text size="sm">{item}</Text>
                </Group>
              ))
            )}
          </Stack>
        </Paper>
      )}
    </Box>
  );
}