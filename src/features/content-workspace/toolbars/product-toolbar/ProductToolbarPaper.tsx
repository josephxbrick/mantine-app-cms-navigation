import {
  useEffect,
  useRef,
  useState,
} from "react";
import type {
  CSSProperties,
  ReactNode,
} from "react";

import {
  ActionIcon,
  Box,
  Group,
  Paper,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";

import {
  IconChevronDown,
  IconCircleArrowUp,
  IconHelpCircle,
  IconSearch,
  IconUserCircle,
  IconX,
} from "@tabler/icons-react";

type ProductToolbarPaperProps = {
  mode: "default" | "search";
  demoWorkspaceVisible: boolean;
  onGoTo: () => void;
  onCloseSearch: () => void;
  onToggleDemoWorkspace: () => void;
};

const FIELD_FULL_WIDTH = 240;
const FIELD_COLLAPSED_WIDTH = 0;
const ANIMATION_MS = 260;

type ToolbarGroupProps = {
  children: ReactNode;
};

function DisplayGroup({ children }: ToolbarGroupProps) {
  return (
    <Group gap="lg" wrap="nowrap">
      {children}
    </Group>
  );
}

function SearchControlGroup({
  children,
}: ToolbarGroupProps) {
  return (
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
      {children}
    </Group>
  );
}

function GoToButtonGroup({
  children,
}: ToolbarGroupProps) {
  return (
    <Group gap={4} wrap="nowrap">
      {children}
    </Group>
  );
}

function UserButtonGroup({
  children,
}: ToolbarGroupProps) {
  return (
    <Group gap={6} wrap="nowrap">
      {children}
    </Group>
  );
}

function ToolbarDelimiter() {
  return <Box h={28} w={1} bg="asxBlue.2" />;
}

type GoToSearchControlProps = {
  fieldWidth: number;
  searchVisible: boolean;
  searchValue: string;
  onOpen: () => void;
  onClose: () => void;
  onSearchChange: (value: string) => void;
};

function GoToSearchControl({
  fieldWidth,
  searchVisible,
  searchValue,
  onOpen,
  onClose,
  onSearchChange,
}: GoToSearchControlProps) {
  return (
    <Box
      style={{
        position: "relative",
        height: 38,
        width: 84 + fieldWidth,
        transition: `width ${ANIMATION_MS}ms ease`,
        overflow: "hidden",
      }}
    >
      <SearchControlGroup>
        <GoToButton
          onClick={searchVisible ? onClose : onOpen}
        />

        <SearchFieldSlot
          fieldWidth={fieldWidth}
          searchVisible={searchVisible}
          searchValue={searchValue}
          onClose={onClose}
          onSearchChange={onSearchChange}
        />
      </SearchControlGroup>
    </Box>
  );
}

type GoToButtonProps = {
  onClick: () => void;
};

function GoToButton({ onClick }: GoToButtonProps) {
  return (
    <UnstyledButton onClick={onClick}>
      <GoToButtonGroup>
        <IconCircleArrowUp
          size={28}
          stroke={1.3}
          color="var(--mantine-color-asxGray-0)"
        />

        <Text
          size="sm"
          fw={400}
          c="asxGray.0"
          style={{ whiteSpace: "nowrap" }}
        >
          Go To
        </Text>
      </GoToButtonGroup>
    </UnstyledButton>
  );
}

type SearchFieldSlotProps = {
  fieldWidth: number;
  searchVisible: boolean;
  searchValue: string;
  onClose: () => void;
  onSearchChange: (value: string) => void;
};

function SearchFieldSlot({
  fieldWidth,
  searchVisible,
  searchValue,
  onClose,
  onSearchChange,
}: SearchFieldSlotProps) {
  return (
    <Box
      style={{
        width: searchVisible ? fieldWidth : 0,
        overflow: "hidden",
        transition: `width ${ANIMATION_MS}ms ease`,
      }}
    >
      <TextInput
        leftSection={
          <IconSearch
            size={24}
            stroke={1.3}
            color="var(--mantine-color-asxGray-7)"
          />
        }
        rightSection={
          <ActionIcon
            variant="transparent"
            color="asxBlue.0"
            size="sm"
            onClick={onClose}
          >
            <IconX
              size={28}
              stroke={1.3}
              color="var(--mantine-color-asxGray-7)"
            />
          </ActionIcon>
        }
        placeholder="Enter name or xID"
        size="sm"
        value={searchValue}
        w={FIELD_FULL_WIDTH}
        radius="xl"
        onChange={(event) =>
          onSearchChange(event.currentTarget.value)
        }
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onClose();
          }
        }}
        styles={{
          input: {
            "--input-placeholder-color":
              "var(--mantine-color-asxGray-6)",
          } as CSSProperties,
        }}
      />
    </Box>
  );
}

function UserMenuButton() {
  return (
    <UnstyledButton>
      <UserButtonGroup>
        <IconUserCircle size={28} stroke={1.3} />

        <IconChevronDown size={20} />
      </UserButtonGroup>
    </UnstyledButton>
  );
}

type HelpButtonProps = {
  active: boolean;
  onClick: () => void;
};

function HelpButton({ active, onClick }: HelpButtonProps) {
  return (
    <ActionIcon
      variant={active ? "filled" : "subtle"}
      color="asxBlue"
      c="asxGray.0"
      size="lg"
      aria-label="Toggle workspace demo images"
      onClick={onClick}
    >
      <IconHelpCircle size={28} stroke={1.3} />
    </ActionIcon>
  );
}

export function ProductToolbarPaper({
  mode,
  demoWorkspaceVisible,
  onGoTo,
  onCloseSearch,
  onToggleDemoWorkspace,
}: ProductToolbarPaperProps) {
  const [searchVisible, setSearchVisible] =
    useState(mode === "search");
  const [fieldWidth, setFieldWidth] = useState(
    mode === "search"
      ? FIELD_FULL_WIDTH
      : FIELD_COLLAPSED_WIDTH
  );
  const [searchValue, setSearchValue] = useState("");

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
    setSearchValue("");
    setFieldWidth(FIELD_COLLAPSED_WIDTH);

    timerRef.current = window.setTimeout(() => {
      setSearchVisible(false);
      onCloseSearch();
    }, ANIMATION_MS);
  };

  const goToSearchControlProps = {
    fieldWidth,
    searchVisible,
    searchValue,
    onOpen: handleOpen,
    onClose: handleClose,
    onSearchChange: setSearchValue,
  };

  return (
    <Paper
      radius="xl"
      px={10}
      py={2}
      bg="asxBlue.7"
      shadow="xs"
      style={{
        border:
          "1px solid var(--mantine-color-asxBlue-3)",
      }}
    >
      <DisplayGroup>
        <GoToSearchControl {...goToSearchControlProps} />
        <ToolbarDelimiter />
        <UserMenuButton />
        <HelpButton
          active={demoWorkspaceVisible}
          onClick={onToggleDemoWorkspace}
        />
      </DisplayGroup>
    </Paper>
  );
}
