/*
 * Preview view megamenu content.
 * - Displays preview device selection and preview commands.
 * - Tracks the selected preview device through caller-owned state.
 */
import {
  Group,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useState } from "react";
import { IconExternalLink } from "@tabler/icons-react";

import {
  PreviewDeviceColumn,
  type PreviewDevice,
} from "./PreviewDeviceColumn";

type MegamenuPreviewViewProps = {
  selectedDevice: PreviewDevice;
  onSelectDevice: (device: PreviewDevice) => void;
};

export default function MegamenuPreviewView({
  selectedDevice,
  onSelectDevice,
}: MegamenuPreviewViewProps) {
  return (
    <Group align="stretch" gap={32}>
      <PreviewDeviceColumn
        selectedDevice={selectedDevice}
        onSelectDevice={onSelectDevice}
      />
      <PreviewCommandColumn />
    </Group>
  );
}

function PreviewCommandColumn() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Stack gap={8} w={240}>
      <ColumnTitle title="Preview" />
      <UnstyledButton
        onClick={() =>
          console.log("View in New Browser Window")
        }
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: "100%",
          padding: "0 10px",
          borderRadius: 8,
          border: isHovered
            ? "1px solid var(--mantine-color-asxBlue-1)"
            : "1px solid transparent",
          background: isHovered
            ? "var(--mantine-color-asxBlue-0)"
            : "transparent",
        }}
      >
        <Group gap={12} py={6}>
          <IconExternalLink
            size={28}
            stroke={1.3}
            color="var(--mantine-color-asxGray-7)"
          />

          <Text size="sm" fw={500} c="asxGray.7">
            View in New Browser Window
          </Text>
        </Group>
      </UnstyledButton>
    </Stack>
  );
}

type ColumnTitleProps = {
  title: string;
};

function ColumnTitle({ title }: ColumnTitleProps) {
  return (
    <Text size="xs" fw={700} c="asxGray.6" tt="uppercase">
      {title}
    </Text>
  );
}
