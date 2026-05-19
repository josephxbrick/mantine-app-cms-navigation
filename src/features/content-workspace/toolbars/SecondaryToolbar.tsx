import MegamenuView from "../tools/edit/megamenus/MegamenuView";
import MegamenuActions from "../tools/edit/megamenus/MegamenuActions";
import MegamenuPublish from "../tools/edit/megamenus/MegamenuPublish";
import MegamenuNew from "../tools/edit/megamenus/MegamenuNew";

import { useRef, useState } from "react";

import {
  IconArrowBackUp,
  IconChevronDown,
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

  const [showPath, setShowPath] =
    useState(false);

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
                  if (hoverTimeoutRef.current) {
                    window.clearTimeout(
                      hoverTimeoutRef.current
                    );
                  }

                  setActiveMenu(menu);
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
                showPath={showPath}
                onToggleShowPath={() =>
                  setShowPath(
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
              null
            )}
          </Stack>
        </Paper>
      )}
    </Box>
  );
}
