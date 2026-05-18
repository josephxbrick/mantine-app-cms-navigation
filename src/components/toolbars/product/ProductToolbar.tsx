import { useEffect, useRef, useState } from "react";

import {
  ActionIcon,
  Box,
  Flex,
  Group,
  Paper,
  Text,
  TextInput,
  UnstyledButton,
  Stack,
} from "@mantine/core";

import {
  IconChevronDown,
  IconCircleArrowUp,
  IconHelpCircle,
  IconHistory,
  IconSearch,
  IconUserCircle,
  IconX,
} from "@tabler/icons-react";

type ProductToolbarProps = {
  mode: "default" | "search";
  onGoTo: () => void;
  onCloseSearch: () => void;
};

const FIELD_FULL_WIDTH = 360;
const FIELD_COLLAPSED_WIDTH = 0;
const ANIMATION_MS = 260;

export function ProductToolbar({
  mode,
  onGoTo,
  onCloseSearch,
}: ProductToolbarProps) {
  const [searchVisible, setSearchVisible] = useState(mode === "search");
  const [fieldWidth, setFieldWidth] = useState(
    mode === "search" ? FIELD_FULL_WIDTH : FIELD_COLLAPSED_WIDTH
  );

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleOpen = () => {
    onGoTo();

    setSearchVisible(true);
    setFieldWidth(FIELD_COLLAPSED_WIDTH);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setFieldWidth(FIELD_FULL_WIDTH);
      });
    });
  };

  const handleClose = () => {
    setFieldWidth(FIELD_COLLAPSED_WIDTH);

    timerRef.current = window.setTimeout(() => {
      setSearchVisible(false);
      onCloseSearch();
    }, ANIMATION_MS);
  };

  return (
    <Flex
      h={72}
      px="xl"
      align="center"
      justify="space-between"
      bg="asxBlue.9"
      c="asxGray.0"
    >
      <Stack gap={0}>
        <Text size="xl" fw={400}>
          Ingeniux CMS
        </Text>

        <Text size="s" c="asxBlue.1">
          Content management workspace
        </Text>
      </Stack>

      <Paper
        radius="xl"
        px={10}
        py={4}
        bg="asxBlue.7"
        shadow="xs"
        style={{
          border: "1px solid var(--mantine-color-asxBlue-4)",
        }}
      >
        <Group gap="lg" wrap="nowrap">
          <Box
            style={{
              position: "relative",
              height: 38,
              width: 84 + fieldWidth,
              transition: `width ${ANIMATION_MS}ms ease`,
              overflow: "hidden",
            }}
          >
            <Group
              gap="sm"
              wrap="nowrap"
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                height: 38,
                alignItems: "center",
              }}
            >
              <UnstyledButton
                onClick={
                  searchVisible
                    ? handleClose
                    : handleOpen
                }
              >
                <Group gap={4} wrap="nowrap">
                  <IconCircleArrowUp size={28}
                    stroke={1.3} color="var(--mantine-color-asxGray-0)" />

                  <Text size="sm" fw={400} c="asxGray.0" style={{ whiteSpace: "nowrap" }}>
                    Go To
                  </Text>
                </Group>
              </UnstyledButton>

              <Box
                style={{
                  width: searchVisible ? fieldWidth : 0,
                  overflow: "hidden",
                  transition: `width ${ANIMATION_MS}ms ease`,
                }}
              >
                <TextInput
                  leftSection={<IconSearch size={24 }
                    stroke={1.3} color="var(--mantine-color-asxGray-7)"/>}
                  rightSection={
                    <ActionIcon
                      variant="transparent"
                      color="asxBlue"
                      size="sm"
                      onClick={handleClose}
                    >
                      <IconX size={28}
                        stroke={1.3} />  
                    </ActionIcon>
                  }
                  placeholder="Enter name or xID"
                  size="sm"
                  w={FIELD_FULL_WIDTH}
                  radius="xl"
                />
              </Box>
            </Group>
          </Box>

          <Box h={28} w={1} bg="asxBlue.4" />

          <UnstyledButton>
            <Group gap={8} wrap="nowrap">
              <IconHistory size={28}
                stroke={1.3} color="var(--mantine-color-asxGray-0)" />

              <Text size="sm" fw={400} c="asxGray.0">
                Recent
              </Text>

              <IconChevronDown size={20} />
            </Group>
          </UnstyledButton>

          <Box h={28} w={1} bg="asxBlue.4" />

          <UnstyledButton>
            <Group gap={6} wrap="nowrap">
              <IconUserCircle size={28}
                stroke={1.3} />

              <IconChevronDown size={20} />
            </Group>
          </UnstyledButton>

          <Box h={28} w={1} bg="asxBlue.4" />

          <ActionIcon variant="subtle" color="asxBlue" c="asxGray.0" size="lg">
            <IconHelpCircle size={28}
              stroke={1.3} />
          </ActionIcon>
        </Group>
      </Paper>
    </Flex>
  );
}