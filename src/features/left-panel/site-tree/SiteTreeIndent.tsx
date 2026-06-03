/*
 * File purpose: Indent spacer component that aligns nested tree rows.
 *
 * Imports:
 * - Box from "@mantine/core" provides Mantine UI primitives, theme helpers, component types, or styling utilities used in this file.
 */
import { Box } from "@mantine/core";

type SiteTreeIndentProps = {
  level: number;
};

export const SiteTreeIndent = ({ level }: SiteTreeIndentProps) => {
  return <DisplayGroup level={level} />;
};

function DisplayGroup({ level }: SiteTreeIndentProps) {
  return <Box w={level * 25} />;
}
