/*
 * Site tree indentation spacer.
 * - Creates horizontal offset based on a node's depth.
 * - Keeps tree item layout math isolated from the row component.
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
