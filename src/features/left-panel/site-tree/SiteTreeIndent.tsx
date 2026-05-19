import { Box } from "@mantine/core";

type SiteTreeIndentProps = {
  level: number;
};

export const SiteTreeIndent = ({ level }: SiteTreeIndentProps) => {
  return <Box w={level * 25} />;
};