/*
 * File purpose: Shared vertical delimiter for separating groups of toolbar actions.
 *
 * Imports:
 * - Box from "@mantine/core" provides the Mantine layout primitive used to draw the delimiter.
 */
import { Box } from "@mantine/core";

type ToolbarDelimiterProps = {
  color?: string;
};

export function ToolbarDelimiter({
  color = "var(--mantine-color-asxBlue-2)",
}: ToolbarDelimiterProps) {
  return (
    <Box
      w={1}
      bg={color}
      aria-hidden="true"
      style={{
        alignSelf: "stretch",
        flexShrink: 0,
      }}
    />
  );
}
